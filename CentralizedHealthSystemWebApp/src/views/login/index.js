import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Alerts } from "../../components/alert";

import image from "../../assets/login.jpg";

import { storeJwtToken } from "../../action/TokenAction";
import { storeUserDetails } from "../../action/UserAction";
export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isPassword, setIsPassword] = React.useState(true);
  const [isEmail, setIsEmail] = React.useState(true);
  const [rememberMe, setRememberMe] = React.useState(false);

  let navigate = useNavigate();
  const location = useLocation();
  //Alert
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const alertObj = {
    alertMessage: alertMessage,
    alertType: alertType,
  };
  const [snackbar, setSnackbar] = React.useState(false);
  const snackbarOpen = () => {
    setSnackbar(true);
  };
  const snackbarClose = () => {
    setSnackbar(false);
  };

  const [backdrop, setBackdrop] = React.useState(false);
  const [data, setData] = React.useState(null);

  const dispatch = useDispatch();
  const decodeJwt = (token) => {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  const login = () => {
    setBackdrop(true);
    if (
      email !== null &&
      email !== "" &&
      password !== null &&
      password !== ""
    ) {
      let loginObj = {
        email: email,
        password: password,
        rememberMe: rememberMe,
      };
      axios
        .post("users/login", loginObj)
        .then((resp) => {
          if (resp.status === 200) {
            console.log(resp.data);
            setBackdrop(false);
            setAlertMessage("Login successful");
            setAlertType("success");
            snackbarOpen();
            let jwtTokenObj = decodeJwt(resp.data.jwtToken);
            console.log(jwtTokenObj);
            let role = jwtTokenObj.role;
            let path = "";
            if (role === "ADMIN") path = "/Requests";
            else if (role === "DOCTOR") path = "/Patients";
            else if (role === "PHARMACY") path = "/SearchUsers";
            else if (role === "PATIENT") path = "/Profile";
            setData(resp.data);

            dispatch(
              storeUserDetails({
                ...resp.data.userDetails,
                role: role,
              })
            );
            dispatch(storeJwtToken(resp.data.jwtToken));
            if (rememberMe) {
              console.log("remembe me");
              localStorage.setItem("jwtToken", resp.data.jwtToken);
              localStorage.setItem(
                "oUser",
                JSON.stringify(resp.data.userDetails)
              );
            }

            setTimeout(() => {
              console.log(path);
              navigate(path);
            }, 1000);
          } else if (
            resp.response.status === 404 ||
            resp.response.status === 401 ||
            resp.response.status === 403 ||
            resp.response.status === 400
          ) {
            setBackdrop(false);
            setAlertMessage(resp.response.data.message);
            setAlertType("error");
            snackbarOpen();
          }
        })
        .catch((error) => {
          console.log(error);
          console.log(error.config);
          console.log(error.message);
          console.log(error.response);
          setBackdrop(false);
          setAlertMessage(error.message);
          setAlertType("error");
          snackbarOpen();
        });
    } else {
      if (email == null || email === "") {
        setIsEmail(false);
      }
      if (password == null || password === "") {
        setIsPassword(false);
      }
      setBackdrop(false);
    }
  };

  React.useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    const oUser = localStorage.getItem("oUser");
    if (jwtToken !== null && oUser !== null) {
      dispatch(storeUserDetails(JSON.parse(oUser)));
      dispatch(storeJwtToken(jwtToken));
      navigate("/Requests");
    }
    if (location.state !== null) {
      setAlertMessage(location.state.message);
      setAlertType(location.state.messageType);
      snackbarOpen();
    }
  }, []);

  return (
    <>
      <Box>
        <Grid container spacing={0} sx={{ height: "100vh" }}>
          <Grid
            item
            md={7}
            display={{ xs: "none", md: "block" }}
            sx={{
              backgroundImage: `url(${image})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></Grid>

          <Grid item xs={12} md={5}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              style={{ marginTop: 100 }}
            >
              <Typography component="h1" variant="h4">
                Centralized Health System
              </Typography>

              <Avatar
                sx={{ m: 1, bgcolor: "primary.main" }}
                style={{ marginTop: 100 }}
              >
                <LockOutlinedIcon />
              </Avatar>

              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <div style={{ paddingLeft: 125, paddingRight: 125 }}>
                <FormControl
                  variant="standard"
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  <TextField
                    id="email"
                    name="email"
                    type="text"
                    label="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsEmail(true);
                    }}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <MedicalInformationIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!isEmail}
                    helperText={isEmail ? "" : "Enter an email"}
                  />
                </FormControl>
                <FormControl
                  variant="standard"
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  <TextField
                    id="password"
                    name="password"
                    value={password}
                    label="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setIsPassword(true);
                    }}
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              setShowPassword(!showPassword);
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!isPassword}
                    helperText={isPassword ? "" : "Enter your password"}
                  />
                  <Typography style={{ marginTop: 10 }}>
                    <Link
                      onClick={() => {
                        window.location.href = "/ForgotPassword";
                      }}
                    >
                      Forgot Password
                    </Link>
                  </Typography>
                  {/* <Link
                                        onClick={() => {
                                            window.location.href =
                                                "/ForgotPassword";
                                        }}
                                    >
                                        Forgot Password
                                    </Link> */}
                </FormControl>

                <div style={{ textAlign: "left" }}>
                  <Checkbox
                    value={rememberMe}
                    onClick={() => {
                      setRememberMe(!rememberMe);
                    }}
                  />
                  Remember me
                </div>

                <FormControl fullWidth>
                  <Button
                    color="primary"
                    onClick={() => {
                      login();
                    }}
                    fullWidth
                    variant="contained"
                    style={{
                      marginTop: 20,
                      alignSelf: "center",
                    }}
                  >
                    Login
                  </Button>
                </FormControl>
                <Typography style={{ marginTop: 10 }}>
                  Don't have an account?{" "}
                  <Link
                    onClick={() => {
                      window.location.href = "/Registration";
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
                {/* <FormControl
                                    fullWidth
                                    style={{ display: "inline", marginTop: 10 }}
                                >
                                    Don't have an account?{" "}
                                    <Link
                                        onClick={() => {
                                            window.location.href =
                                                "/Registration";
                                        }}
                                    >
                                        Sign Up
                                    </Link>
                                </FormControl> */}
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {snackbar && (
        <Alerts
          alertObj={alertObj}
          snackbar={snackbar}
          snackbarClose={snackbarClose}
        />
      )}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
