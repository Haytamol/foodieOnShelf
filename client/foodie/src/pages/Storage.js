import React, { useState } from "react";
import StorageTable from "../components/StorageTable";
import FilterStorageType from "../components/FilterStorageType";
import AddStorageModal from "../components/AddStorageModal";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

function Products() {
  const [typeFilter,setTypeFilter] = useState("");
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

  const handleFilter = (type) => {
    setTypeFilter(type);
  };

  return (
    <div className="storage">
      <div className="pageHeader">
        <div className="pageTitle">Storage</div>
        <div className="pageButtons">
          <FilterStorageType
            handleFilter={handleFilter}
          ></FilterStorageType>
          <AddStorageModal
            handleSuccess={handleSuccess}
            handleError={handleError}
          ></AddStorageModal>
        </div>
      </div>

      <StorageTable
        typeFilter={typeFilter}
        handleError={handleError}
        handleSuccess={handleSuccess}
      ></StorageTable>
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
