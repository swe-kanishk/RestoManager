import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { MyContext } from "../../App";
import { editData2, getData } from "../../utils/api";

function UpdateExpense() {
  const [list, setList] = useState([]);
  const [income, setIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [formData, setFormData] = useState({
    itemName: "",
    qty: "",
    price: "",
  });

  const context = useContext(MyContext);

  // Fetch data on selected date change
  useEffect(() => {
    getData(`/api/expenses/${context?.openModel?._id}`)
      .then((res) => {
        if (res?.success === true) {
          setList(res?.data?.expenses);
          setIncome(res?.data?.income || 0)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Recalculate total expense
  useEffect(() => {
    const total = list.reduce((acc, item) => acc + parseFloat(item.price), 0);
    setTotalExpense(parseFloat(total.toFixed(2)));
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
    setList((prev) => [...prev, formData]);
    setFormData({ itemName: "", qty: "", price: "" });
  };

  const handleDelete = (index) => {
    const updatedList = [...list];
    updatedList.splice(index, 1);
    setList(updatedList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!list?.length) {
      toast.error("Expense list is empty.");
      return;
    }

    const payload = {
      expenses: list,
      income: income || null,
    };
    editData2(`/api/expenses/${context?.openModel?._id}`, payload).then(
      (res) => {
        if (res?.data?.success === true) {
          const updated = context?.expensesData?.map((item) =>
            item?._id === context?.openModel?._id ? res?.data?.data : item
          );
          context.setExpensesData(updated);
          context?.setOpenModel({
            open: false,
            _id: null,
            type: null,
          });
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 pr-4">
      <h2 className="text-2xl font-semibold text-gray-800">Update Expense</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
        <button
          type="button"
          onClick={handleAddExpense}
          className="bg-gray-500 text-white !p-2 rounded hover:bg-gray-600"
        >
          Add Item
        </button>

        <table className="w-full text-sm text-left text-gray-600 border border-gray-200 rounded-lg overflow-hidden">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="!p-3">Sr. No.</th>
              <th className="!p-3">Item Name</th>
              <th className="!p-3">Quantity</th>
              <th className="!p-3 text-right">Price (₹)</th>
              <th className="!p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index} className="bg-white border-t hover:bg-gray-50">
                <td className="!p-2">{index + 1}</td>
                <td className="!p-2">{item.itemName}</td>
                <td className="!p-2">{item.qty}</td>
                <td className="!p-2 text-right">₹{item.price}</td>
                <td className="!p-2 text-right">
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:underline"
                    type="button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-blue-100 font-semibold text-gray-900 border-t">
              <td colSpan={3} className="!p-2 text-left">
                Total Expense:
              </td>
              <td colSpan={2} className="!p-2 text-right">
                ₹{totalExpense}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex flex-col gap-1">
            <label htmlFor="sale" className="font-medium text-[14px]">Total Sale:</label>
        <input
          id="sale"
          type="number"
          placeholder="Enter today's income (₹)"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className="!p-2 border border-gray-300 rounded w-full"
        />
</div>
        <button
          type="submit"
          className="bg-blue-500 text-white !p-2 rounded hover:bg-blue-600 mt-4"
        >
          Update Expense
        </button>
      </form>
    </div>
  );
}

export default UpdateExpense;
