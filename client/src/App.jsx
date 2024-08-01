/* eslint-disable no-unused-vars */
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import TaskDetails from './pages/TaskDetails';
import Tasks from './pages/Tasks';
import Trash from './pages/Trash';
import Users from './pages/Users';
import Sidebar from "./other/Sidebar";
import Navbar from "./other/Navbar";
import Projects from "./pages/Projects";
import AdminTasks from './pages/AdminTasks';
//import Projects from './pages/pro';
//import Testing from './pages/idpasscheck';
import ForgotPassword from "./pages/ForgotPassword";
import CreateAcc from './pages/CreateAcc';
import ResetPassword from "./pages/ResetPassword";
import { useSelector } from "react-redux";


function Layout() {
  const { user } = useSelector((state) => state.auth);

  const location = useLocation();

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar/>
      </div>
      {/* Mobile Sidebar */}

      <div className="flex-1 overflow-y-auto bg-gray-100">
        <Navbar/>
        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
  );
}

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
          <Route path="/trashed" element={<Trash />} />
          <Route path="/taskdetails" element={<TaskDetails />} />
          <Route path="/projects/task" element={<AdminTasks />} />
        </Route>
        <Route path="/" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/log-in" element={<Login />} />
        <Route path="/create" element={<CreateAcc />} />
        <Route path="/resetpass/:userId/:token" element={<ResetPassword />} />
      </Routes>

      <Toaster richColors />
    </main>
  );
}

export default App;
