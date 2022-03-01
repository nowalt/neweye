import type { NextPage } from "next";
import { useRouter } from "next/router";

import { useUser, useProject } from "../../../../../../client/lib/hooks";
import Header from "../../../../../../client/components/Header";
import EyeRunner from "../../../../../../client/components/EyeRunner";

const ProjectTaskPage: NextPage = () => {
  const router = useRouter();
  const slug = router.query.teamSlug as string;
  const num = router.query.projectNum as string;

  // 防止未登入的人
  useUser();

  const { project, error: projectError } = useProject({ num, teamSlug: slug });

  if (projectError) {
    return <div>Error: {projectError.info || projectError.message}</div>;
  }

  if (!project) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen min-h-screen-ios">
      <Header />
      <EyeRunner w={320} h={240} />
    </div>
  );
};

export default ProjectTaskPage;
