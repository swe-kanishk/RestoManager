import { useState, useEffect, useContext } from "react";
import { MyContext } from "../../App";
import { toast } from "react-toastify";
import { postData2 } from "../../utils/api";

const CreatePayroll = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [absentCutPerDay, setAbsentCutPerDay] = useState("");

  const context = useContext(MyContext);

  useEffect(() => {
    if (
      context?.selectedMonth &&
      context?.selectedYear &&
      context?.selectedMonth >= 1 &&
      context?.selectedMonth <= 12
    ) {
      setMonth(context.selectedMonth); // Assuming selectedMonth is already 1-12
      setYear(context.selectedYear);
      setEmployeeId(context?.selectedEmployee?._id);
    }
  }, [context?.selectedMonth, context?.selectedYear]);

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

    const parsedAbsent = parseFloat(absentCutPerDay);
    if (!isNaN(parsedAbsent)) {
      payload.absentCutPerDay = parsedAbsent;
    }

    console.log(payload);

    postData2("/api/payroll", payload).then((res) => {
      if (res?.success) {
        toast.success(res?.message);
        context?.setOpenModel({
          open: false,
          _id: null,
          type: null,
        });
      }
    });
  };

  return (
    <div className="rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Generate Employee Payroll</h2>
      <form onSubmit={handleSubmit} className="!space-y-4">
        <div className="!mt-6">
          <label className="block font-medium">
            Absent Cut Per Day (optional)
          </label>
          <input
            type="number"
            min="0"
            value={absentCutPerDay}
            onChange={(e) => setAbsentCutPerDay(e.target.value)}
            className="w-full !p-2 border rounded"
            placeholder="Leave empty to auto-calculate"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white !px-4 !py-2 rounded hover:bg-blue-700"
        >
          Generate Payroll
        </button>
      </form>
    </div>
  );
};

export default CreatePayroll;
