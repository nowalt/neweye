import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import _ from "lodash";
import toast from "react-hot-toast";

import {
  useUser,
  useProject,
  useEye,
} from "../../../../../../client/lib/hooks";
import Header from "../../../../../../client/components/Header";

const Setting = () => {
  const router = useRouter();
  const slug = router.query.teamSlug as string;
  const projectNum = router.query.projectNum as string;
  const eyeNum = router.query.eyeNum as string;

  const [settings, setSettings] = useState("");
  const [disabled, setDisabled] = useState(false);

  // 防止未登入的人
  useUser();

  const { project, error: projectError } = useProject({
    num: projectNum,
    teamSlug: slug,
  });

  const { eye, error: eyeError } = useEye({
    num: eyeNum,
    projectId: project?.id,
  });

  useEffect(() => {
    setSettings(eye?.settings || "");
  }, [eye]);

  if (projectError) {
    return <div>Error: {projectError.info || projectError.message}</div>;
  }

  if (eyeError) {
    return <div>Error: {eyeError.info || eyeError.message}</div>;
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setDisabled(true);

    // 準備好 body
    const body = {
      id: eye.id,
      settings,
    };

    try {
      const result = await fetch("/api/eye/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => res.json());

      // 若有任何錯誤，丟給 try catch 處理
      if (result.error) {
        throw new Error(result.error);
      }
      setDisabled(false);
      toast.success("更新設定完成");
    } catch (error: any) {
      console.error("An unexpected error happened occurred:", error);
      setDisabled(false);
      // 顯示在 toast
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white min-h-screen min-h-screen-ios">
      <Header />
      <form className="h-screen" onSubmit={onSubmit}>
        <div className="flex items-center justify-center mt-10 h-1/3">
          <textarea
            className="
              form-control
              block
              w-3/4
              h-full
              px-3  
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
            "
            id="setting"
            rows={3}
            value={settings}
            onChange={(e) => {
              setSettings(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center justify-center mt-5">
          <button
            type="submit"
            className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={disabled}
          >
            送出
          </button>
        </div>
      </form>
    </div>
  );
};

export default Setting;
