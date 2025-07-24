import { useContext, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { MyContext } from "../../App";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { FaCalendarAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { deleteData, editData } from "../../utils/api";
import { FaFileDownload } from "react-icons/fa";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Button from "@mui/material/Button";

import { IoMdEye } from "react-icons/io";
import RangeMeter from "../RangeMeter";

const columns = [
  { id: "serialNo", label: "Sr. No." },
  { id: "date", label: "Date" },
  { id: "expense", label: "Expense" },
  { id: "sale", label: "Sale" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Actions" },
];

function ExpenseTable() {
  const context = useContext(MyContext);

  const printRef = useRef();

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) {
      toast.error("PDF export failed. Element not found.");
      return;
    }

    // Optional: Apply safe export styles
    element.classList.add("pdf-export");

    const canvas = await html2canvas(element, { scale: 2 });

    element.classList.remove("pdf-export");

    const data = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(data, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("employee-list.pdf");
  };

  const handleUpdateExpense = (exp) => {
    if (!exp) {
      toast.error("Expense is missing!");
      return;
    }
    context?.setOpenModel({type: "Update Expense", _id: exp?._id, open: true});
  }

  const handleViewExpense = (exp) => {
    if (!exp) {
      toast.error("Expense is missing!");
      return;
    }
    context?.setOpenModel({type: "View Expense", _id: exp?._id, open: true});
  }

  const handleDeleteExpense = (id) => {
    if (!id) {
      toast.error("Expense id is missing!");
      return;
    }
    deleteData(`/api/expenses/${id}`).then((res) => {
      if(res?.data?.success === true) {
        toast.success(res?.data?.message);
        const updatedData = context?.expensesData?.filter(item => id !== item._id);
        context?.setExpensesData(updatedData)
      }
    })
  }
  return (
    <TableContainer
      sx={{ maxHeight: 440 }}
      className="border-gray-200 border-2 rounded-md drop-shadow-md"
    >
      <div ref={printRef} id="employeeTable">
        {" "}
        {/* Moved ref here */}
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ fontWeight: 600 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            
            {context?.expensesData.map((exp, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={exp?._id}>
                <TableCell>{index+1}</TableCell>
                <TableCell>{exp?.date?.split('T')[0]}</TableCell>
                <TableCell>{exp?.total || 0}</TableCell>
                <TableCell>{exp?.income || 0}</TableCell>
                <TableCell><RangeMeter percentage={exp?.percentage} status={exp?.profitOrLoss} /></TableCell>
                <TableCell>
                  <IconButton
                   onClick={() => handleUpdateExpense(exp)}
                   aria-label="edit" size="medium">
                    <MdEdit />
                  </IconButton>
                  <IconButton
                   onClick={() => handleViewExpense(exp)}
                   aria-label="view" size="medium">
                    <IoMdEye />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteExpense(exp?._id)}
                    aria-label="delete"
                    size="large"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button
        onClick={handleDownloadPdf}
        className="!capitalize !bg-green-700 gap-[0.4rem] !font-[600] !text-white !m-[0.5rem]"
      >
        <FaFileDownload size={16} /> Download PDF
      </Button>
    </TableContainer>
  );
}

export default ExpenseTable;
