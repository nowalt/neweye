import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useUserImmutable } from "../../client/lib/hooks";

const LoginForm: NextPage = () => {
  const router = useRouter();

  // 如果沒登入，redirect 到 /login
  // 如果有登入，但未填完資料，會 redirect 到 /login/form
  // 如果有登入，填完必填資料，會 redirect 到 /
  const user = useUserImmutable({
    redirectTo: "/",
    redirectIfFound: true,
  });

  // 載入完時，設置一次性的讀取到 input
  const [loaded, setLoaded] = useState(false);

  // input 用
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [disabled, setDisabled] = useState(false);

  // 載入完時，設置一次性的讀取到 input
  useEffect(() => {
    if (user && !loaded) {
      setLoaded(true);
      setName(user.name || "");
      setUsername(user.username || "");
    }
  }, [user, loaded]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setDisabled(true);

    // 準備好 body
    const body = {
      name: e.currentTarget.name.value,
      username: e.currentTarget.username.value,
    };

    // call setup api
    // 會更新 user 資訊
    // 並會進行新增 personal team 等操作
    try {
      const result = await fetch("/api/user/setup", {
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
            輸入用戶資料
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  用戶姓名
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  帳戶名
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <p
                  className="mt-2 text-sm text-gray-500"
                  id="username-description"
                >
                  帳戶名只接受少寫英文，數字，&quot;-&quot;，和 &quot;_&quot;
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={disabled}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
