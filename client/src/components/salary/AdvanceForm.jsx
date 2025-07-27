import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { MyContext } from "../../App";
import { postData2 } from "../../utils/api";
import { toast } from "react-toastify";

const AdvancePaymentForm = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const context = useContext(MyContext);

  useEffect(() => {
    const jsDate = new Date(
      context?.selectedYear,
      context?.selectedMonth - 1,
      context?.selectedDay
    );

    const formattedDate = jsDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
    setDate(formattedDate);
  }, [context?.selectedMonth, context?.selectedYear, context?.selectedDay]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId || !amount || !date) {
      alert("All fields are required.");
      return;
    }
    const payload = {
      employeeId,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
    };
    postData2("/api/advance", payload).then((res) => {
      if (res?.success === true) {
        toast.success("Advance payment added!");
        setEmployeeId("")
        setAmount("")
      }
    });
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);

    context?.setSelectedDay(selectedDate.getDate()+1);
    context?.setSelectedMonth(selectedDate.getMonth() + 1); // 1–12
    context?.setSelectedYear(selectedDate.getFullYear()); // YYYY
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Create Advance Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Employee</label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Employee</option>
            {context?.employeesData?.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Amount input */}
        <div>
          <label className="block font-medium mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter amount"
          />
        </div>

        {/* Date input */}
        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Advance
        </button>
      </form>
    </div>
  );
};

export default AdvancePaymentForm;
