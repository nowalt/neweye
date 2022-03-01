import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

import { useUser, useTeam } from "../../../client/lib/hooks";
import Header from "../../../client/components/Header";
import CreateProjectModal from "../../../client/components/CreateProjectModal";

const TeamPage: NextPage = () => {
  const router = useRouter();
  const slug = router.query.teamSlug as string;

  // 防止未登入的人
  const user = useUser();

  const { team, error } = useTeam({ slug });

  const [open, setOpen] = useState(false);

  if (error) {
    return <div>Error: {error.info || error.message}</div>;
  }

  if (!user || !team) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen min-h-screen-ios">
      <Header />
      <div className="max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <div className="flex items-center justify-between">
            <h2 className="flex-1 min-w-0 text-lg font-medium text-gray-900">
              所有專案
            </h2>
            <div className="flex">
              <button
                type="button"
                className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  setOpen(true);
                }}
              >
                新增專案
              </button>
            </div>
          </div>

          <div className="mt-4 bg-white border">
            <ul role="list" className="divide-y divide-gray-200">
              {!!team.projects.length &&
                team.projects.map((project: any) => (
                  <li key={project.id}>
                    <div className="block hover:bg-gray-50 w-full">
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div className="truncate">
                            <div className="flex text-sm">
                              <Link
                                href={`/${team.slug}/projects/${project.num}`}
                              >
                                <a className="font-medium text-gray-600 truncate hover:underline">
                                  {project.name}
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

              {!team.projects.length && (
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

          {open && <CreateProjectModal setOpen={setOpen} team={team} />}

          {/* <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">成員狀態</h2>
                <div className="mt-4">
                  <div className="grid grid-cols-3 gap-3">
                    {team.members.map(({ user }: { user: any }) => {
                      return (
                        <div key={user.id}>
                          <button
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            onClick={() => {
                              setSelectedUser(user);
                            }}
                          >
                            <span>{user.name}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-4">
                  {!!selectedUser && (
                    <>
                      <div className="relative my-4">
                        <div
                          className="absolute inset-0 flex items-center"
                          aria-hidden="true"
                        >
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-2 bg-white text-sm text-gray-500">
                            成員狀態 ({(selectedUser as any).name})
                          </span>
                        </div>
                      </div>

                      <div className="mt-1 flex justify-center">
                        <input
                          id="date"
                          name="date"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                          }}
                          className="w-full appearance-none block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="mt-4 px-2">
                        <UserStatusesList
                          date={selectedDate}
                          userId={(selectedUser as any).id}
                          teamId={team.id}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div> */}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
