/* eslint-disable no-unused-vars */
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import TaskDetails from './pages/TaskDetails';
import Tasks from './pages/Tasks';
import Trash from './pages/Trash';
import Users from './pages/Users';
import CreateAcc from './pages/CreateAcc';
import Sidebar from "./other/Sidebar";
import Navbar from "./other/Navbar";
import Projects from "./pages/Projects";
import AdminTasks from './pages/AdminTasks';
//import Projects from './pages/pro';

function Layout() {
  const user = " "; // Replace with actual user authentication logic

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
          <Route path="/" element={<Navigate to="/create" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/completed/:status" element={<Tasks />} />
          <Route path="/in-progress/:status" element={<Tasks />} />
          <Route path="/team" element={<Users />} />
          <Route path="/trashed" element={<Trash />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/projects/:projectId/tasks" element={<AdminTasks />} />
        </Route>
        <Route path="/log-in" element={<Login />} />
        <Route path="/create" element={<CreateAcc />} />
      </Routes>

      <Toaster richColors />
    </main>
  );
}

export default App;
