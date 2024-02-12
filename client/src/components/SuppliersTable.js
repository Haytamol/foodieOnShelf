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
import EditSupplierModal from "./EditSupplierModal";

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

export default function SuppliersTable({
  cityFilter,
  handleSuccess,
  handleError,
}) {
  const [suppliers, setSuppliers] = useState([]);

  //Delete a supplier
  const deleteSupplier = async (id) => {
    try {
      const response = await fetch(
        `https://foodie-on-shelf.vercel.app/supplier/${id}`,
        {
          method: "DELETE",
        }
      );

      setSuppliers(suppliers.filter((supplier) => supplier.sup_code !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  //Get default values
  const getSuppliers = async () => {
    try {
      let link = `https://foodie-on-shelf.vercel.app/supplier`;
      const response = await fetch(link);
      const jsonData = await response.json();
      setSuppliers(jsonData);

      if (cityFilter !== "None") {
        if (cityFilter !== "") {
          setSuppliers(
            jsonData.filter((supplier) => supplier.sup_city == cityFilter)
          );
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getSuppliers();
  }, [cityFilter]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">ID</StyledTableCell>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">City</StyledTableCell>
            <StyledTableCell align="center">Street</StyledTableCell>
            <StyledTableCell align="center">Zipcode</StyledTableCell>
            <StyledTableCell align="center">ContactPerson</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {suppliers.map((row) => (
            <StyledTableRow
              key={row.sup_code}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell align="center">{row.sup_code}</StyledTableCell>
              <StyledTableCell align="center">{row.sup_name}</StyledTableCell>
              <StyledTableCell align="center">{row.sup_city}</StyledTableCell>
              <StyledTableCell align="center">{row.sup_street}</StyledTableCell>
              <StyledTableCell align="center">
                {row.sup_zipcode}
              </StyledTableCell>
              <StyledTableCell align="center">
                {row.sup_contactperson}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <EditSupplierModal
                  item={row}
                  handleSuccess={handleSuccess}
                  handleError={handleError}
                />
                <Button
                  variant="text"
                  onClick={() => {
                    deleteSupplier(row.sup_code);
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
