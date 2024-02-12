import React, { useState } from "react";
import AddProductModal from "../components/AddProductModal";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import LinesTable from "../components/LinesTable";
import FilterLineInvoice from "../components/FilterLineInvoice";
import AddLineModal from "../components/AddLineModal";

function Invoices() {
  const [dateFilter, setDateFilter] = useState("");
  const [error, setError] = useState("");

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

  const handleFilter = (date) => {
    setDateFilter(date);
  };

  return (
    <div className="invoices">
      <div className="pageHeader">
        <div className="pageTitle">Invoices</div>
        <div className="pageButtons">
          <AddLineModal
            handleError={handleError}
            handleSuccess={handleSuccess}
          ></AddLineModal>
          <FilterLineInvoice handleFilter={handleFilter}></FilterLineInvoice>
        </div>
      </div>
      <LinesTable
        dateFilter={dateFilter}
        handleError={handleError}
        handleSuccess={handleSuccess}
      ></LinesTable>

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

export default Invoices;
