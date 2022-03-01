import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

import { useUser, useProject } from "../../../../client/lib/hooks";
import Header from "../../../../client/components/Header";
import CreateEyeModal from "../../../../client/components/CreateEyeModal";

const TeamPage: NextPage = () => {
  const router = useRouter();
  const slug = router.query.teamSlug as string;
  const num = router.query.projectNum as string;

  // 防止未登入的人
  useUser();

  const { project, error: projectError } = useProject({ num, teamSlug: slug });

  const [open, setOpen] = useState(false);

  if (projectError) {
    return <div>Error: {projectError.info || projectError.message}</div>;
  }

  if (!project) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen min-h-screen-ios">
      <Header />
      <div className="max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <div className="flex items-center justify-between">
            <h2 className="flex-1 min-w-0 text-lg font-medium text-gray-900">
              所有智能眼
            </h2>
            <div className="flex">
              <button
                type="button"
                className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  setOpen(true);
                }}
              >
                新增智能眼
              </button>
            </div>
          </div>

          <div className="mt-4 bg-white border">
            <ul role="list" className="divide-y divide-gray-200">
              {!!project.eyes.length &&
                project.eyes.map((eye: any) => (
                  <li key={eye.id}>
                    <div className="block hover:bg-gray-50 w-full">
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div className="truncate">
                            <div className="flex text-sm">
                              <Link
                                href={`/${project.team.slug}/projects/${project.num}/eyes/${eye.num}`}
                              >
                                <a className="font-medium text-gray-600 truncate hover:underline">
                                  {eye.name}
                                </a>
                              </Link>
                            </div>
                          </div>
                          <div className="hidden flex-shrink-0 sm:ml-5 sm:block"></div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}

              {!project.eyes.length && (
                <li>
                  <div className="block w-full">
                    <div className="px-4 py-4 flex items-center sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <p className="text-center text-sm font-medium text-gray-600 truncate">
                          無
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {open && <CreateEyeModal setOpen={setOpen} project={project} />}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
