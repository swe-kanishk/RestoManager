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
import { FaCalendarAlt, FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { deleteData, editData } from "../../utils/api";
import { FaFileDownload } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Button from "@mui/material/Button";

const columns = [
  { id: "serialNo", label: "Sr. No." },
  { id: "employeeName", label: "Employee Name" },
  { id: "avatar", label: "Avatar" },
  { id: "joining", label: "Joined Date" },
  {
    id: "salary",
    label: "Salary",
    format: (value) => value.toLocaleString("en-US"),
  },
  { id: "actions", label: "Actions" },
];

function EmployeeTable() {
  const context = useContext(MyContext);

  const handleRemoveEmployee = (empId) => {
    if (!empId) {
      toast.error("Employee ID is missing!");
      return;
    }
    deleteData(`/api/employee/${empId}`).then((res) => {
      if (res?.data?.success === true) {
        toast.success(res?.data?.message);
        const newData =
          context?.employeesData?.filter((emp) => emp?._id !== empId) || [];
        console.log(newData);
        context?.setEmployeesData(newData);
      }
    });
  };

  const handleEditEmployee = (emp) => {
    if (!emp) {
      toast.error("Employee is missing!");
      return;
    }
    context?.setOpenModel({type: "Edit Employee", _id: emp?._id, open: true});
  };

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
  return (
    <TableContainer
      sx={{ maxHeight: 440, overflow: scrollX, whiteSpace: "nowrap" }}
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
                  style={{ minWidth: column.minWidth, fontWeight: 600 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {context?.employeesData.map((employee, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={employee?._id}>
                <TableCell>{index+1}</TableCell>
                <TableCell>{employee?.fullName}</TableCell>
                <TableCell>
                  <img
                    src={
                      employee?.avatar ||
                      "https://static.vecteezy.com/system/resources/thumbnails/030/504/836/small_2x/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg"
                    }
                    className="min-h-[60px] max-h-[60px] max-w-[60px] min-w-[60px] aspect-square rounded-full object-cover"
                    alt=""
                  />
                </TableCell>
                <TableCell>{employee?.createdAt?.split("T")[0]}</TableCell>
                <TableCell>
                  {(Number(employee?.salary) || 0).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell>
                  <IconButton
                   onClick={() => handleEditEmployee(employee)}
                   aria-label="edit" size="medium">
                    <MdEdit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleRemoveEmployee(employee?._id)}
                    aria-label="delete"
                    size="large"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => context.selectedEmployee !== null ? context.setSelectedEmployee(null) : context.setSelectedEmployee(employee)}
                    aria-label="delete"
                    size="large"
                  >
                    {
                      context?.selectedEmployee?._id === employee?._id ? <FaEyeSlash size={20} /> : <FaEye size={20} />
                    }
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

export default EmployeeTable;
