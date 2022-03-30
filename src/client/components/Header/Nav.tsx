/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/router";
import Link from "next/link";

import { useUser, useTeam, useProject, useEye } from "../../lib/hooks";
import ProfileDropdown from "./ProfileDropdown";
import TeamDropdown from "./TeamDropdown";
import TeamProjectDropdown from "./TeamProjectDropdown";
import EyeDropdown from "./EyeDropdown";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Nav() {
  const router = useRouter();
  const slug = router.query.teamSlug as string;
  const projectNum = router.query.projectNum as string;
  const eyeNum = router.query.eyeNum as string;

  // 為了拿取 user.teams
  const user = useUser();

  const { team, error: teamError } = useTeam({ slug });
  const { project, error: projectError } = useProject({
    num: projectNum,
    teamSlug: slug,
  });
  const { eye, error: eyeError } = useEye({
    num: eyeNum,
    projectId: project?.id,
  });

  if (teamError) {
    return <div>Error: {teamError.info || teamError.message}</div>;
  }

  if (projectError) {
    return <div>Error: {projectError.info || projectError.message}</div>;
  }

  if (eyeError) {
    return <div>Error: {eyeError.info || eyeError.message}</div>;
  }

  if (!team || !user || (projectNum && !project) || (eyeNum && !eye)) {
    return null;
  }

  const tabs = eye
    ? [
        {
          name: "所有記錄",
          href: `/${slug}/projects/${projectNum}/eyes/${eyeNum}`,
          current:
            router.asPath === `/${slug}/projects/${projectNum}/eyes/${eyeNum}`,
        },
        {
          name: "記錄圖表",
          href: `/${slug}/projects/${projectNum}/eyes/${eyeNum}/chart`,
          current:
            router.asPath ===
            `/${slug}/projects/${projectNum}/eyes/${eyeNum}/chart`,
        },
      ]
    : project
    ? [
        {
          name: "所有智能眼",
          href: `/${slug}/projects/${projectNum}`,
          current: router.asPath === `/${slug}/projects/${projectNum}`,
        },
        {
          name: "記錄圖表",
          href: `/${slug}/projects/${projectNum}/chart`,
          current: router.asPath === `/${slug}/projects/${projectNum}/chart`,
        },
        // {
        //   name: "所有記錄",
        //   href: `/${slug}/projects/${num}/records`,
        //   current: router.asPath === `/${slug}/projects/${num}/records`,
        // },
      ]
    : [
        {
          name: "專案",
          href: `/${slug}`,
          current: router.asPath === `/${slug}`,
        },
      ];

  return (
    <nav>
      {/* Secondary navigation */}
      <div className="bg-gray-100 border-b border-gray-300">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center">
            {/* Logo (lg+) */}
            <div className="flex lg:items-center w-10 min-w-[2.5rem] mr-1">
              <a href="/">
                <img className="h-8 w-8" src="/logo.svg" alt="" />
              </a>
            </div>

            <div className="flex flex-grow items-center">
              {(!!project || user.teams.length === 1) && (
                <Link href={`/${team.slug}`}>
                  <a className="items-center p-2 text-lg font-medium leading-3 transition rounded">
                    {team.name}
                  </a>
                </Link>
              )}
              {!project && user.teams.length > 1 && <TeamDropdown />}
              {!!project && (
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
              )}
              {!!project && (team.projects.length === 1 || !!eye) && (
                <Link href={`/${team.slug}/projects/${project.num}`}>
                  <a className="items-center p-2 text-lg font-medium leading-3 transition rounded">
                    {project.name}
                  </a>
                </Link>
              )}
              {!eye && !!project && team.projects.length > 1 && (
                <TeamProjectDropdown />
              )}
              {!!eye && (
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
              )}
              {!!eye && project.eyes.length === 1 && (
                <Link
                  href={`/${team.slug}/projects/${project.num}/eyes/${eye.num}`}
                >
                  <a className="items-center p-2 text-lg font-medium leading-3 transition rounded">
                    {eye.name}
                  </a>
                </Link>
              )}
              {!!eye && project.eyes.length > 1 && <EyeDropdown />}
            </div>

            <div className="flex items-center justify-end">
              <ProfileDropdown />
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 -mb-px">
          <div className="">
            <div className="border-b border-gray-300">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <Link key={tab.name} href={tab.href}>
                    <a
                      className={classNames(
                        tab.current
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-900",
                        "whitespace-nowrap py-4 px-1 border-b font-medium text-sm"
                      )}
                    >
                      {tab.name}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
