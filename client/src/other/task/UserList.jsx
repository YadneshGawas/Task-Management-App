/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import clsx from "clsx";
import { getInitials } from "./../../assets/index";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useGetTeamListQuery } from "../../redux/slice/api/userApi";

const UserList = ({ setUTeam, uTeam, users }) => {
  const { user } = useSelector((state) => state.auth);
  const { data } = useGetTeamListQuery();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const team = users ? users : data;

  const handleChange = (el) => {
    setSelectedUsers(el);
    setUTeam(el?.map((u) => u._id));
  };

  const location = useLocation();

  const getAssignTo = () => {
    const isTasksPage = location.pathname.includes("/task");
    if (isTasksPage) {
      return "Assign Task To";
    }
    return "Assign Project To";
  };

  useEffect(() => {
    if (data) {
      let initialUsers = [];
      if (uTeam) {
        initialUsers = uTeam
          .map((teamId) => team.find((user) => user._id === teamId))
          .filter(Boolean); // Remove any undefined values
      }
      setSelectedUsers(initialUsers);
    }
  }, [users, data, uTeam, team]);

  // Filter users based on search query
  const filteredUsers = team?.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <p className="text-gray-700">
        {user.isAdmin ? getAssignTo() : "Assign Task To"}
      </p>
      <Listbox
        value={selectedUsers}
        onChange={(el) => handleChange(el)}
        multiple
      >
        {({ open }) => (
          <>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded bg-white pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 border border-gray-300 sm:text-sm">
                <span className="block truncate">
                  {selectedUsers?.map((user) => user.name).join(", ")}
                </span>

                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <BsChevronExpand
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                as={Fragment}
                enter="transition ease-in duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className={`absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm ${open ? '' : 'hidden'}`}
                >
                  <Listbox.Options className="mt-1">
                  <div className="px-3 py-2 border-b border-gray-300">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-2 rounded focus:outline-none"
                      onClick={(e) => e.stopPropagation()} // Prevent click events from closing the dropdown
                    />
                  </div>
                    {filteredUsers?.map((user, index) => (
                      <Listbox.Option
                        key={index}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                          }`
                        }
                        value={user}
                      >
                        {({ selected }) => (
                          <>
                            <div
                              className={clsx(
                                "flex items-center gap-2 truncate",
                                selected ? "font-medium" : "font-normal"
                              )}
                            >
                              <div className="w-6 h-6 min-w-6 rounded-full text-white flex items-center justify-center bg-violet-600">
                                <span className="text-center text-[10px]">
                                  {getInitials(user.name)}
                                </span>
                              </div>
                              <span>{user.name}</span>
                            </div>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <MdCheck className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};

export default UserList;
