import React, { useContext } from 'react'
import Button from '@mui/material/Button';
import { MyContext } from '../App';
import { FaPlus } from 'react-icons/fa';

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import AddEmployee from '../components/Employee/AddEmployee';
import EditEmployee from '../components/Employee/EditEmployee';
import ExpenseTable from '../components/Expense/ExpenseTable';
import AddExpense from '../components/Expense/AddExpense';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Expense() {
  const context = useContext(MyContext)
  return (
    <div className='flex flex-col gap-[1rem] !p-[1rem]'>
      <div className="flex justify-between w-full">
        <h2 className='text-2xl font-bold'>Daily Expense Record</h2>
      <Button onClick={() => context?.setOpenModel({open: true, type: "Add Expense"})} variant="contained" className='!w-fit gap-[0.5rem] !capitalize !font-[500]'><FaPlus />Today's Expense</Button>
      </div>
      <ExpenseTable />
    </div>
  )
}

export default Expense