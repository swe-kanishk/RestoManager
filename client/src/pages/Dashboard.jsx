import React, { useContext } from 'react';
import { FaBalanceScaleRight, FaUserFriends } from 'react-icons/fa';
import { MyContext } from '../App';
import { IoCalculatorSharp } from 'react-icons/io5';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import formatINR from '../utils/formatINR';

function Dashboard() {
  const context = useContext(MyContext);

  const cards = [
    {
      icon: <FaUserFriends size={50} className="text-white" />,
      title: 'Total Employees',
      value: context?.employeesData?.length,
      bg: 'bg-green-600',
    },
    {
      icon: <IoCalculatorSharp size={50} className="text-white" />,
      title: 'Expense',
      value: formatINR(context?.dashboardData?.totalExpense),
      bg: 'bg-red-500',
    },
    {
      icon: <FaMoneyBillTrendUp size={50} className="text-white" />,
      title: 'Sale',
      value: formatINR(context?.dashboardData?.totalIncome),
      bg: 'bg-blue-500',
    },
    {
      icon: <FaBalanceScaleRight size={50} className="text-white" />,
      title: 'Status',
      value: context?.dashboardData?.status,
      bg: 'bg-gray-600',
    },
  ];

  return (
    <div className="w-full overflow-x-auto !mt-3">
      <div className="flex justify-between !gap-4 !px-4 min-w-[1024px] sm:min-w-0">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bg} flex flex-col flex-1 gap-2 !p-4 rounded-lg shadow-lg min-w-[250px] w-full sm:w-[250px]`}
          >
            {card.icon}
            <div className="flex justify-between items-center text-white text-lg font-semibold">
              <span>{card.title}:</span>
              <span className="bg-white text-black !px-2 !py-1 rounded-md text-sm font-medium">
                {card.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
