import { useContext, useEffect, useState } from "react";
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
import { deleteData, getData } from "../../utils/api";
import RangeMeter from "../RangeMeter";
import formatINR from "../../utils/formatINR";
import TablePagination from "@mui/material/TablePagination";

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

  const [page, setPage] = useState(0); // MUI page starts from 0
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalCount, setTotalCount] = useState(0);

  const fetchExpenses = async () => {
    const res = await getData(`/api/expenses?page=${page + 1}`);
    if (res?.success) {
      context?.setExpensesData(res?.data);
      setTotalCount(res?.totalCount);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page]);

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
    <div className="w-full overflow-x-auto border-gray-200 border-2 rounded-md drop-shadow-md">
      <TableContainer className="min-w-[700px] max-h-[400px] overflow-y-scroll">
        <Table stickyHeader 
        >
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
                <TableCell>{formatINR(exp?.total || 0)}</TableCell>
                <TableCell>{formatINR(exp?.income || 0)}</TableCell>
                <TableCell className="min-w-[200px]">
                  <div style={{ maxWidth: 150 }}>
                    <RangeMeter
                      percentage={exp?.percentage}
                      status={exp?.profitOrLoss}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
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
       <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[30]} 
      />
    </div>
  );
}

export default ExpenseTable;
