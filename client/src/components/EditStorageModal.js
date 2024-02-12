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

export default function EditStorageModal({ handleSuccess, handleError, item }) {
  //vars
  const [stg_type, setType] = useState();
  const [stg_roomnumber, setRoomnumber] = useState();
  const [stg_city, setCity] = useState();
  const [stg_street, setStreet] = useState();
  const [stg_zipcode, setZipcode] = useState();
  const [stg_full, setFull] = useState();
  const [stg_id, setStorageID] = useState();

  const [storageFullValues, setstorageFullValues] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setType(item.stg_type);
    setRoomnumber(item.stg_roomnumber);
    setCity(item.stg_city);
    setStreet(item.stg_street);
    setZipcode(item.stg_zipcode);
    setFull(item.stg_full);
    setOpen(true);
    setStorageID(item.stg_id);
  };
  const handleClose = () => {
    setOpen(false);
    resetData();
  };

  const resetData = () => {
    setType();
    setRoomnumber();
    setCity();
    setStreet();
    setZipcode();
    setFull();
  };

  useEffect(() => {
    setstorageFullValues([
      {
        stg_full: "Y",
      },
      {
        stg_full: "N",
      },
    ]);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        stg_type,
        stg_roomnumber,
        stg_city,
        stg_street,
        stg_zipcode,
        stg_full,
      };
      const response = await fetch(
        `https://foodie-on-shelf.vercel.app/storagelocation/${stg_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        handleError(error);
      } else {
        handleSuccess();
      }
      resetData();

      window.location = "/storage";
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
          <h1 style={{ marginBottom: 20 }}>Edit a Storage Location</h1>
          <TextField
            disabled
            id="outlined"
            label="Type"
            variant="outlined"
            value={stg_type}
            onChange={(e) => {
              setType(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="Room Number"
            variant="outlined"
            value={stg_roomnumber}
            onChange={(e) => {
              setRoomnumber(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="City"
            variant="outlined"
            value={stg_city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="Street"
            variant="outlined"
            value={stg_street}
            onChange={(e) => {
              setStreet(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="Zipcode"
            variant="outlined"
            value={stg_zipcode}
            onChange={(e) => {
              setZipcode(e.target.value);
            }}
          />
          <br></br>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Full?</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={stg_full}
              label="Full? (Y OR N)"
              onChange={(e) => {
                setFull(e.target.value);
              }}
            >
              {storageFullValues.map((e) => {
                return <MenuItem value={e.stg_full}>{e.stg_full}</MenuItem>;
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
