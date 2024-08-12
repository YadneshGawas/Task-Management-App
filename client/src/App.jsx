/* eslint-disable no-unused-vars */
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import TaskDetails from "./pages/TaskDetails";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import Sidebar from "./other/Sidebar";
import Navbar from "./other/Navbar";
import Projects from "./pages/Projects";
import AdminTasks from "./pages/AdminTasks";
//import Projects from './pages/pro';
//import Testing from './pages/idpasscheck';
import ForgotPassword from "./pages/ForgotPassword";
import CreateAcc from "./pages/CreateAcc";
import ResetPassword from "./pages/ResetPassword";
import { useDispatch, useSelector } from "react-redux";
import ChangePass from "./pages/ChangePass";
import { Fragment, useRef } from "react";
import { setOpenSidebar } from "./redux/slice/authS";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";

function Layout() {
  const { user } = useSelector((state) => state.auth);

  const location = useLocation();

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/5 h-full bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div>
      <PopupSidebar/>

      <div className="flex-1 overflow-y-auto bg-gray-100">
        <Navbar />
        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
  );
}

const PopupSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenu = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter="transition-opacity duration-700"
        enterFrom="opacity-x-10"
        enterTo="opacity-x-100"
        leave="transition-opacity duration-700"
        leaveFrom="opacity-x-100"
        leaveTo="opacity-x-0"
      >
        {(ref) => (
          <div
            ref={(node) => (mobileMenu.current = node)}
            className={clsx(
              "md:hidden w-full h-full bg-black/40 transition-all duration-700 transform",
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
            onClick={() => closeSidebar()}
          >
            <div className="bg-white w-3/4 h-full">
              <div className="w-full flex jusitfy-end px-5 mt-5">
                <button
                  onClick={() => closeSidebar()}
                  className="flex justify-end items-end"
                >
                  <IoClose size={25} />
                </button>
              </div>
              <div>
                <Sidebar/>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

function App() {
  return (
    <main className="w-full min-h-screen bg-white">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/team" element={<Users />} />
          <Route path="/tasks/:taskId" element={<TaskDetails />} />
          <Route path="/projects/:projectId/tasks" element={<AdminTasks />} />
        </Route>
        <Route path="/" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/log-in" element={<Login />} />
        <Route path="/create" element={<CreateAcc />} />
        <Route path="/resetpass/:userId/:token" element={<ResetPassword />} />
        <Route path="/change/:userId/:token" element={<ChangePass />} />
      </Routes>

      <Toaster richColors />
    </main>
  );
}

export default App;
