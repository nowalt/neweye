import type { NextPage } from "next";
import { useRouter } from "next/router";

import {
  useUser,
  useProject,
  useEyeWithRecords,
} from "../../../../../../client/lib/hooks";
import Header from "../../../../../../client/components/Header";
import EyeRunner from "../../../../../../client/components/EyeRunner";

const ProjectTaskPage: NextPage = () => {
  const router = useRouter();
  const slug = router.query.teamSlug as string;
  const projectNum = router.query.projectNum as string;
  const eyeNum = router.query.eyeNum as string;

  // 防止未登入的人
  useUser();

  const { project, error: projectError } = useProject({
    num: projectNum,
    teamSlug: slug,
  });

  const { eye, error: eyeError } = useEyeWithRecords({
    projectId: project?.id,
    num: eyeNum,
    skip: 0,
    take: 20,
  });

  if (projectError) {
    return <div>Error: {projectError.info || projectError.message}</div>;
  }

  if (eyeError) {
    return <div>Error: {eyeError.info || eyeError.message}</div>;
  }

  if (!project || !eye) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen min-h-screen-ios">
      <Header />
      <EyeRunner />
    </div>
  );
};

export default ProjectTaskPage;
