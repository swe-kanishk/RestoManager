import { useState, useEffect, useContext } from "react";
import { MyContext } from "../../App";
import { toast } from "react-toastify";
import { postData2 } from "../../utils/api";

const CreatePayroll = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [absentCutPerDay, setAbsentCutPerDay] = useState("");
  const [joiningMonth, setJoiningMonth] = useState(null);
  const [joiningYear, setJoiningYear] = useState(null);

  const context = useContext(MyContext);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    if (
      context?.selectedMonth &&
      context?.selectedYear &&
      context?.selectedMonth >= 1 &&
      context?.selectedMonth <= 12
    ) {
      setMonth(context.selectedMonth); // JS months 0–11
      setYear(context.selectedYear);
      setEmployeeId(context?.openModel?._id)
    }
  }, [context?.selectedMonth, context?.selectedYear]);

  const handleEmployeeChange = (id) => {
    setEmployeeId(id);
    const employee = context?.employeesData.find((emp) => emp?._id === id);

    if (employee) {
      const joining = new Date(employee.createdAt);
      const jMonth = joining.getMonth();
      const jYear = joining.getFullYear();

      setJoiningMonth(jMonth);
      setJoiningYear(jYear);

      const maxYear = currentYear;
      const maxMonth = currentMonth;

      if (
        jYear < maxYear ||
        (jYear === maxYear && jMonth <= maxMonth)
      ) {
        setMonth(jMonth);
        setYear(jYear);

        // Also set context
        context.setSelectedMonth(jMonth + 1);
        context.setSelectedYear(jYear);
        context.setSelectedDay(1); // default day
      } else {
        toast.error("Invalid joining date. Please check employee data.");
      }
    }
  };

  const handleMonthChange = (m) => {
    setMonth(m);
    context?.setSelectedMonth(m + 1); // JS is 0-indexed, context expects 1-indexed
  };

  const handleYearChange = (y) => {
    setYear(y);
    context?.setSelectedYear(y);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId || month === null || year === null) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      employeeId,
      month,
      year,
    };

    if (absentCutPerDay !== "") {
      payload.absentCutPerDay = parseFloat(absentCutPerDay);
    }

    console.log(payload);
    postData2("/api/payroll", payload).then((res) => {
      console.log(res);
      if (res?.success) {
        toast.success("Payroll generated successfully.");
      }
    });
  };

  const isMonthYearDisabled = !employeeId;

  const getAvailableMonths = () => {
    if (!joiningYear || joiningMonth === null) return [];
    const months = [];

    for (let y = joiningYear; y <= currentYear; y++) {
      for (let m = 0; m < 12; m++) {
        if (
          (y === joiningYear && m < joiningMonth) ||
          (y === currentYear && m > currentMonth)
        )
          continue;
        if (y === year) months.push(m);
      }
    }

    return months;
  };

  return (
    <div className="rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Generate Employee Payroll</h2>
      <form onSubmit={handleSubmit} className="!space-y-4">
        <div>
          <label className="block font-medium">Month</label>
          <select
            value={month ?? ""}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="w-full !p-2 border rounded"
            disabled={isMonthYearDisabled}
            required
          >
            <option value="">-- Select Month --</option>
            {getAvailableMonths().map((m) => (
              <option key={m} value={m}>
                {new Date(0, m).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        {/* Year input */}
        <div>
          <label className="block font-medium">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="w-full !p-2 border rounded"
            min={joiningYear || 2000}
            max={currentYear}
            required
            disabled={isMonthYearDisabled}
          />
        </div>

        {/* Absent Cut per Day */}
        <div>
          <label className="block font-medium">Absent Cut Per Day (optional)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={absentCutPerDay}
            onChange={(e) => setAbsentCutPerDay(e.target.value)}
            className="w-full !p-2 border rounded"
            placeholder="Leave empty to auto-calculate"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Payroll
        </button>
      </form>
    </div>
  );
};

export default CreatePayroll;
