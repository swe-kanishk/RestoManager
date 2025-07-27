import { useContext, useEffect, useState } from "react";
import { Calendar } from "react-date-range";
import { format, isBefore, isSameDay } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { getData } from "../../utils/api";

import { MyContext } from "../../App";
import formatDate from "../../Hooks/FormatDate";

const AttendanceData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);

  const context = useContext(MyContext);

  const [formFields, setFormFields] = useState({
    date: formatDate(
      new Date(
        context?.selectedYear,
        context?.selectedMonth - 1,
        context?.selectedDay
      )
    ),
    employeeId: context?.selectedEmployee?._id,
    status: "Absent",
  });

  useEffect(() => {
    fetchAttendance();
  }, [
    context?.selectedMonth,
    context?.selectedYear,
    context?.selectedMonth,
    context,
  ]);

  const fetchAttendance = async () => {
    if (context?.selectedEmployee === null) {
      setAttendance([]);
      return;
    }

    try {
      const res = await getData(
        `/api/attendance?employeeId=${context?.selectedEmployee?._id}&month=${context?.selectedMonth}&year=${context?.selectedYear}`
      );
      console.log(res);
      setAttendance(res.records || []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

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
    context?.setSelectedDay(date.getDate()+1);
    context?.setSelectedMonth(date.getMonth() + 1);
    context?.setSelectedYear(date.getFullYear());
  };

  return (
    <div className="!p-6">
      <h1 className="text-2xl font-bold">Employee Attendance</h1>
      <Calendar
        date={
          new Date(
            context?.selectedYear,
            context?.selectedMonth - 1,
            context?.selectedDay-1
          )
        }
        onChange={handleMonthChange}
        showMonthAndYearPickers={true}
        maxDate={new Date()}
        className="custom-calendar border h-fit rounded-md"
        disabledDay={() => true}
        color="#000"
        dayContentRenderer={(date) => (
          <div className={`day-box ${tileClassName(date)}`}>
            {format(date, "d")}
          </div>
        )}
      />
      </div>
  );
};

export default AttendanceData;
