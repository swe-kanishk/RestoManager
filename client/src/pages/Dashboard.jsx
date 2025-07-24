import React, { useContext } from 'react'
import { FaUserFriends } from 'react-icons/fa'
import { MyContext } from '../App'
import { IoCalculatorSharp } from "react-icons/io5";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

function Dashboard() {
    const context = useContext(MyContext)
  return (
    <div className='flex items-center !p-[1rem] !mt-3 !gap-8 justify-between'>
        <div className="!p-4.5 bg-green-600 drop-shadow-lg rounded-lg flex flex-col gap-1.5 w-1/4">
            <FaUserFriends size={50} className='text-white' />
            <div className="flex items-center justify-between w-full">
                <span className='font-bold text-white text-xl'>Total Employees: </span>
                <span className='bg-white !p-1.5 rounded-md font-medium'>{context?.employeesData?.length}</span>
            </div>
        </div>
        <div className="!p-4.5 bg-red-500 drop-shadow-lg rounded-lg flex flex-col gap-1 w-1/4">
            <IoCalculatorSharp size={50} className='text-white' />
            <div className="flex items-center justify-between w-full">
                <span className='font-bold text-white text-xl'>Monthly Expense: </span>
                <span className='bg-white !p-1.5 rounded-md font-medium'>{context?.employeesData?.length}</span>
            </div>
        </div>
        <div className="!p-4.5 bg-blue-500 drop-shadow-lg rounded-lg flex flex-col gap-1 w-1/4">
            <FaMoneyBillTrendUp size={50} className='text-white' />
            <div className="flex items-center justify-between w-full">
                <span className='font-bold text-white text-xl'>Monthly Sale: </span>
                <span className='bg-white !p-1.5 rounded-md font-medium'>{context?.employeesData?.length}</span>
            </div>
        </div>
        <div className="!p-4.5 bg-gray-600 drop-shadow-lg rounded-lg flex flex-col gap-1 w-1/4">
            <FaUserFriends size={50} className='text-white' />
            <div className="flex items-center justify-between w-full">
                <span className='font-bold text-white text-xl'>Total Employees: </span>
                <span className='bg-white !p-1.5 rounded-md font-medium'>{context?.employeesData?.length}</span>
            </div>
        </div>
    </div>
  )
}

export default Dashboard
