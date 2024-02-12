import React, { Component, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function FilterProductCategory({ handleFilter }) {
  const [categories, setCategories] = useState([]);
  const [categorySelected, setCategorySelected] = useState("");

  const getCategories = async () => {
    try {
      const response = await fetch(
        "https://foodie-on-shelf.vercel.app/product/categories"
      );
      const jsonData = await response.json();
      setCategories(jsonData);
      setCategories((current) => [...current, { prd_category: "None" }]);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleChange = (event) => {
    setCategorySelected(event.target.value);
    handleFilter(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={categorySelected}
          label="Category"
          onChange={handleChange}
        >
          {categories.map((e) => {
            return <MenuItem value={e.prd_category}>{e.prd_category}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
