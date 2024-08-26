/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetTeamListQuery } from "../redux/slice/api/userApi";
import { getInitials } from "./../assets/index";
import AddUser from "./../other/AddUser";
import Button from "./../other/Button";
import Title from "./../other/Title";
import UserInfo from "../other/UserInfo";
import ReportGenerator from "../other/ReportGenerator";

const Reports = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState("");

  const { data, refetch } = useGetTeamListQuery();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    refetch();
  }, []);

  const handleClick = (el) => {
    console.log(el);
    setUserData(el);
    setOpen(true);
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
      </tr>
    </thead>
  );

  const TableRow = ({ users }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
            <span className="text-xs md:text-sm text-center">
              {getInitials(users.name)}
            </span>
          </div>
          {users.name}
        </div>
      </td>
      <td className="p-2">{users.email || "users.email.com"}</td>
      <td className="p-2">{users.role || "users"}</td>

      {user._id != users._id && (
        <td className="p-2 flex gap-4 justify-end">
          <Button
            className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
            label="View Reports"
            type="button"
            onClick={() => handleClick(users)}
          />
        </td>
      )}
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Reports" />
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {data?.map((user, index) => (
                  <TableRow key={index} users={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {open && (
        <ReportGenerator open={open} setOpen={setOpen} userData={userData} />
      )}
    </>
  );
};

export default Reports;
