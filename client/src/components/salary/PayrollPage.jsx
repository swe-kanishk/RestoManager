import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MyContext } from "../../App";
import { getData } from "../../utils/api";
import { FaPlus } from "react-icons/fa";

const PayrollPage = () => {
  const [payrollData, setPayrollData] = useState(null);
  const [totalAdvance, setTotalAdvance] = useState(0);

  const context = useContext(MyContext);

  useEffect(() => {
  const advnctotal = context?.advanceData?.reduce((total, item) => total + (item.amount || 0), 0);
  setTotalAdvance(advnctotal);
}, [context?.totalAdvance]);

  useEffect(() => {
    console.log(context?.selectedEmployee?._id)
    getEmployeePayroll();
  }, [
    context?.selectedMonth,
    context?.selectedYear,
    context?.selectedMonth,
    context,
    context?.selectedEmployee?._id,
  ]);

  const getEmployeePayroll = async () => {
    if(!context?.selectedEmployee?._id) return
    getData(
      `/api/payroll/${context?.selectedEmployee?._id}/${parseInt(
        context?.selectedMonth
      )}/${parseInt(context?.selectedYear)}`
    ).then((res) => {
      if (res?.success === true) {
        console.log(payrollData)
        setPayrollData(res?.payroll);
      }else {
        setPayrollData(null)
      }
    }).catch((err) => {
        setPayrollData(null)
    });
  };

  return (
    <div className="!py-2 md:w-1/3">
      <div className="flex items-center gap-6 justify-between">
      <h1 className="text-lg font-bold text-gray-500">Payroll Details</h1>
        <button
          type="submit"
          onClick={() => context?.setOpenModel({open: true, type: 'Create Payroll'})}
          className="text-white cursor-pointer gap-1.5 bg-blue-700 !mb-[0.5rem] w-fit hover:bg-blue-800 font-medium rounded-lg text-md !p-[0.5rem] flex items-center justify-center"
        ><FaPlus /> <span>{payrollData ? "Re - Generate Payroll" : "Generate Payroll"}</span></button>
      </div>
      {payrollData ? (
        <div className="mt-6 border !p-4 rounded shadow-md bg-gray-50">
          <h2 className="text-xl font-semibold !mb-2">Payroll Details</h2>
          <p>
            <strong>Gross Salary:</strong> ₹{payrollData.grossSalary}
          </p>
          <p>
            <strong>Absent Days:</strong> {payrollData.absentDays}
          </p>
          <p>
            <strong>Absent Cut Per Day:</strong> ₹{payrollData.absentCutPerDay}
          </p>
          <p>
            <strong>Total Absent Deduction:</strong> ₹
            {payrollData.absentDays * payrollData.absentCutPerDay}
          </p>
          <p>
            <strong>Advance Deduction:</strong> ₹{totalAdvance || 0}
          </p>
          <p className="font-semibold text-lg mt-2">
            <strong>Final Payable:</strong> <span className={`${payrollData?.netSalary > 0 ? 'text-green-600' : 'text-red-500'}`}>&#8377;{payrollData.netSalary}</span>
          </p>
        </div>
      ): (
        <p className="text-gray-600">
          Payroll Data is not available for selected month!
        </p>
      )}
    </div>
  );
};

export default PayrollPage;
