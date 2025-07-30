import { useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { MyContext } from "../../App";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { toast } from "react-toastify";
import { deleteData } from "../../utils/api";
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

  const handleUpdateExpense = (exp) => {
    if (!exp) return toast.error("Expense is missing!");
    context?.setOpenModel({ type: "Update Expense", _id: exp?._id, open: true });
  };

  const handleViewExpense = (exp) => {
    if (!exp) return toast.error("Expense is missing!");
    context?.setOpenModel({ type: "View Expense", _id: exp?._id, open: true });
  };

  const handleDeleteExpense = (id) => {
    if (!id) return toast.error("Expense id is missing!");
    deleteData(`/api/expenses/${id}`).then((res) => {
      if (res?.data?.success === true) {
        toast.success(res?.data?.message);
        const updatedData = context?.expensesData?.filter(item => id !== item._id);
        context?.setExpensesData(updatedData);
      }
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      <TableContainer className="min-w-[700px]">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {context?.expensesData?.map((exp, index) => (
              <TableRow hover key={exp?._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{exp?.date?.split("T")[0]}</TableCell>
                <TableCell>{exp?.total || 0}</TableCell>
                <TableCell>{exp?.income || 0}</TableCell>
                <TableCell className="min-w-[200px]">
                  <div style={{ maxWidth: 150 }}>
                    <RangeMeter
                      percentage={exp?.percentage}
                      status={exp?.profitOrLoss}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <IconButton onClick={() => handleUpdateExpense(exp)} size="small">
                      <MdEdit />
                    </IconButton>
                    <IconButton onClick={() => handleViewExpense(exp)} size="small">
                      <IoMdEye />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteExpense(exp?._id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ExpenseTable;
