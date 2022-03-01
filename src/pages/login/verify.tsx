import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

import { useUser } from "../../client/lib/hooks";

export default function Verify() {
  const router = useRouter();

  // 如果沒登入，redirect 到 /login
  // 如果有登入，但未填完資料，會 redirect 到 /login/form
  // 如果有登入，填完必填資料，會 redirect 到 /
  useUser({ redirectTo: "/", redirectIfFound: true });

  const [disabled, setDisabled] = useState(false);

  // 先由網址拿到電話號碼
  const { to } = router.query;

  // 解釋電話號碼
  const phoneNumber = decodeURIComponent(to as string);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setDisabled(true);

    // 準備 body
    const body = {
      to: phoneNumber,
      code: e.currentTarget.code.value,
    };

    // fetch api
    try {
      const result = await fetch("/api/auth/phone/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => res.json());

      // 若果 api 返回錯誤，丟出錯誤。由 try catch 處理
      if (result.error) {
        throw new Error(result.error);
      } else {
        // 成功登入，轉址
        console.log("success login!!!");
        window.location.href = (router.query.next as string) || "/";
      }
    } catch (error: any) {
      console.error("An unexpected error happened occurred:", error);
      setDisabled(false);

      // 顯示在 toast
      toast.error(error.message);
    }
  }

  return (
    <div className="bg-gray-200 min-h-screen min-h-screen-ios">
      <div className="min-h-screen min-h-screen-ios flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登入認證
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            請留意手機短訊認證碼
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700"
                >
                  輸入短訊認證碼
                </label>
                <div className="mt-1">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={disabled}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  登入 / 註冊
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
