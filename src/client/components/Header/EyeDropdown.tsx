import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";

import { useProject, useEye } from "../../lib/hooks";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TeamProjectDropdown() {
  const router = useRouter();
  const slug = router.query.teamSlug as string;
  const projectNum = router.query.projectNum as string;
  const eyeNum = router.query.eyeNum as string;

  const { project, error: projectError } = useProject({
    num: projectNum,
    teamSlug: slug,
  });

  const { eye: currentEye, error: eyeError } = useEye({
    num: eyeNum,
    projectId: project?.id,
  });

  if (projectError) {
    return <div>Error: {projectError.info || projectError.message}</div>;
  }

  if (eyeError) {
    return <div>Error: {eyeError.info || eyeError.message}</div>;
  }

  if (!project || !currentEye) {
    return null;
  }

  return (
    <Menu as="div" className="inline-block text-left sm:relative">
      <Menu.Button>
        <span className="flex items-center justify-center rounded p-2 font-medium leading-none focus-ring text-lg bg-inherit hover:bg-gray-200">
          {currentEye.name}
          <ChevronDownIcon
            className={classNames("text-gray-600", "ml-1 h-4 w-4")}
            aria-hidden="true"
          />
        </span>
      </Menu.Button>

      <Menu.Items className="z-10 origin-top-left absolute left-0 right-0 py-1 mx-6 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-200 sm:right-auto sm:mx-0 sm:w-96">
        <div className="py-1">
          {project.eyes.map((eye: any) => (
            <Menu.Item key={eye.id}>
              {({ active }) => (
                <div>
                  <button
                    className={classNames(
                      currentEye.id === eye.id
                        ? "bg-indigo-100"
                        : active
                        ? "bg-gray-100"
                        : "",
                      "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                    )}
                    onClick={() => {
                      router.push(
                        `/${project.team.slug}/projects/${project.num}/eyes/${eye.num}`
                      );
                    }}
                  >
                    {eye.name}
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
