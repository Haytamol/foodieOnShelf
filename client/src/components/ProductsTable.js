import React, { Component, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditProductModal from "./EditProductModal";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#171c26",
    color: "#ffb647",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ProductTabe({
  categoryFilter,
  handleSuccess,
  handleError,
}) {
  const [products, setProducts] = useState([]);

  //Delete a product
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(
        `https://foodie-on-shelf.vercel.app/product/${id}`,
        {
          method: "DELETE",
        }
      );

      setProducts(products.filter((product) => product.prd_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  //Get default values
  const getProducts = async () => {
    try {
      let link = `https://foodie-on-shelf.vercel.app/product`;
      const response = await fetch(link);
      const jsonData = await response.json();
      setProducts(jsonData);

      if (categoryFilter !== "None") {
        if (categoryFilter !== "") {
          setProducts(
            jsonData.filter((product) => product.prd_category == categoryFilter)
          );
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, [categoryFilter]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">ID</StyledTableCell>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="center">MinimumQuantity</StyledTableCell>
            <StyledTableCell align="center">Unit</StyledTableCell>
            <StyledTableCell align="center">Category</StyledTableCell>
            <StyledTableCell align="center">Supplier</StyledTableCell>
            <StyledTableCell align="center">StorageLocation</StyledTableCell>
            <StyledTableCell align="center">Reorder?</StyledTableCell>

            <StyledTableCell></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((row) => (
            <StyledTableRow
              key={row.prd_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell align="center">{row.prd_id}</StyledTableCell>
              <StyledTableCell align="center">{row.prd_name}</StyledTableCell>
              <StyledTableCell align="center">
                {row.prd_quantity}
              </StyledTableCell>
              <StyledTableCell align="center">
                {row.prd_minquantity}
              </StyledTableCell>
              <StyledTableCell align="center">{row.prd_unit}</StyledTableCell>
              <StyledTableCell align="center">
                {row.prd_category}
              </StyledTableCell>
              <StyledTableCell align="center">{row.sup_name}</StyledTableCell>
              <StyledTableCell align="center">{row.stg_id}</StyledTableCell>
              <StyledTableCell align="center">{row.reorder}</StyledTableCell>

              <StyledTableCell component="th" scope="row">
                <EditProductModal
                  item={row}
                  handleSuccess={handleSuccess}
                  handleError={handleError}
                />
                <Button
                  variant="text"
                  onClick={() => {
                    deleteProduct(row.prd_id);
                  }}
                >
                  <DeleteIcon sx={{ color: "red" }} />
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
