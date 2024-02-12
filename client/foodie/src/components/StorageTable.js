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
import EditStoragetModal from "./EditStorageModal";
import EditStorageModal from "./EditStorageModal";

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

export default function StorageTable({
  typeFilter,
  handleSuccess,
  handleError,
}) {
  const [storages, setStorages] = useState([]);

  //Delete a storage location
  const deleteStorage = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/storagelocation/${id}`,
        {
          method: "DELETE",
        }
      );

      setStorages(storages.filter((storage) => storage.stg_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  //Get default values
  const getStorages = async () => {
    try {
      let link = `http://localhost:5000/storagelocation`;
      const response = await fetch(link);
      const jsonData = await response.json();
      setStorages(jsonData);

      if (typeFilter !== "None") {
        if (typeFilter !== "") {
          setStorages(
            jsonData.filter((storage) => storage.stg_type == typeFilter)
          );
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getStorages();
  }, [typeFilter]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">ID</StyledTableCell>
            <StyledTableCell align="center">Type</StyledTableCell>
            <StyledTableCell align="center">RoomNumber</StyledTableCell>
            <StyledTableCell align="center">City</StyledTableCell>
            <StyledTableCell align="center">Street</StyledTableCell>
            <StyledTableCell align="center">Zipcode</StyledTableCell>
            <StyledTableCell align="center">Full?</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {storages.map((row) => (
            <StyledTableRow
              key={row.stg_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell align="center">{row.stg_id}</StyledTableCell>
              <StyledTableCell align="center">{row.stg_type}</StyledTableCell>
              <StyledTableCell align="center">
                {row.stg_roomnumber}
              </StyledTableCell>
              <StyledTableCell align="center">{row.stg_city}</StyledTableCell>
              <StyledTableCell align="center">{row.stg_street}</StyledTableCell>
              <StyledTableCell align="center">
                {row.stg_zipcode}
              </StyledTableCell>
              <StyledTableCell align="center">{row.stg_full}</StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <EditStorageModal
                  item={row}
                  handleSuccess={handleSuccess}
                  handleError={handleError}
                />
                <Button
                  variant="text"
                  onClick={() => {
                    deleteStorage(row.stg_id);
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
