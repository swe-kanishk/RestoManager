import React, { useContext, useEffect, useState } from "react";
import { getData } from "../../utils/api";
import { MyContext } from "../../App";

function ViewExpense() {
  const [list, setList] = useState([]);
  const [data, setData] = useState("");
  const [income, setIncome] = useState(0);

  const context = useContext(MyContext);
  useEffect(() => {
    getData(`/api/expenses/${context?.openModel?._id}`)
      .then((res) => {
        console.log(res);
        if (res?.success === true) {
          setList(res?.data?.expenses);
          setData(res?.data);
          setIncome(res?.data?.income || 0);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      <table className="w-full text-sm text-left text-gray-600 border border-gray-200 rounded-lg overflow-hidden">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="!p-3">Sr. No.</th>
            <th className="!p-3">Item Name</th>
            <th className="!p-3">Quantity</th>
            <th className="!p-3 text-right">Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={index} className="bg-white border-t hover:bg-gray-50">
              <td className="!p-2">{index + 1}</td>
              <td className="!p-2">{item.itemName}</td>
              <td className="!p-2">{item.qty}</td>
              <td className="!p-2 text-right">₹{item.price}</td>
            </tr>
          ))}
          <tr className="bg-blue-100 font-semibold text-gray-900 border-t">
            <td colSpan={3} className="!p-2 text-left">
              Total Expense:
            </td>
            <td colSpan={2} className="!p-2 text-right">
              ₹{data?.total}
            </td>
          </tr>
          <tr className="bg-blue-400 font-semibold text-gray-900 border-t">
            <td colSpan={3} className="!p-2 text-left">
              Total Sale:
            </td>
            <td colSpan={2} className="!p-2 text-right">
              ₹{data?.income}
            </td>
          </tr>
          
          {data?.profitOrLoss && (
            <>
            <tr className=" font-semibold text-gray-900 border-t">
            <td colSpan={3} className="!p-2 text-left">
              Status:
            </td>
            <td
              colSpan={2}
              className={`!p-2 text-center ${
                data?.profitOrLoss === "Profit" ? "bg-green-400" : "bg-red-400"
              }`}
            >
              {data?.profitOrLoss}
            </td>
          </tr>
            <tr className=" font-semibold text-gray-900 border-t">
              <td
                colSpan={5}
                className={`!p-2 text-center ${
                  data?.profitOrLoss === "Loss"
                    ? "text-red-400"
                    : "text-green-600"
                }`}
              >
                {data?.profitOrLoss} of {data?.percentage}% and{" "}
                {data?.income - data?.total} rs.
              </td>
            </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewExpense;
