const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
  res.send("server is running...");
});
//routes

//Product
//Get the products' categories
app.get("/product/categories", async (req, res) => {
  try {
    const allProducts = await pool.query(
      "SELECT DISTINCT prd_category FROM Product"
    );
    res.json(allProducts.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//Get the products' names
app.get("/product/names", async (req, res) => {
  try {
    const allProducts = await pool.query(
      "SELECT DISTINCT prd_name FROM Product"
    );
    res.json(allProducts.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//Get the products filtered by category
app.get("/product/:filterType/:filterValue", async (req, res) => {
  try {
    const { filterType, filterValue } = req.params;
    console.log(filterType, filterValue);
    const allProducts = await pool.query(
      `SELECT Product.*, sup_name FROM Product NATURAL JOIN Supplier WHERE ${filterType} = $1 ORDER BY prd_name`,
      [filterValue]
    );
    console.log(filterType, filterValue);
    res.json(allProducts.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//Create a product
app.post("/product", async (req, res) => {
  try {
    const {
      prd_name,
      prd_quantity,
      prd_minquantity,
      prd_unit,
      prd_category,
      sup_name,
      stg_id,
    } = req.body;

    const newProduct = await pool.query(
      "INSERT INTO Product (prd_name, prd_quantity,prd_minquantity,prd_unit,prd_category,sup_code,stg_id) VALUES($1, $2, $3, $4, $5, (SELECT sup_code FROM Supplier WHERE sup_name=$6), $7) RETURNING *",
      [
        prd_name,
        prd_quantity,
        prd_minquantity,
        prd_unit,
        prd_category,
        sup_name,
        stg_id,
      ]
    );
    res.json(newProduct.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(401);
    res.json({ errorMsg: error.message });
  }
});

//get all products
app.get("/product", async (req, res) => {
  try {
    const allProducts = await pool.query(
      "SELECT Product.*, sup_name FROM Product NATURAL JOIN Supplier ORDER BY prd_name"
    );
    res.json(allProducts.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//get a product
app.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query(
      "SELECT * FROM Product WHERE prd_id = $1",
      [id]
    );
    res.json(product.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//update a product
app.put("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      prd_name,
      prd_quantity,
      prd_minquantity,
      prd_unit,
      prd_category,
      sup_name,
      stg_id,
    } = req.body;

    const updateProduct = await pool.query(
      "UPDATE Product SET prd_name = $1, prd_quantity = $2, prd_minquantity = $3, prd_unit = $4, prd_category = $5, sup_code = (SELECT sup_code FROM Supplier WHERE sup_name=$6), stg_id = $7 WHERE prd_id = $8  ",
      [
        prd_name,
        prd_quantity,
        prd_minquantity,
        prd_unit,
        prd_category,
        sup_name,
        stg_id,
        id,
      ]
    );

    res.json("Product was updated!");
  } catch (error) {
    console.error(error.message);
  }
});

//delete a product
app.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteProduct = await pool.query(
      "DELETE FROM Product WHERE prd_id = $1",
      [id]
    );

    res.json("Product was deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

//Invoice
//Create a new Invoice
app.post("/invoice", async (req, res) => {
  try {
    const { inv_date, emp_code } = req.body;
    const newInv = await pool.query(
      "INSERT INTO invoice ( Inv_Date, Emp_code) VALUES ($1, $2) RETURNING *",
      [inv_date, emp_code]
    );
    res.json(newInv.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//GET all Invoice dates
app.get("/invoice/dates", async (req, res) => {
  try {
    const allInvoices = await pool.query(
      "SELECT inv_date FROM Invoice ORDER BY inv_date DESC"
    );
    res.json(allInvoices.rows);
  } catch (error) {
    console.error(eprodurror.message);
  }
});

//GET an invoice
app.get("/invoice/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await pool.query(
      "SELECT * FROM invoice WHERE Inv_Number = $1",
      [id]
    );
    res.json(invoice.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//Update an invoice
app.put("/invoice/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { inv_date, emp_code } = req.body;

    const updateProduct = await pool.query(
      "UPDATE invoice SET Inv_date = $1, Emp_code = $2 WHERE Inv_Number = $3",
      [inv_date, emp_code, id]
    );

    res.json("Invoice was updated!");
  } catch (error) {
    console.error(error.message);
  }
});

//DELETE an Invoice
app.delete("/invoice/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteInvoice = await pool.query(
      "DELETE FROM Invoice WHERE INV_Number = $1",
      [id]
    );

    res.json("Invoice was deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

//Lines
//Create a line
app.post("/line", async (req, res) => {
  try {
    const { line_quantity, line_unitprice, inv_date, prd_name } = req.body;
    const CreateLine = await pool.query(
      "INSERT INTO line (Line_Quantity, Line_UnitPrice, Inv_Number, Prd_ID) VALUES ($1, $2, (SELECT inv_number FROM Invoice WHERE inv_date = $3 ), (SELECT prd_id FROM Product WHERE prd_name = $4)) RETURNING *",
      [line_quantity, line_unitprice, inv_date, prd_name]
    );
    res.json(CreateLine);
  } catch (err) {
    console.error(err.message);
  }
});

//Get all lines
app.get("/line", async (req, res) => {
  try {
    const GetLines = await pool.query(
      "SELECT *, (SELECT inv_date FROM invoice WHERE inv_number = L.inv_number ) AS date ,(line_quantity*line_unitprice) AS TotalAmount FROM line L Natural Join Product NATURAL JOIN Supplier"
    );
    res.json(GetLines.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Get a line
app.get("/line/:Line_Number", async (req, res) => {
  try {
    const { Line_Number } = req.params;
    const GetLineByNum = await pool.query(
      "SELECT * FROM line WHERE Line_Number = $1",
      [Line_Number]
    );
    res.json(GetLineByNum.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Update a Line
app.put("/line/:Line_Number", async (req, res) => {
  try {
    const { Line_Number } = req.params;
    const { line_quantity, line_unitprice, inv_date, prd_name } = req.body;
    const UpdateLine = await pool.query(
      "UPDATE line SET Line_Quantity=$1, Line_UnitPrice=$2, Inv_Number=$3, Prd_ID=$4 WHERE Line_Number=$5",
      [line_quantity, line_unitprice, inv_date, prd_name, Line_Number]
    );

    res.json("Line modified.");
  } catch (err) {
    console.error(err.message);
  }
});

//Delete a line
app.delete("/line/:Line_Number", async (req, res) => {
  try {
    const { Line_Number } = req.params;
    const DeleteLine = await pool.query(
      "DELETE FROM line WHERE Line_Number = $1",
      [Line_Number]
    );
    res.json("Line deleted");
  } catch (err) {
    console.error(err.message);
  }
});

//Delivery

//Create a delivery
app.post("/delivery", async (req, res) => {
  try {
    const { Dlv_Date, Dlv_delivererPhone, Dlv_Price, Delivered, Inv_Number } =
      req.body;
    const CreateDelivery = await pool.query(
      "INSERT INTO delivery (Dlv_Date, Dlv_delivererPhone, Dlv_Price, Delivered, Inv_Number) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [Dlv_Date, Dlv_delivererPhone, Dlv_Price, Delivered, Inv_Number]
    );

    res.json("Delivery created.");
  } catch (err) {
    console.error(err.message);
  }
});

//Get all deliveries
app.get("/Delivery", async (req, res) => {
  try {
    const GetDeliveries = await pool.query("SELECT * FROM Delivery");
    res.json(GetDeliveries.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Get a delivery
app.get("/Delivery/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const GetDeliveryByID = await pool.query(
      "SELECT * FROM delivery WHERE Dlv_ID = $1",
      [ID]
    );
    res.json(GetDeliveryByID.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Update a delivery
app.put("/Delivery/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const { Dlv_Date, Dlv_delivererPhone, Dlv_Price, Delivered, Inv_Number } =
      req.body;
    const UpdateDelivery = await pool.query(
      "UPDATE Delivery SET Dlv_Date=$1, Dlv_delivererPhone=$2, Dlv_Price=$3, Delivered=$4, Inv_Number=$5 WHERE Dlv_ID=$6",
      [Dlv_Date, Dlv_delivererPhone, Dlv_Price, Delivered, Inv_Number, ID]
    );

    res.json("Delivery modified.");
  } catch (err) {
    console.error(err.message);
  }
});

//Delete a delivery
app.delete("/Delivery/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const DeleteDelivery = await pool.query(
      "DELETE FROM delivery WHERE Dlv_ID = $1",
      [ID]
    );
    res.json("Delivery deleted");
  } catch (err) {
    console.error(err.message);
  }
});

//Storage Location
//get all storage types
app.get("/storagelocation/types", async (req, res) => {
  try {
    const allStorageLocationsAvailable = await pool.query(
      "SELECT DISTINCT stg_type FROM storagelocation   "
    );
    res.json(allStorageLocationsAvailable.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get all storage ids
app.get("/storagelocation/storageAvail", async (req, res) => {
  try {
    const allStorageLocationsAvailable = await pool.query(
      "SELECT DISTINCT STG_ID FROM storagelocation WHERE STG_Full='N' "
    );
    res.json(allStorageLocationsAvailable.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/storagelocation", async (req, res) => {
  try {
    const allStorageLocations = await pool.query(
      "SELECT * FROM storagelocation ORDER BY stg_id"
    );
    res.json(allStorageLocations.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/storagelocation/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const storagelocation = await pool.query(
      "SELECT * FROM storagelocation WHERE STG_ID = $1",
      [ID]
    );
    res.json(storagelocation.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/storagelocation", async (req, res) => {
  try {
    const {
      stg_type,
      stg_roomnumber,
      stg_city,
      stg_street,
      stg_zipcode,
      stg_full,
    } = req.body;

    const newStorageLocation = await pool.query(
      "INSERT INTO storagelocation (STG_type, STG_roomNumber, STG_city, STG_street, STG_zipcode, STG_Full) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
      [stg_type, stg_roomnumber, stg_city, stg_street, stg_zipcode, stg_full]
    );

    res.json(newStorageLocation.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(401);
    res.json({ errorMsg: err.message });
  }
});

app.put("/storagelocation/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const { stg_roomnumber, stg_city, stg_street, stg_zipcode, stg_full } =
      req.body;

    const updateStorageLocation = await pool.query(
      "UPDATE storagelocation SET STG_roomNumber=$1, STG_city=$2, STG_street=$3, STG_zipcode=$4, STG_Full=$5 WHERE STG_ID=$6",
      [stg_roomnumber, stg_city, stg_street, stg_zipcode, stg_full, ID]
    );

    res.json("Update Successful.");
  } catch (err) {
    console.error(err.message);
  }
});
app.delete("/storagelocation/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const deleteStorageLocation = await pool.query(
      "DELETE FROM storagelocation WHERE STG_ID = $1",
      [ID]
    );
    res.json("Storage location deleted");
  } catch (err) {
    console.error(err.message);
  }
});

//Employee Routes
app.post("/Employee", async (req, res) => {
  try {
    const {
      emp_fname,
      emp_lname,
      emp_phonenumber,
      emp_city,
      emp_street,
      emp_zipcode,
      emp_username,
      emp_password,
      manager,
    } = req.body;
    console.log("username", emp_username);
    const NewEmployee = await pool.query(
      "INSERT INTO Employee (Emp_Fname, Emp_Lname, Emp_phonenumber, Emp_city, Emp_street, Emp_zipcode, Emp_username, Emp_password, Manager_code) VALUES($1, $2, $3, $4, $5, $6, $7, $8, (SELECT emp_code from employee where emp_lname=$9)) RETURNING *",
      [
        emp_fname,
        emp_lname,
        emp_phonenumber,
        emp_city,
        emp_street,
        emp_zipcode,
        emp_username,
        emp_password,
        manager,
      ]
    );
    res.json(NewEmployee.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(401);
    res.json({ errorMsg: err.message });
  }
});

app.get("/Employee", async (req, res) => {
  try {
    const AllEmployees = await pool.query(
      "SELECT *,(Select emp_fname FROM Employee WHERE emp_code = E1.manager_code) AS mng_fname ,(Select emp_lname FROM Employee WHERE emp_code = E1.manager_code) AS mng_lname  FROM Employee E1 ORDER BY emp_fname"
    );
    res.json(AllEmployees.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/Employee/:Emp_code", async (req, res) => {
  try {
    const { Emp_code } = req.params;
    const Employees = await pool.query(
      "SELECT * FROM Employee WHERE Emp_Code= $1",
      [Emp_code]
    );
    res.json(Employees.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get employees' managers
app.get("/managers", async (req, res) => {
  try {
    const Employees = await pool.query(
      "SELECT emp_lname, emp_fname FROM Employee WHERE manager_code IS NULL"
    );
    res.json(Employees.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get employees' cities
app.get("/employeesCities", async (req, res) => {
  try {
    const Employees = await pool.query(
      "SELECT DISTINCT emp_city FROM Employee"
    );
    res.json(Employees.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/Employee/:Emp_code", async (req, res) => {
  try {
    const { Emp_code } = req.params;
    const {
      emp_fname,
      emp_lname,
      emp_phonenumber,
      emp_city,
      emp_street,
      emp_zipcode,
      manager,
    } = req.body;
    console.log("manager", manager);
    const updateEmployee = await pool.query(
      "UPDATE Employee SET Emp_Fname=$1, Emp_Lname=$2, Emp_phoneNumber=$3, Emp_city=$4, Emp_street=$5, Emp_zipcode=$6,  Manager_code=(SELECT emp_code from employee where emp_lname = $7) WHERE Emp_code =$8",
      [
        emp_fname,
        emp_lname,
        emp_phonenumber,
        emp_city,
        emp_street,
        emp_zipcode,
        manager,
        Emp_code,
      ]
    );
    res.json("Employee was updated");
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/Employee/:Emp_code", async (req, res) => {
  try {
    const { Emp_code } = req.params;
    const DeleteEmp = await pool.query(
      "DELETE FROM Employee WHERE Emp_code= $1",
      [Emp_code]
    );
    res.json("Employee was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

//Routes supplier
//Get all suplliers (just names)
app.get("/Supplier/names", async (req, res) => {
  try {
    const AllSupliers = await pool.query(
      "SELECT DISTINCT sup_name FROM Supplier"
    );
    res.json(AllSupliers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Create a supplier
app.post("/Supplier", async (req, res) => {
  try {
    const { sup_name, sup_city, sup_street, sup_zipcode, sup_contactperson } =
      req.body;
    const NewSuplier = await pool.query(
      "INSERT INTO Supplier (Sup_name, Sup_city, Sup_street, Sup_zipcode, Sup_contactperson) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [sup_name, sup_city, sup_street, sup_zipcode, sup_contactperson]
    );
    res.json(NewSuplier.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(401);
    res.json({ errorMsg: err.message });
  }
});

app.get("/Supplier", async (req, res) => {
  try {
    const AllSupliers = await pool.query("SELECT * FROM Supplier");
    res.json(AllSupliers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get cities suppliers
app.get("/supplierCities", async (req, res) => {
  try {
    const AllSupliers = await pool.query(
      "SELECT DISTINCT sup_city FROM Supplier"
    );
    res.json(AllSupliers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/Supplier/:Sup_code", async (req, res) => {
  try {
    const { Sup_code } = req.params;
    const Suppliers = await pool.query(
      "SELECT * FROM Supplier WHERE Sup_Code= $1",
      [Sup_code]
    );
    res.json(Suppliers.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/Supplier/:Sup_code", async (req, res) => {
  try {
    const { Sup_code } = req.params;
    const { sup_name, sup_city, sup_street, sup_zipcode, sup_contactperson } =
      req.body;

    const updateSup = await pool.query(
      "UPDATE Supplier SET Sup_name=$1, Sup_city=$2, Sup_street=$3, Sup_zipcode=$4, Sup_contactperson=$5 WHERE Sup_code =$6",
      [sup_name, sup_city, sup_street, sup_zipcode, sup_contactperson, Sup_code]
    );
    res.json("Supplier was updated");
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/Supplier/:Sup_code", async (req, res) => {
  try {
    const { Sup_code } = req.params;
    const DeleteSup = await pool.query(
      "DELETE FROM Supplier WHERE Sup_code= $1",
      [Sup_code]
    );
    res.json("Supplier was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

//Phone
// Create a phone num
app.post("/PhoneNumber", async (req, res) => {
  try {
    const { Sup_code, Sup_phone } = req.body;
    const New_phone = await pool.query(
      "INSERT INTO PhoneNumber (Sup_code, Sup_phonenumber) VALUES($1, $2) RETURNING *",
      [Sup_code, Sup_phone]
    );
    res.json(New_phone.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/PhoneNumber", async (req, res) => {
  try {
    const Allphones = await pool.query("SELECT * FROM PhoneNumber");
    res.json(Allphones.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/PhoneNumber/:Sup_code/:phone", async (req, res) => {
  try {
    const { Sup_code, phone } = req.params;
    const Phones = await pool.query(
      "SELECT * FROM Phonenumber WHERE Sup_Code= $1 AND Sup_phonenumber = $2",
      [Sup_code, phone]
    );
    res.json(Phones.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/PhoneNumber/:Sup_code/:old_phone", async (req, res) => {
  try {
    const { Sup_code, old_phone } = req.params;
    const { Sup_phone } = req.body;
    const updatephone = await pool.query(
      "UPDATE phoneNumber SET Sup_phoneNumber= $1 WHERE Sup_code =$2 and Sup_phoneNumber=$3",
      [Sup_phone, Sup_code, old_phone]
    );
    res.json("Phone was updated");
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/PhoneNumber/:Sup_phone", async (req, res) => {
  try {
    const { Sup_phone } = req.params;
    const Deletephone = await pool.query(
      "DELETE FROM phonenumber WHERE Sup_phoneNumber= $1",
      [Sup_phone]
    );
    res.json("Phone number was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
