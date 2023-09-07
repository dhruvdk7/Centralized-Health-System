import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Avatar, Backdrop, Box, Button, CircularProgress, FormControl, Grid, Link, TextField, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import image from "../../assets/login.jpg";
import { Alerts } from "../../components/alert";

export default function ForgotPassword() {

    let navigate = useNavigate();

    const [email, setEmail] = React.useState("");
    const [isEmail, setIsEmail] = React.useState(true);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [alertType, setAlertType] = React.useState("");
    const [snackbar, setSnackbar] = React.useState(false);
    const [backdrop, setBackdrop] = React.useState(false);
    const [emailSent, setEmailSent] = React.useState(false);

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

    const handleSubmit = (event) => {
        setBackdrop(true);
        setEmailSent(true);
        if (email !== null && email !== "") {
            let reqObj = {
                email: email,
            };
            axios
                .post("users/forgot-password", reqObj)
                .then((resp) => {
                    if (resp.status === 204) {
                        console.log(resp.data);
                        setBackdrop(false);
                        setAlertMessage('An email has been sent to ' + email + ' with a password reset link');
                        setAlertType('success');
                        snackbarOpen();
                        setTimeout(() => {
                            navigate("/Login");
                        }, 5000);
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
                    alert(error.message);
                    console.log(error.config);
                    console.log(error.message);
                    console.log(error.response);
                    setBackdrop(false);
                    setAlertMessage(error.message);
                    setAlertType("error");
                    snackbarOpen();
                });
        } else {
            if (email === null || email === "") {
                setIsEmail(false);
            }
            setBackdrop(false);
        }

    };

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
                            <Typography component="h1" variant="h5">Forgot Password</Typography>
                            <div style={{ paddingLeft: 125, paddingRight: 125 }}>
                                <FormControl variant="standard" fullWidth style={{ marginTop: "10px" }}>
                                    <TextField
                                        id="email"
                                        name="email"
                                        type="email"
                                        label="Email"
                                        value={email}
                                        onChange={(e) => {
                                            setIsEmail(true)
                                            setEmail(e.target.value);
                                        }}
                                        fullWidth
                                        error={!isEmail}
                                        helperText={isEmail ? "" : "Please Enter your Email!!"}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 20, alignSelf: "center" }} onClick={() => { handleSubmit() }}>
                                        {'Send Verification Code'}
                                    </Button>
                                </FormControl>
                                <Typography style={{ marginTop: 10 }}>
                                    Already have an account? <Link onClick={() => { window.location.href = "/login"; }}>Login</Link>
                                </Typography>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            {
                snackbar && <Alerts
                    alertObj={alertObj}
                    snackbar={snackbar}
                    snackbarClose={snackbarClose}
                />
            }
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
