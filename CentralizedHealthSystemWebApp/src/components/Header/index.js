import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";

import GroupIcon from "@mui/icons-material/Group";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import PersonIcon from "@mui/icons-material/Person";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { removeJwtToken } from "../../action/TokenAction";
import { removeUserDetails } from "../../action/UserAction";

import logo from "../../assets/images/chs_logo.png";

const drawerWidth = 240;

export default function Header() {
  let location = useLocation();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let loc = location.pathname.toLowerCase();
  const activeLink = { backgroundColor: "#1976d2", color: "#fff" };
  const pageTitle = {
    requests: "Requests",
    users: "Users",
    patients: "My Patients",
    addprescription: "Add New Prescription",
    patient: "Patient Details",
    searchusers: "Search User",
    user: "User Details",
    profile: "My Profile",
    myprescriptions: "My Prescriptions",
  };

  const pages = {
    ADMIN: ["/requests", "/users"],
    DOCTOR: ["/patients", "/addprescription", "/patient"],
    PHARMACY: ["/searchusers", "/user"],
    PATIENT: ["/profile", "/myprescriptions"],
  };
  const userObj = useSelector((state) => state.UserReducer.oUser);

  const logout = (path, message, messageType) => {
    dispatch(removeJwtToken());
    dispatch(removeUserDetails());
    localStorage.clear();
    navigate(path, { state: { message: message, messageType: messageType } });
  };

  if (userObj === null) {
    window.location.href = "/Login";
  } else {
    console.log(">>>>" + loc);
    if (loc.includes("/patient/") || loc.includes("/user/"))
      loc = "/" + loc.split("/")[1];
    console.log(loc);
    console.log(pages[userObj.role]);
    if (!pages[userObj.role].includes(loc)) {
      logout("/401", "Unauthorized Access", "error");
    }
  }
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {pageTitle[loc.split("/")[1].toLowerCase()]}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <img src={logo} alt="Logo" height={40} width={180} />
        </Toolbar>
        <Divider />
        <List>
          {userObj.role === "ADMIN" && (
            <>
              <Link
                to="/Requests"
                style={{ textDecoration: "none", color: "#000" }}
              >
                <ListItem
                  key={1}
                  disablePadding
                  style={loc === "/requests" ? activeLink : {}}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <InboxIcon
                        style={loc === "/requests" ? { color: "#fff" } : {}}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Requests" />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link
                to="/Users"
                style={{ textDecoration: "none", color: "#000" }}
              >
                <ListItem
                  key={2}
                  disablePadding
                  style={loc === "/users" ? activeLink : {}}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <GroupIcon
                        style={loc === "/users" ? { color: "#fff" } : {}}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Users" />
                  </ListItemButton>
                </ListItem>
              </Link>
            </>
          )}
          {userObj.role === "DOCTOR" && (
            <>
              <Link
                to="/Patients"
                style={{ textDecoration: "none", color: "#000" }}
              >
                <ListItem
                  key={1}
                  disablePadding
                  style={loc === "/patients" ? activeLink : {}}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <GroupIcon
                        style={loc === "/patients" ? { color: "#fff" } : {}}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Patients" />
                  </ListItemButton>
                </ListItem>
              </Link>
            </>
          )}
          {userObj.role === "PHARMACY" && (
            <>
              <Link
                to="/SearchUsers"
                style={{ textDecoration: "none", color: "#000" }}
              >
                <ListItem key={1} disablePadding style={activeLink}>
                  <ListItemButton>
                    <ListItemIcon>
                      <PersonSearchIcon
                        style={loc === "/searchusers" ? { color: "#fff" } : {}}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Search Users" />
                  </ListItemButton>
                </ListItem>
              </Link>
            </>
          )}
          {userObj.role === "PATIENT" && (
            <>
              <Link
                to="/Profile"
                style={{ textDecoration: "none", color: "#000" }}
              >
                <ListItem
                  key={1}
                  disablePadding
                  style={loc === "/profile" ? activeLink : {}}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <PersonIcon
                        style={loc === "/profile" ? { color: "#fff" } : {}}
                      />
                    </ListItemIcon>
                    <ListItemText primary="My Profile" />
                  </ListItemButton>
                </ListItem>
              </Link>
              <>
                <Link
                  to="/MyPrescriptions"
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <ListItem
                    key={1}
                    disablePadding
                    style={loc === "/myprescriptions" ? activeLink : {}}
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <ListAltIcon
                          style={
                            loc === "/myprescriptions" ? { color: "#fff" } : {}
                          }
                        />
                      </ListItemIcon>
                      <ListItemText primary="My Prescriptions" />
                    </ListItemButton>
                  </ListItem>
                </Link>
              </>
            </>
          )}
          <Divider />
          <ListItem key={5} disablePadding>
            <ListItemButton
              onClick={() => {
                logout("/Login", "User logged out!", "success");
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        <>
          <Outlet />
        </>
      </Box>
    </Box>
  );
}
