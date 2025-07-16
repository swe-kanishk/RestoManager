import { useContext, useEffect, useState } from "react";
import { Calendar } from "react-date-range";
import { format, isBefore, isSameDay } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { getData } from "../../utils/api";

import { MyContext } from "../../App";
import formatDate from "../../Hooks/FormatDate";

import { Collapse } from "react-collapse";

const AttendanceData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [attendance, setAttendance] = useState([]);

  const context = useContext(MyContext);

  const [formFields, setFormFields] = useState({
    date: formatDate(new Date()),
    employeeId: context?.selectedEmployee?._id,
    status: "Absent",
  });

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, context]);

  const fetchAttendance = async () => {
    if(context?.selectedEmployee === null){
        setAttendance([]);
        return;
    }
    const month = selectedMonth.getMonth() + 1;
    const year = selectedMonth.getFullYear();

    try {
      const res = await getData(
        `/api/attendance?employeeId=${context?.selectedEmployee?._id}&month=${month}&year=${year}`
      );
      console.log(res, context?.selectedEmployee?._id);
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
    setSelectedMonth(date);
  };

  return (
    <Collapse isOpened={Boolean(context.selectedEmployee)}>
    <Calendar
      date={selectedMonth}
      onChange={handleMonthChange}
      showMonthAndYearPickers={true}
      maxDate={new Date()}
      className="custom-calendar"
       disabledDay={() => true}
      color="#000"
      dayContentRenderer={(date) => (
        <div className={`day-box ${tileClassName(date)}`}>
          {format(date, "d")}
        </div>
      )}
    />
    </Collapse>
  );
};

export default AttendanceData;
