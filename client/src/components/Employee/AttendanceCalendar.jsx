import React, { useContext, useEffect, useState } from "react";
import { Calendar } from "react-date-range";
import { format, isBefore, isSameDay } from "date-fns";
import { startOfDay, isAfter } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { getData, postData } from "../../utils/api";

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { MyContext } from "../../App";
import { BiLoader } from "react-icons/bi";
import formatDate from "../../Hooks/FormatDate";
import axios from "axios";
import { toast } from "react-toastify";

const AttendanceCalendar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [employeeJoiningDate, setEmployeeJoiningDate] = useState(null);

  const context = useContext(MyContext);
  const employeeJoinedDate = context?.selectedEmployee?.createdAt
    ? new Date(context.selectedEmployee.createdAt)
    : new Date();
  const [formFields, setFormFields] = useState({
    date: formatDate(new Date()),
    employeeId: "",
    status: "Absent",
  });

  const getStatus = (date) => {
    const today = new Date();

    if (isBefore(today, date)) return "future";

    const match = attendance.find((a) => isSameDay(new Date(a.date), date));

    return match?.status || "absent"; // Default to absent if no entry
  };

  const tileClassName = (date) => {
    const status = getStatus(date);
    const today = new Date();
    if (isSameDay(today, date)) return;
    if (status === "Present") return "present";
    if (status === "Absent") return "absent";
    if (status === "future") return "future";
  };

  const handleMonthChange = (date) => {
    setFormFields({ ...formFields, date: formatDate(date) });
    setSelectedMonth(date);
  };

  const handleChangeAttendance = (event) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "employeeId") {
      const selectedEmp = context?.employeesData?.find((e) => e?._id === value);
      if (selectedEmp?.createdAt) {
        setEmployeeJoiningDate(formatDate(new Date(selectedEmp?.createdAt))); // ✅ fix
      }
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formFields);
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/attendance`, formFields, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        console.error("POST error:", err.response?.data || err.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <h2 className="text-2xl font-bold !ml-[1rem] !mt-[1rem]">
        Mark Attendance
      </h2>
      <div className="flex !m-[1rem] items-start gap-4 flex-col md:flex-row bg-white border-2 w-fit rounded-md overflow-hidden drop-shadow-md">
        <div className="mx-auto w-fit flex-col flex items-center border-b-2 md:border-b-0 md:border-r-2 justify-center">
          <Calendar
            date={selectedMonth}
            onChange={handleMonthChange}
            showMonthAndYearPickers={true}
            maxDate={new Date()}
            minDate={employeeJoinedDate}
            className="custom-calendar"
            color="#000"
            disabledDay={(date) => {
              if (!employeeJoiningDate) return true;
              const today = new Date();
              return (
                isBefore(startOfDay(date), startOfDay(employeeJoiningDate)) ||
                isAfter(startOfDay(date), startOfDay(today))
              );
            }}
            dayContentRenderer={(date) => (
              <div className={`day-box ${tileClassName(date)}`}>
                {format(date, "d")}
              </div>
            )}
          />
        </div>
        <form
          onSubmit={handleMarkAttendance}
          className="w-full flex flex-col gap-6 !p-[1rem] md:!pl-0 items-center justify-center"
        >
          <TextField
            id="outlined-select-currency"
            select
            onChange={handleChangeAttendance}
            value={formFields.employeeId}
            name="employeeId"
            label="Employee"
            helperText="Please select employee to mark attendance."
            className="w-[300px]"
          >
            {context?.employeesData.map((emp) => (
              <MenuItem key={emp?._id} value={emp?._id}>
                {emp?.fullName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="outlined-select-currency"
            select
            onChange={handleChangeAttendance}
            value={formFields.status}
            name="status"
            label="Status"
            helperText="Please select employee's status."
            className="w-[300px]"
          >
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
          </TextField>
          <button
            type="submit"
            disabled={isLoading}
            className="text-white cursor-pointer bg-blue-700 !mb-[0.5rem] w-full hover:bg-blue-800 font-medium rounded-lg text-md !p-[0.5rem] flex items-center justify-center"
          >
            {isLoading ? (
              <BiLoader className="animate-spin" size={22} />
            ) : (
              "Mark Attendance"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default AttendanceCalendar;
