import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { postData2 } from "../../utils/api";
import { toast } from "react-toastify";
import { MyContext } from "../../App";

function AddExpense() {
  const [list, setList] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [formData, setFormData] = useState({
    itemName: "",
    qty: "",
    price: "",
    customDate: new Date().toISOString().split("T")[0], // default to today's date
  });

  const context = useContext(MyContext);

  useEffect(() => {
    const total = list.reduce((acc, item) => acc + parseFloat(item.price), 0);
    const roundedTotal = parseFloat(total.toFixed(2)); // limit to 2 decimals
    setTotalExpense(roundedTotal);
  }, [list]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddExpense = () => {
    const { itemName, price } = formData;

    if (!itemName || !price) {
      toast.error("Please enter both Item Name and Price.");
      return;
    }
    setList((prev) => [
      ...prev,
      {
        itemName: formData.itemName,
        qty: formData.qty,
        price: formData.price,
      },
    ]);
    setFormData((prev) => ({
      ...prev,
      itemName: "",
      qty: "",
      price: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(list);
    if (!list.length) {
      toast.error("Please add expenses list to submit!");
      return;
    }

    const payload = {
      date: formData.customDate || new Date().toISOString().split("T")[0],
      expenses: list,
    };

    postData2("/api/expenses", payload)
      .then((res) => {
        if (res?.success === true) {
          context.setExpensesData((prev) => [...prev, res?.data]);

          // ✅ Clear the list only, keep the date
          setList([]);

          // ✅ Optionally reset item inputs but keep customDate
          setFormData((prev) => ({
            ...prev,
            itemName: "",
            qty: "",
            price: "",
          }));

          context?.setOpenModel({
            open: false,
            _id: null,
            type: null,
          });
          return;
        }
        toast.error(res?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col gap-6 !pr-4">
      <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
        Add Today's Expense:
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="date"
          name="customDate"
          value={formData.customDate}
          onChange={handleChange}
          className="!p-2 border border-gray-300 rounded"
        />

        <input
          type="text"
          name="itemName"
          placeholder="Item Name"
          value={formData.itemName}
          onChange={handleChange}
          className="!p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="qty"
          placeholder="Quantity"
          value={formData.qty}
          onChange={handleChange}
          className="!p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="!p-2 border border-gray-300 rounded"
        />
        <button
          type="button"
          onClick={handleAddExpense}
          className="bg-gray-500 text-white !p-2 rounded cursor-pointer hover:bg-gray-600"
        >
          Add Expense
        </button>

        <div className="w-full overflow-x-scroll">
          <table className="w-full text-sm text-left text-gray-600 border border-gray-200 rounded-lg overflow-hidden">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="!p-3 whitespace-nowrap">Sr. No.</th>
              <th className="!p-3 whitespace-nowrap">Item Name</th>
              <th className="!p-3 whitespace-nowrap">Quantity</th>
              <th className="!p-3 whitespace-nowrap text-right">
                Total Price (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index} className="bg-white border-t hover:bg-gray-50">
                <td className="!p-2">{index + 1}</td>
                <td className="!p-2">{item.itemName}</td>
                <td className="!p-2">{item.qty}</td>
                <td className="!p-2 text-right font-medium">₹{item.price}</td>
              </tr>
            ))}
            <tr className="bg-blue-100 font-semibold text-gray-900 border-t">
              <td colSpan={3} className="!p-1.5 text-left">
                Total Expense:
              </td>
              <td className="!p-1.5 text-right">₹{totalExpense}</td>
            </tr>
          </tbody>
        </table>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white !p-2 rounded cursor-pointer hover:bg-blue-600"
        >
          Done
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
