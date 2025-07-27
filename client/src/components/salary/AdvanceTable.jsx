import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { getData } from "../../utils/api";
import { FaPlus } from "react-icons/fa";

const AdvanceTable = () => {
  const [advanceData, setAdvanceData] = useState([]);

  const context = useContext(MyContext);

  useEffect(() => {
    if (
      context?.selectedEmployee?._id &&
      context?.selectedMonth &&
      context?.selectedYear
    ) {
      getAdvanceData();
    }
  }, [
    context?.selectedMonth,
    context?.selectedYear,
    context?.selectedEmployee?._id,
  ]);

  const getAdvanceData = async () => {
    const res = await getData(
      `/api/advance/${context?.selectedEmployee?._id}/${parseInt(
        context?.selectedMonth
      )}/${parseInt(context?.selectedYear)}`
    );
    if (res?.success === true) {
      setAdvanceData(res?.advances ?? []);
    }
  };

  return (
    <div className="!p-6 flex-1 mx-auto">
      <div className="flex items-center gap-6 justify-between">
        <h1 className="text-2xl font-bold !mb-4">Advance Salary Details</h1>

        <button
          onClick={() => context?.setOpenModel({open: true, type: 'Add Advance'})}
          type="submit"
          className="text-white cursor-pointer gap-1.5 bg-blue-700 !mb-[0.5rem] w-fit hover:bg-blue-800 font-medium rounded-lg text-md !p-[0.5rem] flex items-center justify-center"
        >
          <FaPlus /> <span>Add Advance</span>
        </button>
      </div>
      {advanceData.length > 0 ? (
        <div className="mt-6 border !p-4 rounded shadow bg-gray-50">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="!p-2 border">Date</th>
                <th className="!p-2 border">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {advanceData.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="!p-2 border">
                    {new Date(item.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="!p-2 border">₹{item.amount}</td>
                </tr>
              ))}
              <tr className="font-semibold bg-yellow-100">
                <td className="!p-2 border text-center">Total</td>
                <td className="!p-2 text-center border">
                  ₹
                  {advanceData.reduce(
                    (acc, curr) => acc + Number(curr.amount),
                    0
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">
          No advance records found for this month.
        </p>
      )}
    </div>
  );
};

export default AdvanceTable;
