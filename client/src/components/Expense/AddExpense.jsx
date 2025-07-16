import React, { useState } from "react";

function AddExpense() {
  const [list, setList] = useState(["hello", "jii"]);
  return (
    <div className="flex flex-col gap-2.5">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              Sr. No.
            </th>
            <th scope="col" className="px-6 py-3">
              Item Name
            </th>
            <th scope="col" className="px-6 py-3">
              qty
            </th>
            <th scope="col" className="px-6 py-3">
              Total Price
            </th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => {
            return (
              <tr className="bg-white border-b border-gray-200">
                <td className="px-6 py-4">{index}</td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  Apple MacBook Pro 17"
                </th>
                <td className="px-6 py-4">Silver</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AddExpense;
