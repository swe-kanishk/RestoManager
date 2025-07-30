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
  const employeeJoinedDate = context?.selectedEmployee?.createdAt
  ? new Date(context.selectedEmployee.createdAt)
  : new Date();

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

  const toLocalYMD = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const match = attendance.find(
    (a) => toLocalYMD(new Date(a.date)) === toLocalYMD(date)
  );

  return match?.status || "absent";
};

  const tileClassName = (date) => {
    const status = getStatus(date);
    if (status === "Present") return "present";
    if (status === "Absent") return "absent";
    if (status === "future") return "future";
    return
  };

  const handleMonthChange = (date) => {
    setFormFields({ ...formFields, date: formatDate(date) });
    context?.setSelectedDay(date.getDate());
    context?.setSelectedMonth(date.getMonth() + 1);
    context?.setSelectedYear(date.getFullYear());
  };

  const handleMonthNavigation = (date) => {
    context?.setSelectedDay(date.getDate()+1);
    context?.setSelectedMonth(date.getMonth() + 1);
    context?.setSelectedYear(date.getFullYear());
};

  return (
    <div className="!py-2">
      <h1 className="text-lg font-bold text-gray-500">Attendance Details</h1>
      <Calendar
        
        onChange={handleMonthChange}
        showMonthAndYearPickers={true}
         onShownDateChange={handleMonthNavigation}
        maxDate={new Date()}
         minDate={employeeJoinedDate}

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
