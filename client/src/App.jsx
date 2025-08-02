import { createContext, useEffect, useState } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Employee from "./pages/Employee";

import { getData } from "./utils/api";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AttendanceCalendar from "./components/Employee/AttendanceCalendar";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Expense from "./pages/Expense";
import Dashboard from "./pages/Dashboard";
import PayrollPage from "./components/salary/PayrollPage";
import CreatePayroll from "./components/salary/CreatePayroll";
import AdvancePaymentForm from "./components/salary/AdvanceForm";
import dayjs from 'dayjs';

import AttendanceData from "./components/Employee/AttendanceData";

import { Collapse } from "react-collapse";
import AdvanceTable from "./components/salary/AdvanceTable";
import Login from "./components/auth/Login";
import ProtectedRoutes from "./pages/ProtectedRoutes";

const MyContext = createContext();

function App() {
  const [openModel, setOpenModel] = useState({
    open: false,
    _id: null,
    type: null,
  });
  const [advanceData, setAdvanceData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate() + 1);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dashboardData, setDashboardData] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const [employeesData, setEmployeesData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    getData("/api/employee").then((res) => {
      if (res?.success) {
        setEmployeesData(res?.employees);
      }
    });
    getData("/api/expenses").then((res) => {
      if (res?.success === true) {
        setExpensesData(res?.data);
      }
    });
    getData("/api/dashboard").then((res) => {
      if (res?.success === true) {
        setDashboardData(res?.data);
      }
    });
  }, []);

  const value = {
    openModel,
    setOpenModel,
    employeesData,
    setEmployeesData,
    selectedEmployee,
    setSelectedEmployee,
    expensesData,
    setExpensesData,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    selectedDay,
    setSelectedDay,
    advanceData,
    setAdvanceData,
    setDashboardData,
    dashboardData,
    setIsLogin,
    isLogin
  };

  return (
    <>
      <Router>
        <MyContext.Provider value={value}>
           <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoutes isLogin={isLogin}>
                <Navbar />
                <Dashboard />
                <Expense />
                <Employee />
                <Collapse isOpened={!!selectedEmployee?._id}>
                  <div className="flex flex-col !w-full !p-6 !gap-2 rounded-md">
                    <h1 className="!text-2xl font-bold">
                      Showing data of {selectedEmployee?.fullName || ""} for{" "}
                      {dayjs().month(selectedMonth - 1).format("MMMM")} {selectedYear}
                    </h1>
                    <div className="flex w-full flex-col md:flex-row gap-6 justify-between">
                      <AttendanceData />
                      <PayrollPage />
                      <AdvanceTable />
                    </div>
                  </div>
                </Collapse>
                <AttendanceCalendar />
                <Footer />
              </ProtectedRoutes>
            }
          />
        </Routes>
        </MyContext.Provider>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000} // closes in 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
export { MyContext };
