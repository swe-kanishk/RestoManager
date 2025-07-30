import { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import { getData, deleteData } from "../../utils/api";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const AdvanceTable = () => {
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
      context.setAdvanceData(res?.advances ?? []);
    }
  };

  const handleDeleteAdvance = async (id) => {
    deleteData(`/api/advance/${id}`).then((res) => {
      if(res?.data?.success === true){
        toast.success(res?.data?.message)
        const updated = context?.advanceData?.filter((item) => item?._id !== id) || [];
        context.setAdvanceData(updated)
      }
    })
  };

  return (
    <div className="!py-2 flex-1 mx-auto">
      <div className="flex items-center gap-6 justify-between">
        <h1 className="text-lg font-bold text-gray-500">Advance Salary Details</h1>
        <button
          onClick={() =>
            context?.setOpenModel({ open: true, type: "Add Advance" })
          }
          type="button"
          className="text-white cursor-pointer gap-1.5 bg-blue-700 !mb-[0.5rem] w-fit hover:bg-blue-800 font-medium rounded-lg text-md !p-[0.5rem] flex items-center justify-center"
        >
          <FaPlus /> <span>Add Advance</span>
        </button>
      </div>

      {context?.advanceData.length > 0 ? (
        <div className="mt-6 border !p-4 rounded shadow bg-gray-50">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="!p-2 border">Date</th>
                <th className="!p-2 border">Amount (₹)</th>
                <th className="!p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {context?.advanceData.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="!p-2 border">
                    {new Date(item.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="!p-2 border">₹{item.amount}</td>
                  <td className="!p-2 border">
                    <button
                      onClick={() => handleDeleteAdvance(item._id)}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="font-semibold bg-yellow-100">
                <td className="!p-2 border text-center">Total</td>
                <td className="!p-2 text-right border" colSpan={2}>
                  ₹
                  {context?.advanceData.reduce(
                    (acc, curr) => acc + Number(curr.amount),
                    0
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No advance records found for this month.</p>
      )}
    </div>
  );
};

export default AdvanceTable;