import React, { useContext } from "react";
import EmployeeTable from "../components/Employee/EmployeeTable";
import Button from "@mui/material/Button";
import { MyContext } from "../App";
import { FaPlus } from "react-icons/fa";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import AddEmployee from "../components/Employee/AddEmployee";
import EditEmployee from "../components/Employee/EditEmployee";
import AddExpense from "../components/Expense/AddExpense";
import UpdateExpense from "../components/Expense/UpdateExpense";
import ViewExpense from "../components/Expense/ViewExpense";
import AdvancePaymentForm from "../components/salary/AdvanceForm";
import CreatePayroll from "../components/salary/CreatePayroll";


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

function Employee() {
  const context = useContext(MyContext);
  return (
    <div className="!p-[1rem]">
      <div className="flex flex-col gap-[1rem]">
        <div className="flex justify-between w-full">
          <h2 className="sm:text-2xl text-lg font-bold">Employees Data</h2>
          <Button
            onClick={() =>
              context?.setOpenModel({ open: true, type: "Add Employee" })
            }
            variant="contained"
            className="!w-fit gap-[0.5rem] !capitalize !font-[500]"
          >
            <FaPlus /> <span className="hidden sm:flex">Add New Employee</span>
          </Button>
        </div>
        <EmployeeTable />
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={context?.openModel?.open === true}
        onClose={() =>
          context?.setOpenModel({ _id: null, open: false, type: null })
        }
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={context?.openModel?.open === true}>
          <Box sx={style}>
            {context?.openModel?.type === "Add Employee" && <AddEmployee />}
            {context?.openModel?.type === "Edit Employee" && <EditEmployee />}
            {context?.openModel?.type === "Add Expense" && <AddExpense />}
            {context?.openModel?.type === "Update Expense" && <UpdateExpense />}
            {context?.openModel?.type === "View Expense" && <ViewExpense />}
            {context?.openModel?.type === "Add Advance" && <AdvancePaymentForm />}
            {context?.openModel?.type === "Create Payroll" && <CreatePayroll />}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default Employee;
