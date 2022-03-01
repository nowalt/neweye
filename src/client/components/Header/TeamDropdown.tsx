import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";

import { useUser, useTeam } from "../../lib/hooks";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TeamDropdown() {
  const router = useRouter();
  const slug = router.query.teamSlug as string;

  // 為了拿取 user.teams
  const user = useUser();

  const { team, error } = useTeam({ slug });

  if (error) {
    return <div>Error: {error.info || error.message}</div>;
  }

  if (!team || !user) {
    return null;
  }

  return (
    <Menu as="div" className="inline-block text-left sm:relative">
      <Menu.Button>
        <span className="flex items-center justify-center rounded p-2 font-medium leading-none focus-ring text-lg bg-inherit hover:bg-gray-200">
          {team.name}
          <ChevronDownIcon
            className={classNames("text-gray-600", "ml-1 h-4 w-4")}
            aria-hidden="true"
          />
        </span>
      </Menu.Button>

      <Menu.Items className="z-10 origin-top-left absolute left-0 right-0 py-1 mx-6 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-200 sm:right-auto sm:mx-0 sm:w-96">
        <div className="py-1">
          {user.teams.map((member: any) => (
            <Menu.Item key={member.team.id}>
              {({ active }) => (
                <div>
                  <button
                    className={classNames(
                      slug === member.team.slug
                        ? "bg-indigo-100"
                        : active
                        ? "bg-gray-100"
                        : "",
                      "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                    )}
                    onClick={() => {
                      router.push(`/${member.team.slug}`);
                    }}
                  >
                    {member.team.name}
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
