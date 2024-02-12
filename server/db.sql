	/* TO TEST
	Add a supplier that doesnt exist in the supplier table
	*/
	DROP TABLE IF EXISTS Line;
	DROP TABLE IF EXISTS Product;
	DROP TABLE IF EXISTS Delivery;
	DROP TABLE IF EXISTS Invoice;
	DROP TABLE IF EXISTS Fridge;
	DROP TABLE IF EXISTS Shelf;
	DROP TABLE IF EXISTS StorageLocation;
	DROP TABLE IF EXISTS PhoneNumber;
	DROP TABLE IF EXISTS Supplier;
	DROP TABLE IF EXISTS Employee;


	CREATE TABLE Employee(
		EMP_code SERIAL PRIMARY KEY,
		EMP_Fname varchar(50) NOT NULL,
		EMP_Lname varchar(50) NOT NULL,
		EMP_phoneNumber char(10) NOT NULL,
		EMP_city varchar(20) NOT NULL,
		EMP_street varchar(20),
		EMP_zipcode char(5),
		EMP_username varchar(20) NOT NULL,
		EMP_password varchar(20) NOT NULL,
		manager_code int, 
		CONSTRAINT manages FOREIGN KEY (manager_code) REFERENCES Employee(EMP_code)
			ON UPDATE CASCADE ON DELETE CASCADE
	);

	CREATE TABLE Supplier (
		SUP_code SERIAL PRIMARY KEY,
		SUP_name varchar(50) NOT NULL,
		SUP_city varchar(20) NOT NULL,
		SUP_street varchar(20),
		SUP_zipcode char(5),
		SUP_contactPerson varchar(50) NOT NULL
	);

	CREATE TABLE PhoneNumber (
		SUP_code int,
		SUP_phoneNumber char(10) NOT NULL,
		PRIMARY KEY(SUP_code, SUP_phoneNumber),
		CONSTRAINT contains FOREIGN KEY (SUP_code) REFERENCES Supplier(SUP_code)
			ON UPDATE CASCADE ON DELETE CASCADE
	);


	CREATE TABLE StorageLocation (
		STG_ID SERIAL PRIMARY KEY UNIQUE,
		STG_type varchar(10) NOT NULL,
		STG_roomNumber int NOT NULL,
		STG_city varchar(20) NOT NULL,
		STG_street varchar(20),
		STG_zipcode char(5),
		STG_Full char(1) NOT NULL,
		CONSTRAINT cktype CHECK (STG_type in ('Shelf', 'Fridge')),
	CONSTRAINT ckstatus CHECK (STG_Full in ('Y', 'N'))
	);

	CREATE TABLE Invoice (
		INV_number SERIAL PRIMARY KEY,
		INV_date date NOT NULL,
		EMP_Code int,
		CONSTRAINT generatedBy FOREIGN KEY (EMP_Code) REFERENCES Employee(EMP_code)
			ON UPDATE CASCADE ON DELETE CASCADE
	);

	CREATE TABLE Product (
		PRD_ID SERIAL PRIMARY KEY,
		PRD_Name varchar(50) NOT NULL,
		PRD_quantity decimal(8,2) NOT NULL,
		PRD_minQuantity decimal(8,2) NOT NULL,
		PRD_unit varchar(2) NOT NULL,
		PRD_category varchar(50) NOT NULL,
		SUP_code int,
		STG_ID int, 
		CONSTRAINT suppliedBy FOREIGN KEY (SUP_code) REFERENCES Supplier(SUP_code)
			ON UPDATE CASCADE ON DELETE CASCADE,
		CONSTRAINT storedIn FOREIGN KEY (STG_ID) REFERENCES StorageLocation(STG_ID)
			ON UPDATE CASCADE ON DELETE CASCADE
	);

	CREATE TABLE Delivery(
		DLV_ID SERIAL PRIMARY KEY,
		DLV_date date NOT NULL,
		DLV_delivererPhone char(10) NOT NULL,
		DLV_price decimal(8,2) NOT NULL,
		Delivered char(1),
		INV_number int,
		CONSTRAINT ckStatus_delivered CHECK (delivered in ('Y', 'N')),
		CONSTRAINT belongsTo FOREIGN KEY (INV_number) REFERENCES Invoice(INV_number)
			ON UPDATE CASCADE ON DELETE CASCADE
	);

	CREATE TABLE Line(
		Line_Number SERIAL PRIMARY KEY,
		Line_Quantity smallint NOT NULL DEFAULT 1,
		Line_unitPrice decimal(8,2) NOT NULL,
		INV_number int,
		PRD_ID int,
		CONSTRAINT foundInInv FOREIGN KEY (INV_number) REFERENCES Invoice(INV_number)
			ON UPDATE CASCADE ON DELETE CASCADE,
		CONSTRAINT hasProduct FOREIGN KEY (PRD_ID) REFERENCES Product(PRD_ID)
			ON UPDATE CASCADE ON DELETE CASCADE
	);

	
/*We added  new reorder column to the Product Table*/
alter table product
ADD COLUMN Reorder char(1);

/*Triggers*/
CREATE FUNCTION update_prodN() RETURNS TRIGGER
AS $$
BEGIN
if NEW.prd_quantity >= NEW.prd_minquantity then
	NEW.reorder = 'N';
END IF;
RETURN NEW;
END;
$$
LANGUAGE plpgsql;
CREATE TRIGGER trReorderN BEFORE UPDATE ON
Product FOR EACH ROW
EXECUTE FUNCTION update_prodN();

CREATE FUNCTION update_prodY() RETURNS TRIGGER
AS $$
BEGIN
if NEW.prd_quantity < NEW.prd_minquantity then
	NEW.reorder = 'Y';
END IF;
RETURN NEW;
END;
$$
LANGUAGE plpgsql;
CREATE TRIGGER trReorder BEFORE UPDATE ON
Product FOR EACH ROW
EXECUTE FUNCTION update_prodY();

CREATE view Emp_view As Select emp_code, Emp_Fname, Emp_Lname, Emp_phonenumber, Emp_city, Emp_Street, Emp_zipcode, Manager_code
FROM Employee;