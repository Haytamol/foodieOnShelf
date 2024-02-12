import React, { Component, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function FilterStorageType({ handleFilter }) {
  const [types, setTypes] = useState([]);
  const [typeSelected, setTypeSelected] = useState("");

  const getTypes = async () => {
    try {
      const response = await fetch(
        "https://foodie-on-shelf.vercel.app/storagelocation/types"
      );
      const jsonData = await response.json();
      setTypes(jsonData);
      setTypes((current) => [...current, { stg_type: "None" }]);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTypes();
  }, []);

  const handleChange = (event) => {
    setTypeSelected(event.target.value);
    handleFilter(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={typeSelected}
          label="Type"
          onChange={handleChange}
        >
          {types.map((e) => {
            return <MenuItem value={e.stg_type}>{e.stg_type}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
