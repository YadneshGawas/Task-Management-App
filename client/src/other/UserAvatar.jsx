/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../assets/index";
import { logout } from "../redux/slice/authS";
import { toast } from "sonner";
import UserInfo from "./UserInfo";
import ChangePassword from "./ChangePassword";
import AddUserNoAdmin from "./AddUserNoAdmin";
import { useLogoutMutation } from "../redux/slice/api/userApi";
import { HiDocumentReport } from "react-icons/hi";
import { FaUserEdit } from "react-icons/fa";
import ReportGenerator from './ReportGenerator';

const UserAvatar = () => {
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewReport, setViewReport] = useState(false);
  let { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [obj] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      const response = await obj().unwrap();
      dispatch(logout());
      toast.success("Logged out");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to log out");
    }
  };

  return (
    <>
      <div>
        <Menu as='div' className='relative inline-block text-left'>
          <div>
            <Menu.Button className='w-10 h-10 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-blue-600'>
              <span className='text-white font-semibold'>
                {getInitials(user?.name)}
              </span>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none'>
              <div className='p-4'>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setViewOpen(true)}
                      className='text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base'
                    >
                      <FaUser className='mr-2' aria-hidden='true' />
                      View Profile
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpen(true)}
                      className='text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base'
                    >
                      <FaUserEdit className='mr-2' aria-hidden='true' />
                      Update Profile
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenPassword(true)}
                      className='text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base'
                    >
                      <FaUserLock className='mr-2' aria-hidden='true' />
                      Change Password
                    </button>
                  )}
                </Menu.Item>

                {!user.isAdmin && 
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setViewReport(true)}
                      className='text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base'
                    >
                      <HiDocumentReport className='mr-2' aria-hidden='true' />
                      Generate Report
                    </button>
                  )}
                </Menu.Item>
                }

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logoutHandler} // Pass the function reference
                      className='text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base'
                    >
                      <IoLogOutOutline className='mr-2' aria-hidden='true' />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <AddUserNoAdmin open={open} setOpen={setOpen} userData={user}/>
      <ChangePassword open={openPassword} setOpen={setOpenPassword}/>
      <UserInfo user={user} open={viewOpen} setOpen={setViewOpen} userData={user}/>
      <ReportGenerator open={viewReport} setOpen={setViewReport} userData={user} />
    </>
  );
};

export default UserAvatar;
