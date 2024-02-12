import React, { useState } from "react";
import SuppliersTable from "../components/SuppliersTable";
import FilterSupplierCity from "../components/FilterSupplierCity";
import AddSupplierModa from "../components/AddSupplierModal";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

function Products() {
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
    <div className="suppliers">
      <div className="pageHeader">
        <div className="pageTitle">Suppliers</div>
        <div className="pageButtons">
          <FilterSupplierCity
            handleFilter={handleFilter}
          ></FilterSupplierCity>
          <AddSupplierModa
            handleSuccess={handleSuccess}
            handleError={handleError}
          ></AddSupplierModa>
        </div>
      </div>

      <SuppliersTable
        cityFilter={cityFilter}
        handleError={handleError}
        handleSuccess={handleSuccess}
      ></SuppliersTable>
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

export default Products;
