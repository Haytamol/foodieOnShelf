import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import AddButton from "./AddButton";
import TextField from "@mui/material/TextField";
import "./Navbar.css";

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

export default function AddSupplierModal({ handleSuccess, handleError }) {
  //vars
  const [sup_name, setName] = useState();
  const [sup_city, setCity] = useState();
  const [sup_street, setStreet] = useState();
  const [sup_zipcode, setZipcode] = useState();
  const [sup_contactperson, setContactperson] = useState();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetData();
    setOpen(false);
  };

  const resetData = () => {
    setName();
    setCity();
    setStreet();
    setZipcode();
    setContactperson();
  };

  useEffect(() => {}, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        sup_name,
        sup_city,
        sup_street,
        sup_zipcode,
        sup_contactperson,
      };
      const response = await fetch("http://localhost:5000/supplier", {
        method: "POST",
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
      window.location = "/suppliers";
    } catch (err) {
      console.log(err.message);
    }
    handleClose();
  };

  return (
    <div>
      <AddButton onClick={handleOpen}></AddButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={"modalStyle"} sx={style}>
          <h1 style={{ marginBottom: 20 }}>Add a Supplier</h1>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={sup_name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <br></br>
          <TextField
            id="outlined-basic"
            label="City"
            variant="outlined"
            value={sup_city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="Street"
            variant="outlined"
            value={sup_street}
            onChange={(e) => {
              setStreet(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="Zipcode"
            variant="outlined"
            value={sup_zipcode}
            onChange={(e) => {
              setZipcode(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="Contact Person"
            variant="outlined"
            value={sup_contactperson}
            onChange={(e) => {
              setContactperson(e.target.value);
            }}
          />
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
