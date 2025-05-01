import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex h-screen w-full">
      {}
      <div className="hidden lg:flex items-center justify-center bg-black h-full w-1/2 px-12">
        <div className="max-w-md space-y-6 text-center text-white">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome to ECommerce Shopping
          </h1>
        </div>
      </div>

      {}
      <div className="flex flex-1 items-center justify-center bg-gray-100 h-full px-4 py-12 sm:px-6 lg:px-8">
        <Outlet /> {}
      </div>
    </div>
  );
}

export default AuthLayout;
