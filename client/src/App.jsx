import { createContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Employee from "./pages/Employee";

import { getData } from "./utils/api";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AttendanceCalendar from "./components/Employee/AttendanceCalendar";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Expense from "./pages/Expense";

const MyContext = createContext();

function App() {
  const [openModel, setOpenModel] = useState({
    open: false,
    _id: null,
    type: null
  });
  const [employeesData, setEmployeesData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    getData("/api/employee").then((res) => {
      if (res?.success) {
        setEmployeesData(res?.employees);
      }
    });
    getData('/api/expenses').then((res) => {
      if(res?.success === true){
        setExpensesData(res?.data)
      }
    })
  }, []);

  const value = {
    openModel,
    setOpenModel,
    employeesData,
    setEmployeesData,
    selectedEmployee,
    setSelectedEmployee,
    expensesData,
    setExpensesData
  };

  return (
    <>
      <Router>
        <MyContext.Provider value={value}>
          <Navbar />
          <Expense />
          <Employee />
          <AttendanceCalendar />
          <Footer />
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
