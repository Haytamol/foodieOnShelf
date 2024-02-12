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
import EditEmployeeModal from "./EditEmployeeModal";

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

export default function EmployeeTable({
  cityFilter,
  handleSuccess,
  handleError,
}) {
  const [employees, setEmployees] = useState([]);

  //Delete an employee
  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(
        `https://foodie-on-shelf.vercel.app/employee/${id}`,
        {
          method: "DELETE",
        }
      );

      setEmployees(employees.filter((employee) => employee.emp_code !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  //Get default values
  const getEmployees = async () => {
    try {
      let link = `https://foodie-on-shelf.vercel.app/employee`;
      const response = await fetch(link);
      const jsonData = await response.json();
      setEmployees(jsonData);

      if (cityFilter !== "None") {
        if (cityFilter !== "") {
          setEmployees(
            jsonData.filter((employee) => employee.emp_city == cityFilter)
          );
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getEmployees();
  }, [cityFilter]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">ID</StyledTableCell>
            <StyledTableCell align="center">Full Name</StyledTableCell>
            <StyledTableCell align="center">PhoneNumber</StyledTableCell>
            <StyledTableCell align="center">City</StyledTableCell>
            <StyledTableCell align="center">Street</StyledTableCell>
            <StyledTableCell align="center">ZipCode</StyledTableCell>
            <StyledTableCell align="center">Manager</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((row) => (
            <StyledTableRow
              key={row.emp_code}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell align="center">{row.emp_code}</StyledTableCell>
              <StyledTableCell align="center">
                {row.emp_fname + " " + row.emp_lname}
              </StyledTableCell>
              <StyledTableCell align="center">
                {row.emp_phonenumber}
              </StyledTableCell>
              <StyledTableCell align="center">{row.emp_city}</StyledTableCell>
              <StyledTableCell align="center">{row.emp_street}</StyledTableCell>
              <StyledTableCell align="center">
                {row.emp_zipcode}
              </StyledTableCell>
              <StyledTableCell align="center">
                {row.mng_fname + " " + row.mng_lname}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <EditEmployeeModal
                  item={row}
                  handleSuccess={handleSuccess}
                  handleError={handleError}
                />
                <Button
                  variant="text"
                  onClick={() => {
                    deleteEmployee(row.emp_code);
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
