import { Menu } from "@headlessui/react";
import { useState } from "react";
import Link from "next/link";

import Avatar from "../Avatar";
// import CreateTeamModal from "./CreateTeamModal";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileDropdown() {
  // 控制創建 Team modal 是否開啟
  const [open, setOpen] = useState(false);

  return (
    <>
      <Menu as="div" className="ml-4 relative flex-shrink-0">
        <div>
          <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Avatar
              className="h-8 w-8 rounded-full border border-gray-400"
              src={""}
            />
          </Menu.Button>
        </div>
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-200">
          {/* <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <div>
                  <button
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                    )}
                    onClick={() => setOpen(true)}
                  >
                    建立新的 Team
                  </button>
                </div>
              )}
            </Menu.Item>
          </div> */}
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <div>
                  <Link href="/api/auth/logout">
                    <a
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      登出
                    </a>
                  </Link>
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
      {/* {open && <CreateTeamModal setOpen={setOpen} />} */}
    </>
  );
}
