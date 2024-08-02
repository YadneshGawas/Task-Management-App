/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { toast } from "sonner";
import { useDeleteUserMutation, useGetTeamListQuery, useUpdateUserMutation, useUserActionMutation } from "../redux/slice/api/userApi";
import { allusers } from "./../assets/data";
import { getInitials } from './../assets/index';
import AddUser from './../other/AddUser';
import Button from './../other/Button';
import ConfirmatioDialog, { UserAction } from './../other/Dialogs';
import Title from './../other/Title';

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const { data, refetch } = useGetTeamListQuery();

  const userActionHandler = async (user) => {
    try {
      const res = await updateUser(user);
      toast.success(res.data.message);
      setSelected(null);
      setTimeout(() => {
        setOpenAction(false);
      }, 500);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteUser(selected?._id).unwrap();
      console.log(res);
      setSelected(null);
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    console.log(selected?._id);
    setOpen(true);
  };

  const addClick = () => {
    setSelected(null);
    setOpen(true);
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Email</th>
        <th className='py-2'>Role</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='p-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700'>
            <span className='text-xs md:text-sm text-center'>
              {getInitials(user.name)}
            </span>
          </div>
          {user.name}
        </div>
      </td> 
      <td className='p-2'>{user.email || "user.email.com"}</td>
      <td className='p-2'>{user.role || "User"}</td>

      <td className='p-2 flex gap-4 justify-end'>
        <Button
          className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
          label='Edit'
          type='button'
          onClick={() => editClick(user)}
        />

        <Button
          className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
          label='Delete'
          type='button'
          onClick={() => deleteClick(user)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Team Members' />
          <Button
            label='Add New User'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5'
            onClick={addClick}
          />
        </div>

        <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {data?.map((user, index) => (
                  <TableRow key={index} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={selected ? selected._id : new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};

export default Users;
