import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
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

export default function EditEmployeeModal({
  handleSuccess,
  handleError,
  item,
}) {
  //managers
  const [managers, setManagers] = useState([]);

  //vars
  const [emp_fname, setFirstName] = useState("");
  const [emp_lname, setLastName] = useState("");
  const [emp_phonenumber, setPhoneNumber] = useState("");
  const [emp_city, setCity] = useState("");
  const [emp_street, setStreet] = useState("");
  const [emp_zipcode, setZipcode] = useState("");
  const [emp_code, setEmployeeCode] = useState(0);
  const [manager, setManager] = useState();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setFirstName(item.emp_fname);
    setLastName(item.emp_lname);
    setPhoneNumber(item.emp_phonenumber);
    setCity(item.emp_city);
    setStreet(item.emp_street);
    setZipcode(item.emp_zipcode);
    setManager(item.mng_lname);
    setOpen(true);
    setEmployeeCode(item.emp_code);
  };
  const handleClose = () => {
    setOpen(false);
    resetData();
  };

  const resetData = () => {
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setCity("");
    setStreet("");
    setZipcode("");
    setManager("");
  };

  const getManagers = async () => {
    try {
      const response = await fetch("http://localhost:5000/managers");
      const jsonData = await response.json();

      setManagers(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getManagers();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        emp_fname,
        emp_lname,
        emp_phonenumber,
        emp_city,
        emp_street,
        emp_zipcode,
        manager,
      };
      const response = await fetch(
        `http://localhost:5000/Employee/${emp_code}`,
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

      window.location = "/employees";
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
          <h1 style={{ marginBottom: 20 }}>Edit an Employee</h1>
          <TextField
            id="outlined-basic"
            label="First Name"
            variant="outlined"
            value={emp_fname}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
          <br></br>
          <TextField
            id="outlined-basic"
            label="Last Name"
            variant="outlined"
            value={emp_lname}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="Phone Number"
            variant="outlined"
            value={emp_phonenumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="City"
            variant="outlined"
            value={emp_city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="Street"
            variant="outlined"
            value={emp_street}
            onChange={(e) => {
              setStreet(e.target.value);
            }}
          />
          <br></br>

          <TextField
            id="outlined-basic"
            label="Zipcode"
            variant="outlined"
            value={emp_zipcode}
            onChange={(e) => {
              setZipcode(e.target.value);
            }}
          />
          <br></br>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Manager</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={manager}
              label="Manager"
              onChange={(e) => {
                setManager(e.target.value);
              }}
            >
              {managers.map((e) => {
                return <MenuItem value={e.emp_lname}>{e.emp_lname}</MenuItem>;
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
