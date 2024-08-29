/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Dialog } from "@headlessui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getInitials } from "../assets";
import Button from "./Button";
import Piechart from "./Piechart";
import Wrapper from "./Wrapper";
import { useGetUserReportQuery } from "../redux/slice/api/taskApi";

const ReportGenerator = ({ open, setOpen, userData }) => {
  const { user } = useSelector((state) => state.auth);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pie, setPie] = useState([]);
  const [tasks, setTasks] = useState([]);

  const { data } = useGetUserReportQuery(userData._id);  

  const getFormattedDateTime = () => {
    const now = new Date();
  
    // Format hours and minutes
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
  
    // Format the time
    const formattedTime = `${hours}:${minutes}${ampm}`;
  
    // Format the date
    const day = now.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[now.getMonth()];
  
    // Get the year
    const year = now.getFullYear();
  
    // Combine date, time, and year
    return `${formattedTime} ${day} ${month} ${year}`;
  };
  

  const handleFrom = (e) => {
    setFrom(e.target.value);
  };

  const handleTo = (e) => {
    setTo(e.target.value);
  };

  const taskDateFormatter = (timestamp) => {
    const datePart = timestamp.split("T")[0];
    return datePart;
  };

  const formUpdate = () => {
    const filteredTasks = data?.tasks.filter((task) => {
      const taskDate = taskDateFormatter(task.date);
      const taskDue = taskDateFormatter(task.due);
      const fromDate = from;
      const toDate = to;

      return (
        taskDate >= fromDate &&
        taskDate <= toDate &&
        taskDue >= fromDate &&
        taskDue <= toDate
      );
    });

    const completedTasks = filteredTasks?.filter(
      (obj) => obj.stage === "completed"
    );

    const getCompleted = completedTasks?.length;
    const getTotal = filteredTasks?.length;

    let pieData = [];

    if (getTotal > 0) {
      pieData = [
        { id: 0, value: getCompleted, color: "#90fedf" },
        { id: 1, value: getTotal, color: "#bebebe" },
      ];
    } else {
      pieData = [
        { id: 0, value: 0, color: "#90fedf" },
        { id: 1, value: 10, color: "#bebebe" },
      ];
    }

    setTasks(filteredTasks);
    setPie(pieData);
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const startY = 15;
    // User details
    const mainTitle = "User Report";
    const userName = userData?.name;
    const userRole = userData?.role;
    const userEmail = userData?.email;
    const time = getFormattedDateTime();

    const pageWidth = doc.internal.pageSize.getWidth();
    const mainTitleWidth = doc.getTextWidth(mainTitle);
    const mainTitleX = (pageWidth - mainTitleWidth) / 2;

    // Add user details
    doc.text(mainTitle, mainTitleX, 10);
    doc.text(userName, 10, startY + 10);
    doc.setFontSize(10);
    doc.setFontSize(10);
    doc.setTextColor(96, 96, 96);
    doc.text(userRole, 10, startY + 15);
    doc.text(userEmail, 10, startY + 20);
    doc.text(time, 10, startY + 25);

    doc.text("Reports Date:", 10, startY + 30);
    doc.text(from, 32, startY + 30);
    doc.text("to", 51, startY + 30);
    doc.text(to, 55, startY + 30);

    // Add a black line
    doc.setLineWidth(0.5);
    doc.line(10, 48, 200, 48);

    // Add a table
    const headers = [["Title", "Created On", "Due Date", "Status"]];
    const data1 = tasks.map((task) => [
      task.title,
      task.date.substring(0, 10),
      task.due.substring(0, 10),
      task.stage,
    ]);

    doc.autoTable({
      head: headers,
      body: data1,
      startY: 50,
    });

    // Save the PDF
    doc.save(userName+"_"+time);
  };

  useEffect(() => {
    formUpdate();
  }, [to, from]);

  const data1 = userData ? userData : user;

  return (
    <Wrapper open={open} setOpen={setOpen}>
      <Dialog.Title
        as="h2"
        className="text-base text-left font-bold leading-6 text-gray-900 mb-4"
      >
        User Report
      </Dialog.Title>
      {data1 ? (
        <div className="mt-2 flex flex-col items-start gap-6 w-full">
          <div className=" w-full">
            <div className="flex flex-col items-start justify-between">
              <div className="flex items-center bg-white space-x-3 p-2">
                <div className="w-16 h-16 min-w-16 bg-blue-600 rounded-full text-white flex items-center justify-center text-2xl ">
                  <span className="text-center font-bold">
                    {getInitials(data1.name)}
                  </span>
                </div>
                <div className="flex flex-col gap-y-1">
                  <p className="text-black text-xl font-bold flex-wrap">
                    {data1.name}
                  </p>
                  <span className=" text-sm text-gray-500">{data1.role}</span>
                  <span className="text-blue-500 text-sm">
                    {data1.email ?? "email@example.com"}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col justify-between pt-1 space-y-2">
              <div>
                <span className="text-base font-bold">User Reports</span>
              </div>
              <div className="w-full h-10 flex flex-row space-x-2 self-center">
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
                    <Piechart pieData={pie} iR={100} cX={250} hg={350} />
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
