/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Tab } from "@headlessui/react";
// import Button from "./Button";
import { IoIosTrash, IoMdCreate } from "react-icons/io";
import ButtonIconOnly from "./ButtonIconOnly";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ tabs, setSelected, children, setOpen, setOpenDialog, status }) {
  return (
    <div className="w-full px-1 sm:px-0">
      <Tab.Group>
        <div className="flex items-center justify-between">
          <Tab.List className="flex space-x-2 rounded-xl p-1">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.title}
                onClick={() => setSelected(index)}
                className={({ selected }) =>
                  classNames(
                    "w-fit flex items-center outline-none gap-2 px-3 py-2.5 text-sm font-medium leading-5 bg-white rounded-sm",
                    selected
                      ? "text-blue-700 border-b-2 border-blue-600"
                      : "text-gray-800 hover:text-blue-800"
                  )
                }
              >
                {tab.icon}
                <span>{tab.title}</span>
              </Tab>
            ))}
          </Tab.List>


          {status === 0 &&
            <div className="flex flex-row space-x-2 mx-2">
            <ButtonIconOnly
              type="button"
              label="Edit Task"
              className="outline outline-1 outline-gray-400"
              onClick={() => setOpen(true)}
              //className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
              icon={<IoMdCreate className="text-lg" />}
            />
            <ButtonIconOnly
              type="button"
              label="Delete Task"
              className="outline outline-1 outline-gray-400"
              onClick={() => setOpenDialog(true)}
              //className="flex flex-row-reverse gap-1 items-center bg-red-500 text-white rounded-md py-2 2xl:py-2.5"
              icon={<IoIosTrash className="text-lg" />}
            />
          </div>}
        </div>
        <Tab.Panels className="w-full mt-2">{children}</Tab.Panels>
      </Tab.Group>
    </div>
  );
}
