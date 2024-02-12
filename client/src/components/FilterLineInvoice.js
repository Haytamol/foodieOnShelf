import React, { Component, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function FilterLineInvoice({ handleFilter }) {
  const [invoices, setInvoices] = useState([]);
  const [invoiceSelected, setInvoiceSelected] = useState("");

  const getInvoices = async () => {
    try {
      const response = await fetch(
        "https://foodie-on-shelf.vercel.app/invoice/dates"
      );
      const jsonData = await response.json();
      setInvoices(jsonData);
      //setInvoices((current) => [...current, { inv_date: "None" }]);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getInvoices();
  }, []);

  const handleChange = (event) => {
    setInvoiceSelected(event.target.value);
    handleFilter(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Date</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={invoiceSelected}
          label="Invoice Date"
          onChange={handleChange}
        >
          {invoices.map((e) => {
            return (
              <MenuItem value={e.inv_date}>{e.inv_date.slice(0, 10)}</MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
