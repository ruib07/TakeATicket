import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChangePassword } from "./services/changePassword.service";
import { showErrorToast, showSuccessToast } from "./utils/toastHelper";
import Header from "./layouts/Header";

export default function App() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [token, setToken] = useState("");
  const [visibleNewPassword, setVisibleNewPassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [location]);

  const handlePasswordChange = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (newPassword !== confirmNewPassword) {
      showErrorToast();
      return;
    }

    try {
      await ChangePassword({ token, newPassword, confirmNewPassword });
      showSuccessToast();
      setNewPassword("");
      setConfirmNewPassword("");
    } catch {
      showErrorToast();
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
            Reset Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handlePasswordChange}>
            <div>
              <div className="mt-2 relative">
                <input
                  type={visibleNewPassword ? "text" : "password"}
                  className="block w-full rounded-md bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-700 py-1.5 text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-blue-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 sm:text-sm/6"
                  placeholder="New password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-600 dark:text-gray-400"
                  onClick={() => setVisibleNewPassword(!visibleNewPassword)}
                >
                  <FontAwesomeIcon
                    icon={visibleNewPassword ? faEye : faEyeSlash}
                  />
                </span>
              </div>
            </div>

            <div>
              <div className="mt-2 relative">
                <input
                  type={visibleConfirmPassword ? "text" : "password"}
                  className="block w-full rounded-md bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-700 py-1.5 text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-blue-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 sm:text-sm/6"
                  placeholder="Confirm new password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-600 dark:text-gray-400"
                  onClick={() =>
                    setVisibleConfirmPassword(!visibleConfirmPassword)
                  }
                >
                  <FontAwesomeIcon
                    icon={visibleConfirmPassword ? faEye : faEyeSlash}
                  />
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-500 dark:bg-purple-400 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 dark:hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
