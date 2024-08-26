/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getInitials } from "../assets";
import { FaFilePdf } from "react-icons/fa";
import Button from "./Button";
import Wrapper from "./Wrapper";
import Textbox from "./Textbox";
import Piechart from "./Piechart";
import { jsPDF } from "jspdf";


const ReportGenerator = ({ open, setOpen, userData }) => {
  const { user } = useSelector((state) => state.auth);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  console.log(open);

  const handleFrom = (e) => {
    setFrom(e.target.value);
    console.log(from);
  };

  const handleTo = (e) => {
    setTo(e.target.value);
    console.log(to);
  };

  const generateReport = () => {
    const doc = new jsPDF();

    doc.text("Hello world!", 10, 10);
    doc.save("a4.pdf");
  };

  const data = userData ? userData : user;

  const pieData = [
    { id: 0, value: 10, color: "#90fedf" },
    { id: 1, value: 15, color: "#bebebe" },
  ];

  return (
    <Wrapper open={open} setOpen={setOpen}>
      <Dialog.Title
        as="h2"
        className="text-base text-left font-bold leading-6 text-gray-900 mb-4"
      >
        User Report
      </Dialog.Title>
      {data ? (
        <div className="mt-2 flex flex-col items-start gap-6 w-max">
          <div>
            <div className="flex flex-col items-start justify-between">
              <div className="flex items-center bg-white space-x-3 p-2">
                <div className="w-16 h-16 min-w-16 bg-blue-600 rounded-full text-white flex items-center justify-center text-2xl ">
                  <span className="text-center font-bold">
                    {getInitials(data.name)}
                  </span>
                </div>
                <div className="flex flex-col gap-y-1">
                  <p className="text-black text-xl font-bold flex-wrap">
                    {data.name}
                  </p>
                  <span className=" text-sm text-gray-500">{data.role}</span>
                  <span className="text-blue-500 text-sm">
                    {data.email ?? "email@example.com"}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col justify-between pt-1 space-y-2">
              <div>
                <span className="text-base font-bold">User Reports</span>
              </div>
              <div className="w-full h-10 flex flex-row space-x-2">
                <span className="p-2 border-b border-gray-500">
                  From: <input type="date" name="from" onChange={handleFrom} />
                </span>
                <span className="p-2 border-b border-gray-500">
                  To <input type="date" name="to" onChange={handleTo} />
                </span>
              </div>
              <div className="w-full h-28 flex space-x-2">
                <div className=" w-28 h-28 shadow-gray-300 rounded-lg border border-gray-300 duration-300 transition-all hover:shadow-lg">
                  <div className="w-full h-full flex items-center justify-center">
                    <Piechart pieData={pieData} iR={150} cX={250} hg={100} />
                  </div>
                </div>
                <div
                  className="w-2/3 h-full flex flex-row items-center justify-center border border-gray-300 duration-300 transition-all hover:shadow-lg rounded-lg shadow-gray-300 hover:bg-red-100"
                  onClick={() => generateReport()}
                >
                  <span className="text-red-500">Generate Report</span>
                  <div className="text-red-500">
                    <FaFilePdf />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button
            type="button"
            className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto mt-5"
            onClick={() => setOpen(false)}
            label="Close"
          />
        </div>
      ) : (
        <p>Error</p>
      )}
    </Wrapper>
  );
};

export default ReportGenerator;
