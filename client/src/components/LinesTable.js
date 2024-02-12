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
import EditLineModal from "./EditLineModal";

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

export default function LinesTable({ dateFilter, handleSuccess, handleError }) {
  const [lines, setLines] = useState([]);

  //Delete a line
  const deleteLine = async (id) => {
    try {
      const response = await fetch(
        `https://foodie-on-shelf.vercel.app/line/${id}`,
        {
          method: "DELETE",
        }
      );

      setLines(lines.filter((line) => line.line_number !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  //Get default values
  const getLines = async () => {
    try {
      let link = `https://foodie-on-shelf.vercel.app/line`;
      const response = await fetch(link);
      const jsonData = await response.json();
      setLines(jsonData);

      //console.log(lines[0].date);

      if (dateFilter !== "None") {
        if (dateFilter !== "") {
          console.log(
            "the dates filter is",
            dateFilter,
            "the data ias ",
            jsonData
          );
          setLines(jsonData.filter((line) => line.date == dateFilter));
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getLines();
  }, [dateFilter]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Product</StyledTableCell>
            <StyledTableCell align="center">Supplier</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="center">Unit Price</StyledTableCell>
            <StyledTableCell align="center">Total Amount</StyledTableCell>

            <StyledTableCell></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lines.map((row) => (
            <StyledTableRow
              key={row.line_number}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell align="center">{row.prd_name}</StyledTableCell>
              <StyledTableCell align="center">{row.sup_name}</StyledTableCell>
              <StyledTableCell align="center">
                {row.line_quantity + " " + row.prd_unit}
              </StyledTableCell>
              <StyledTableCell align="center">
                {row.line_unitprice + " Dh"}
              </StyledTableCell>
              <StyledTableCell align="center">
                {row.totalamount + " Dh"}
              </StyledTableCell>

              <StyledTableCell component="th" scope="row">
                <EditLineModal
                  item={row}
                  handleSuccess={handleSuccess}
                  handleError={handleError}
                />
                <Button
                  variant="text"
                  onClick={() => {
                    deleteLine(row.line_number);
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
