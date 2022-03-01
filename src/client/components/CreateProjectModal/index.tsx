import { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";

type SetOpenFunction = (a: boolean) => void;

export default function CreateTeamModal({
  setOpen,
  team,
}: {
  setOpen: SetOpenFunction;
  team: any;
}) {
  const cancelButtonRef = useRef(null);

  const [disabled, setDisabled] = useState(false);
  const [name, setName] = useState("");

  const createTeam = async () => {
    setDisabled(true);

    try {
      if (!name) {
        throw new Error("專案名稱必填");
      }

      // 準備好 body
      const body = {
        name,
        teamId: team.id,
      };

      // call setup api
      const result = await fetch("/api/project/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => res.json());

      // 若有任何錯誤，丟給 try catch 處理
      if (result.error) {
        throw new Error(result.error);
      } else {
        // 若成功時，轉址
        window.location.href = `/${team.slug}/projects/${result.project.num}`;
      }
    } catch (error: any) {
      console.error("An unexpected error happened occurred:", error);
      setDisabled(false);

      // 顯示在 toast
      toast.error(error.message);
    }
  };

  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      initialFocus={cancelButtonRef}
      open={true}
      onClose={setOpen}
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="inline-block align-middle h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-lg w-full">
          <div className="block absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="bg-white p-6">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900 mb-6"
            >
              新增專案
            </Dialog.Title>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  專案名稱
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full border-gray-300 rounded-md"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 py-3 px-6 flex flex-row-reverse">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              onClick={createTeam}
              disabled={disabled}
            >
              新增專案
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
              onClick={() => setOpen(false)}
              ref={cancelButtonRef}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
