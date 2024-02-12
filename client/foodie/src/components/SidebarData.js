import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
 
  {
    title: "Products",
    path: "/products",
    icon: <FaIcons.FaCartPlus color="white" />,
    cName: "nav-text",
  },
  {
    title: "Suppliers",
    path: "/suppliers",
    icon: <IoIcons.IoMdPeople color="white" />,
    cName: "nav-text",
  },
  {
    title: "Employees",
    path: "/employees",
    icon: <IoIcons.IoIosPeople color="white" />,
    cName: "nav-text",
  },
  {
    title: "Storage",
    path: "/storage",
    icon: <FaIcons.FaStore color="white"/>,
    cName: "nav-text",
  },
  {
    title: "Invoices",
    path: "/invoices",
    icon: <FaIcons.FaMoneyBillWave color="white" />,
    cName: "nav-text",
  },
];
