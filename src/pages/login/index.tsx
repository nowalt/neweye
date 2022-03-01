/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

import { useUser } from "../../client/lib/hooks";

export default function Login() {
  const router = useRouter();

  // 如果沒登入，redirect 到 /login
  // 如果有登入，但未填完資料，會 redirect 到 /login/form
  // 如果有登入，填完必填資料，會 redirect 到 /
  useUser({ redirectTo: "/", redirectIfFound: true });

  const [disabled, setDisabled] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setDisabled(true);

    // 準備 input
    const country = e.currentTarget.country.value;
    const phoneNumber = e.currentTarget.phoneNumber.value;

    // 準備 api 登入操作 (傳送 sms 驗證碼)
    const body = {
      to: country + phoneNumber,
    };

    try {
      const result = await fetch("/api/auth/phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => res.json());

      // api 返回錯誤，就丟錯誤，交給 try catch 處理
      if (result.error) {
        throw new Error(result.error);
      } else {
        // api 沒錯誤的話，轉址到 verify
        // 因為到通過 verify 才算是登入成功
        router.push(
          `/login/verify?to=${encodeURIComponent(body.to)}&next=${
            router.query.next || "/"
          }`
        );
      }
    } catch (error: any) {
      // 有錯誤時的處理
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
          <img className="mx-auto h-12 w-auto" src="/logo.svg" alt="nowdiff" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登入和註冊您的帳戶
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  手提電話
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <select
                      id="country"
                      name="country"
                      className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-3 pr-7 border-transparent bg-transparent text-gray-500 rounded-md"
                    >
                      <option value="+853">澳門 +853</option>
                      <option value="+852">香港 +852</option>
                      <option value="+886">台灣 +886</option>
                      <option value="+86">中國 +86</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    required
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-[7.4rem] border-gray-300 rounded-md"
                    placeholder="您的手提電話"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={disabled}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  下一步
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
