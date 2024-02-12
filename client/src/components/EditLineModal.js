import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import "./Navbar.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

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

export default function EditLineModal({ handleSuccess, handleError, item }) {
  //invoice dates
  const [invoiceDates, setInvoiceDates] = useState([]);
  //products
  const [products, setProducts] = useState([]);

  //vars
  const [line_quantity, setQuantity] = useState(0);
  const [line_unitprice, setUnitPrice] = useState(0);
  const [inv_date, setInvoiceDate] = useState();
  const [prd_name, setProduct] = useState();

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setQuantity(item.line_quantity);
    setUnitPrice(item.line_unitprice);
    setInvoiceDate(item.inv_date);
    setProduct(item.prd_name);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    resetData();
  };

  const resetData = () => {
    setQuantity(0);
    setUnitPrice(0);
    setInvoiceDate();
    setProduct();
  };

  const getDates = async () => {
    try {
      const response = await fetch("http://localhost:5000/invoice/dates");
      const jsonData = await response.json();

      setInvoiceDates(
        jsonData.map((line) => {
          let date = new Date(line.inv_date);
          let dateMDY = `${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}`;
          return { inv_date: dateMDY };
        })
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/product/names");
      const jsonData = await response.json();

      setProducts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getDates();
    getProducts();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        line_quantity,
        line_unitprice,
        inv_date,
        prd_name,
      };
      const response = await fetch("http://localhost:5000/line", {
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
      //window.location = "/invoices";
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
          <h1 style={{ marginBottom: 20 }}>Edit a Line</h1>
          <TextField
            id="outlined-basic"
            label="Quantity"
            variant="outlined"
            value={line_quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
          <br></br>
          <TextField
            id="outlined-basic"
            label="Unit Price"
            variant="outlined"
            value={line_unitprice}
            onChange={(e) => {
              setUnitPrice(e.target.value);
            }}
          />
          <br></br>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Invoice</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={inv_date}
              label="Invoice"
              onChange={(e) => {
                setInvoiceDate(e.target.value);
              }}
            >
              {invoiceDates.map((e) => {
                return <MenuItem value={e.inv_date}>{e.inv_date}</MenuItem>;
              })}
            </Select>
          </FormControl>

          <br></br>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Product</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={prd_name}
              label="Product"
              onChange={(e) => {
                setProduct(e.target.value);
              }}
            >
              {products.map((e) => {
                return <MenuItem value={e.prd_name}>{e.prd_name}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <br></br>
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
