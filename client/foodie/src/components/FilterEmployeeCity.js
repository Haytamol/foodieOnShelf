import React, { Component, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function FilterEmployeeCity({ handleFilter }) {
  const [cities, setCities] = useState([]);
  const [citySelected, setCitySelected] = useState("");

  const getCities = async () => {
    try {
      const response = await fetch("http://localhost:5000/employeesCities");
      const jsonData = await response.json();
      setCities(jsonData);
      setCities((current) => [...current, { emp_city: "None" }]);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getCities();
  }, []);

  const handleChange = (event) => {
    setCitySelected(event.target.value);
    handleFilter(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">City</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={citySelected}
          label="City"
          onChange={handleChange}
        >
          {cities.map((e) => {
            return <MenuItem value={e.emp_city}>{e.emp_city}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
