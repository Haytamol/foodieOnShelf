import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import AddButton from "./AddButton";
import TextField from "@mui/material/TextField";
import "./Navbar.css";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function EditProductModal({ handleSuccess, handleError, item }) {
  //suppliers
  const [suppliers, setSuppliers] = useState([]);
  //storages
  const [storage, setStorage] = useState([]);

  //vars
  const [prd_name, setName] = useState("");
  const [prd_quantity, setQuantity] = useState(0);
  const [prd_minquantity, setMinQuantity] = useState(0);
  const [prd_unit, setUnit] = useState("");
  const [prd_category, setCategory] = useState("");
  const [sup_name, setSupplier] = useState("");
  const [stg_id, setStorageId] = useState(0);
  const [prd_id, setProductId] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setName(item.prd_name);
    setQuantity(item.prd_quantity);
    setMinQuantity(item.prd_minquantity);
    setUnit(item.prd_unit);
    setCategory(item.prd_category);
    setSupplier(item.sup_name);
    setStorageId(item.stg_id);
    setOpen(true);
    setProductId(item.prd_id);
  };
  const handleClose = () => {
    setOpen(false);
    resetData();
  };

  const resetData = () => {
    setName("");
    setQuantity(0);
    setMinQuantity(0);
    setUnit("");
    setCategory("");
    setSupplier("");
    setStorageId(0);
  };

  const getSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:5000/Supplier/names");
      const jsonData = await response.json();

      setSuppliers(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getStorage = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/storagelocation/storageAvail"
      );
      const jsonData = await response.json();

      setStorage(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getSuppliers();
    getStorage();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        prd_name,
        prd_quantity,
        prd_minquantity,
        prd_unit,
        prd_category,
        sup_name,
        stg_id,
      };
      const response = await fetch(`http://localhost:5000/product/${prd_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        handleError(error);
      } else {
        handleSuccess();
      }
      resetData();

      window.location = "/products";
    } catch (err) {
      console.log(err.message);
    }
    handleClose();
  };

  return (
    <div>
      <Button variant="text" onClick={handleOpen}>
        <EditIcon sx={{ color: "#171c26" }} />
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={"modalStyle"} sx={style}>
          <h1 style={{ marginBottom: 20 }}>Edit a Product</h1>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={prd_name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <br></br>
          <TextField
            id="outlined-basic"
            label="Quantity"
            variant="outlined"
            value={prd_quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="Min Quantity"
            variant="outlined"
            value={prd_minquantity}
            onChange={(e) => {
              setMinQuantity(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="Unit"
            variant="outlined"
            value={prd_unit}
            onChange={(e) => {
              setUnit(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="Category"
            variant="outlined"
            value={prd_category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          />
          <br></br>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sup_name}
              label="Supplier"
              onChange={(e) => {
                setSupplier(e.target.value);
              }}
            >
              {suppliers.map((e) => {
                return <MenuItem value={e.sup_name}>{e.sup_name}</MenuItem>;
              })}
            </Select>
          </FormControl>

          <br></br>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Storage</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={stg_id}
              label="Storage"
              onChange={(e) => {
                setStorageId(e.target.value);
              }}
            >
              {storage.map((e) => {
                return <MenuItem value={e.stg_id}>{e.stg_id}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <br></br>
          <div className="ModalButtons">
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                backgroundColor: "#171c26",
                "&:hover": {
                  backgroundColor: "#364258",
                  color: "#fff",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onSubmit}
              style={{ marginLeft: 15 }}
              sx={{
                backgroundColor: "#54B435",
                "&:hover": {
                  backgroundColor: "#69e042",
                  color: "#fff",
                },
              }}
            >
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
