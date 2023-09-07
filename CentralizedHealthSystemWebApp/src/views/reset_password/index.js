import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
    Avatar,
    Backdrop,
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import image from "../../assets/login.jpg";
import { Alerts } from "../../components/alert";

export default function ForgotPassword() {
    const [Password, setPassword] = React.useState(null);
    const [confirmPassword, setConfirmPassword] = React.useState(null);
    const [showPassword, setShowPassword] = React.useState(false);
    const [isPassword, setIsPassword] = React.useState(true);
    const [isConfirmPassword, setIsConfirmPassword] = React.useState(true);
    const [token, setToken] = React.useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [alertMessage, setAlertMessage] = React.useState("");
    const [alertType, setAlertType] = React.useState("");
    const [snackbar, setSnackbar] = React.useState(false);
    const [backdrop, setBackdrop] = React.useState(false);

    const alertObj = {
        alertMessage: alertMessage,
        alertType: alertType,
    };
    const snackbarOpen = () => {
        setSnackbar(true);
    };
    const snackbarClose = () => {
        setSnackbar(false);
    };

    const handleSubmit = () => {
        setBackdrop(true);
        setBackdrop(true);
        if (
            Password !== null &&
            Password !== "" &&
            Password === confirmPassword
        ) {
            let resetPasswordObj = {
                password: Password,
                token: token,
            };

            axios
                .post("users/reset-password", resetPasswordObj)
                .then((resp) => {
                    if (resp.status === 204) {
                        console.log(resp.data);
                        setBackdrop(false);
                        setAlertMessage("Password reset successful!!!");
                        setAlertType("success");
                        snackbarOpen();
                        setTimeout(() => {
                            navigate("/Login");
                        }, 2000);
                    } else if (
                        resp.response.status === 401 ||
                        resp.response.status === 404 ||
                        resp.response.status === 500
                    ) {
                        setBackdrop(false);
                        setAlertMessage(resp.response.data.message);
                        setAlertType("error");
                        snackbarOpen();
                    }
                })
                .catch((error) => {
                    console.log(error.config);
                    console.log(error.message);
                    console.log(error.response);
                    setBackdrop(false);
                    setAlertMessage(
                        "Password reset unsuccessful!!! please try again"
                    );
                    setAlertType("error");
                    snackbarOpen();
                });
        } else {
            if (Password === null || Password === "") {
                setIsPassword(false);
            }
            if (Password !== confirmPassword) {
                setIsConfirmPassword(false);
            }
            setBackdrop(false);
        }
    };

    const handleInputChange = (event) => {
        if (event.target.id === "Password") {
            setPassword(event.target.value);
        }
        if (event.target.id === "ConfirmPassword") {
            setConfirmPassword(event.target.value);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setToken(searchParams.get("token"));
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
                                Reset Password
                            </Typography>
                            <div
                                style={{ paddingLeft: 125, paddingRight: 125 }}
                            >
                                <FormControl
                                    variant="standard"
                                    fullWidth
                                    style={{ marginTop: 10 }}
                                >
                                    <TextField
                                        id="Password"
                                        label="Password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => {
                                                            setShowPassword(
                                                                !showPassword
                                                            );
                                                        }}
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        onChange={(e) => {
                                            setIsPassword(true);
                                            handleInputChange(e);
                                        }}
                                        error={!isPassword}
                                        helperText={
                                            isPassword
                                                ? ""
                                                : "Please Enter your Password!!"
                                        }
                                    />
                                </FormControl>

                                <FormControl
                                    variant="standard"
                                    fullWidth
                                    style={{ marginTop: 10 }}
                                >
                                    <TextField
                                        id="ConfirmPassword"
                                        label="Confirm Password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => {
                                                            setShowPassword(
                                                                !showPassword
                                                            );
                                                        }}
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        onChange={(e) => {
                                            setIsConfirmPassword(true);
                                            handleInputChange(e);
                                        }}
                                        error={!isConfirmPassword}
                                        helperText={
                                            isConfirmPassword
                                                ? ""
                                                : "Please Enter Password same as above!!"
                                        }
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        style={{
                                            marginTop: 10,
                                            alignSelf: "center",
                                        }}
                                        onClick={() => {
                                            handleSubmit();
                                        }}
                                    >
                                        {"Reset Password"}
                                    </Button>
                                </FormControl>
                                <Typography style={{ marginTop: 10 }}>
                                    Already have an account?{" "}
                                    <Link
                                        onClick={() => {
                                            window.location.href = "/login";
                                        }}
                                    >
                                        Login
                                    </Link>
                                </Typography>
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
