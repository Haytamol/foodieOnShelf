import React, { useState } from "react";
import EmployeeTable from "../components/EmployeeTable";
import FilterEmployeeCity from "../components/FilterEmployeeCity";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import AddEmployeeModal from "../components/AddEmployeeModal";

function Employees() {
  const [cityFilter, setCityFilter] = useState("");
  const [error, setError] = useState("");

  //code for alert
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const handleSuccess = () => {
    setOpen(true);
  };

  const handleError = (error) => {
    setError(error.errorMsg);
    setOpen2(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setOpen2(false);
  };
  //alert code end

  const handleFilter = (city) => {
    setCityFilter(city);
  };

  return (
    <div className="employees">
      <div className="pageHeader">
        <div className="pageTitle">Employees</div>
        <div className="pageButtons">
          <FilterEmployeeCity handleFilter={handleFilter}></FilterEmployeeCity>
          <AddEmployeeModal
            handleSuccess={handleSuccess}
            handleError={handleError}
          ></AddEmployeeModal>
        </div>
      </div>

      <EmployeeTable
        cityFilter={cityFilter}
        handleError={handleError}
        handleSuccess={handleSuccess}
      ></EmployeeTable>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          This is a success message!
        </Alert>
      </Snackbar>
      <Snackbar open={open2} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Employees;
