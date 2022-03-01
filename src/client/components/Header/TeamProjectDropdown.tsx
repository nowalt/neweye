import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";

import { useTeam, useProject } from "../../lib/hooks";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TeamProjectDropdown() {
  const router = useRouter();
  const slug = router.query.teamSlug as string;
  const num = router.query.projectNum as string;

  const { team, error: teamError } = useTeam({ slug });
  const { project: currentProject, error: projectError } = useProject({
    num,
    teamSlug: slug,
  });

  if (teamError) {
    return <div>Error: {teamError.info || teamError.message}</div>;
  }

  if (projectError) {
    return <div>Error: {projectError.info || projectError.message}</div>;
  }

  if (!team || !currentProject) {
    return null;
  }

  return (
    <Menu as="div" className="inline-block text-left sm:relative">
      <Menu.Button>
        <span className="flex items-center justify-center rounded p-2 font-medium leading-none focus-ring text-lg bg-inherit hover:bg-gray-200">
          {currentProject.name}
          <ChevronDownIcon
            className={classNames("text-gray-600", "ml-1 h-4 w-4")}
            aria-hidden="true"
          />
        </span>
      </Menu.Button>

      <Menu.Items className="z-10 origin-top-left absolute left-0 right-0 py-1 mx-6 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-200 sm:right-auto sm:mx-0 sm:w-96">
        <div className="py-1">
          {team.projects.map((project: any) => (
            <Menu.Item key={project.id}>
              {({ active }) => (
                <div>
                  <button
                    className={classNames(
                      currentProject.id === project.id
                        ? "bg-indigo-100"
                        : active
                        ? "bg-gray-100"
                        : "",
                      "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                    )}
                    onClick={() => {
                      router.push(`/${team.slug}/projects/${project.num}`);
                    }}
                  >
                    {project.name}
                  </button>
                </div>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}
