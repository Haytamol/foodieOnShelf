import React, { useState } from "react";
import ProductTable from "../components/ProductsTable";
import FilterProductCategory from "../components/FilterProductCategory";
import AddProductModal from "../components/AddProductModal";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

function Products() {
  const [categoryFilter, setCategoryFilter] = useState("");
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

  const handleFilter = (category) => {
    setCategoryFilter(category);
    //getFilteredProducts();
  };

  return (
    <div className="products">
      <div className="pageHeader">
        <div className="pageTitle">Products</div>
        <div className="pageButtons">
          <FilterProductCategory
            handleFilter={handleFilter}
          ></FilterProductCategory>
          <AddProductModal
            handleSuccess={handleSuccess}
            handleError={handleError}
          ></AddProductModal>
        </div>
      </div>

      <ProductTable
        categoryFilter={categoryFilter}
        handleError={handleError}
        handleSuccess={handleSuccess}
      ></ProductTable>
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
