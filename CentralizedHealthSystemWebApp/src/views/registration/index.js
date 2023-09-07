import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import React, { useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import image from "../../assets/login.jpg";
import { Alerts } from "../../components/alert";

export default function Registration() {
  const [pharmacy, setPahrmacy] = React.useState(false);
  const [readonlyField, setReadonlyField] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [FirstName, setFirstName] = React.useState(null);
  const [LastName, setLastName] = React.useState(null);
  const [BirthDate, setBirthdate] = React.useState("");
  const [Phone, setPhone] = React.useState(null);
  const [Email, setEmail] = React.useState(null);
  const [BloodGroup, setBloodGroup] = React.useState(null);
  const [Role, setRole] = React.useState("PATIENT");
  const [Address, setAddress] = React.useState(null);
  const [Password, setPassword] = React.useState(null);

  const [isRole, setIsRole] = React.useState(true);
  const [isEmail, setIsEmail] = React.useState(true);
  const [isPassword, setIsPassword] = React.useState(true);
  const [isFirstName, setIsFirstName] = React.useState(true);
  const [isLastName, setIsLastName] = React.useState(true);
  const [isBirthdate, setIsBirthdate] = React.useState(true);
  const [isPhone, setIsPhone] = React.useState(true);
  const [isBloodGroup, setIsBloodGroup] = React.useState(true);
  const [isAddress, setIsAddress] = React.useState(true);
  const [isSelectedFile, setIsSelectedFile] = React.useState(false);
  const [isConfirmPassword, setIsConfirmPassword] = React.useState(true);
  const [isFileUploaded, setIsFileUploaded] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [base64String, setBase64String] = React.useState("");
  const [snackbar, setSnackbar] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("");

  let navigate = useNavigate();

  const handleInputChange = (event) => {
    if (event.target.id === "FirstName") {
      setFirstName(event.target.value);
    }
    if (event.target.id === "LastName") {
      setLastName(event.target.value);
    }
    if (event.target.id === "Phone") {
      setPhone(event.target.value);
    }
    if (event.target.id === "Email") {
      setEmail(event.target.value);
    }
    if (event.target.id === "Address") {
      setAddress(event.target.value);
    }
    if (event.target.id === "Password") {
      setPassword(event.target.value);
    }
    if (event.target.id === "BirthDate") {
      setBirthdate(event.target.value);
    }
  };

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

  const isFileTypeValid = (file) => {
    if (!file) return false;
    const allowedTypes = ["application/pdf"];
    return allowedTypes.includes(file.type);
  };

  const handleFileChange = (e) => {
    if (isFileTypeValid(e.target.files[0])) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
      setBackdrop(false);
      setAlertMessage("Please select a valid PDF file");
      setAlertType("error");
      snackbarOpen();
    }
  };

  const [backdrop, setBackdrop] = React.useState(false);

  const checkPharmacy = (role) => {
    if (role === "PHARMACY") {
      setPahrmacy(true);
    } else {
      setPahrmacy(false);
    }
  };

  const handleFileUpload = () => {
    setBackdrop(true);
    if (selectedFile !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        setBase64String("data:application/pdf;base64," + base64data);
      };
      reader.readAsDataURL(new Blob([selectedFile]));
      setBackdrop(false);
      setIsFileUploaded(true);
      setAlertMessage("File Uploded Successfully!!!.");
      setAlertType("success");
      snackbarOpen();
    } else {
      setBackdrop(false);
      setAlertMessage("Please select a file.");
      setAlertType("error");
      snackbarOpen();
    }
  };

  const signUpApiCall = (registerObj) => {
    axios
      .post("users/", registerObj)
      .then((resp) => {
        if (resp.status === 200) {
          console.log(resp.data);
          setBackdrop(false);
          setAlertMessage(
            "Regisration successful. Please Check your Email id for verfication link"
          );
          setAlertType("success");
          snackbarOpen();
          setData(resp.data);
          setTimeout(() => {
            navigate("/Login");
          }, 5000);
        } else if (
          resp.response.status === 401 ||
          resp.response.status === 409 ||
          resp.response.status === 500 ||
          resp.response.status === 400
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
        setAlertMessage("Registration failed");
        setAlertType("error");
        snackbarOpen();
      });
  };

  const handleSubmit = () => {
    setBackdrop(true);
    if (Role !== "PHARMACY") {
      if (
        Role !== null &&
        Role !== "" &&
        Email !== null &&
        Email !== "" &&
        Email.includes("@") &&
        Email.includes(".") &&
        Password !== null &&
        Password !== "" &&
        FirstName !== null &&
        FirstName !== "" &&
        LastName !== null &&
        LastName !== "" &&
        Phone !== null &&
        Phone !== "" &&
        RegExp(/^\d{10}$/).test(Phone) &&
        Phone.length === 10 &&
        //
        BloodGroup !== null &&
        BloodGroup !== "" &&
        BirthDate !== "" &&
        BirthDate !== null &&
        // ))
        Address !== null &&
        Address !== "" &&
        selectedFile !== null &&
        selectedFile !== ""
      ) {
        let registerObj = {
          name: FirstName + " " + LastName,
          email: Email,
          number: Phone,
          bloodGroup: BloodGroup,
          address: Address,
          password: Password,
          status: "PENDING",
          role: Role,
          dob: BirthDate,
          documentData: base64String,
        };
        //alert("not pharmacy ok");
        signUpApiCall(registerObj);
      } else {
        if (Role === null || Role === "") {
          setIsRole(false);
        }
        if (
          Email === null ||
          Email === "" ||
          !Email.includes("@") ||
          !Email.includes(".")
        ) {
          setIsEmail(false);
        }
        if (Password === null || Password === "") {
          setIsPassword(false);
        }
        if (FirstName === null || FirstName === "") {
          setIsFirstName(false);
        }
        if (LastName === null || LastName === "") {
          setIsLastName(false);
        }
        if (
          Phone === null ||
          Phone === "" ||
          !RegExp(/^\d{10}$/).test(Phone) ||
          Phone.length !== 10
        ) {
          setIsPhone(false);
        }
        if (BloodGroup === null || BloodGroup === "") {
          setIsBloodGroup(false);
        }
        if (Address === null || Address === "") {
          setIsAddress(false);
        }
        if (selectedFile === null || selectedFile === "") {
          setIsSelectedFile(false);
        }
        setBackdrop(false);
        // alert("not pharmacy not ok");
      }
    } else {
      if (
        Role !== null &&
        Role !== "" &&
        Email !== null &&
        Email !== "" &&
        Email.includes("@") &&
        Email.includes(".") &&
        Password !== null &&
        Password !== "" &&
        FirstName !== null &&
        FirstName !== "" &&
        Phone !== null &&
        Phone !== "" &&
        RegExp(/^\d{10}$/).test(Phone) &&
        Phone.length === 10 &&
        Address !== null &&
        Address !== "" &&
        selectedFile !== null &&
        selectedFile !== ""
      ) {
        let registerObj = {
          name:
            FirstName +
            (LastName !== null && LastName !== "" ? " " + LastName : ""),
          email: Email,
          number: Phone,
          bloodGroup: "N/A",
          address: Address,
          password: Password,
          status: "PENDING",
          role: Role,
          //dob: BirthDate,
          documentData: base64String,
        };
        //alert("pharmacy ok");
        // debugger;
        //setBackdrop(false);
        console.log(registerObj);
        signUpApiCall(registerObj);
      } else {
        if (Role === null || Role === "") {
          setIsRole(false);
        }
        if (
          Email === null ||
          Email === "" ||
          !Email.includes("@") ||
          !Email.includes(".")
        ) {
          setIsEmail(false);
        }
        if (Password === null || Password === "") {
          setIsPassword(false);
        }
        if (FirstName === null || FirstName === "") {
          setIsFirstName(false);
        }
        // if (LastName === null || LastName === "") {
        //   setIsLastName(false);
        // }
        if (
          Phone === null ||
          Phone === "" ||
          !RegExp(/^\d{10}$/).test(Phone) ||
          Phone.length !== 10
        ) {
          setIsPhone(false);
        }
        // if (BloodGroup === null || BloodGroup === "") {
        //   setIsBloodGroup(false);
        // }
        if (Address === null || Address === "") {
          setIsAddress(false);
        }
        if (selectedFile === null || selectedFile === "") {
          setIsSelectedFile(false);
        }
        setBackdrop(false);
        //alert("pharmacy not ok");
      }
    }
  };

  let runOnce = true;
  useEffect(() => {
    if (window.location.href.split("?").length > 1 && runOnce) {
      const nameParam = window.location.href.split("?")[1].split("=")[1];
      const emailParam = window.location.href.split("?")[2].split("=")[1];
      if (nameParam && emailParam) {
        const [firstName, lastName] = nameParam.split("%20");
        setFirstName(firstName);
        setLastName(lastName);
        setEmail(emailParam);
        setRole("PATIENT");
        setReadonlyField(true);
      }
      runOnce = false;
    }
  });

  return (
    <>
      <Box>
        <Grid container spacing={0}>
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
            >
              <Typography component="h1" variant="h4">
                Centralized Health System
              </Typography>

              {/* <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                                <LockOutlinedIcon />
                            </Avatar> */}

              <Typography component="h1" variant="h5">
                Sign Up
              </Typography>

              <div
                style={{
                  paddingLeft: 125,
                  paddingRight: 125,
                }}
              >
                <FormControl
                  variant="standard"
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  <TextField
                    select
                    label="Role"
                    id="Role"
                    defaultValue={"PATIENT"}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setIsRole(true);
                      checkPharmacy(e.target.value);
                    }}
                    disabled={readonlyField}
                    error={!isRole}
                    helperText={isRole ? "" : "Select a Role"}
                  >
                    <MenuItem value="">Role</MenuItem>
                    <MenuItem value="PATIENT">Patient</MenuItem>
                    <MenuItem value="DOCTOR">Doctor</MenuItem>
                    <MenuItem value="PHARMACY">Pharmacy</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </TextField>
                </FormControl>
                {!pharmacy && (
                  <>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <FormControl
                        variant="standard"
                        fullWidth
                        style={{ marginTop: "10px" }}
                      >
                        <TextField
                          label="First Name"
                          id="FirstName"
                          type="text"
                          value={FirstName}
                          fullWidth
                          disabled={readonlyField}
                          endAdornment={
                            <InputAdornment position="end"></InputAdornment>
                          }
                          onChange={(e) => {
                            handleInputChange(e);
                            setIsFirstName(true);
                          }}
                          error={!isFirstName}
                          helperText={
                            isFirstName ? "" : "Please Enter your First Name!!"
                          }
                        />
                      </FormControl>

                      <FormControl
                        variant="standard"
                        fullWidth
                        style={{ marginTop: "10px" }}
                      >
                        <TextField
                          id="LastName"
                          label="Last Name"
                          type="text"
                          value={LastName}
                          fullWidth
                          endAdornment={
                            <InputAdornment position="end"></InputAdornment>
                          }
                          onChange={(e) => {
                            handleInputChange(e);
                            setIsLastName(true);
                          }}
                          disabled={readonlyField}
                          error={!isLastName}
                          helperText={
                            isLastName ? "" : "Please Enter your Last Name!!"
                          }
                        />
                      </FormControl>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <FormControl
                        variant="standard"
                        fullWidth
                        style={{ marginTop: "10px" }}
                      >
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            //value={BirthDate === "" ? null : BirthDate}
                            format="YYYY-MM-DD"
                            onChange={(e) => {
                              //alert(moment(e).format("MM-DD-YYYY"));
                              setBirthdate(moment(e).format("YYYY-MM-DD"));
                            }}
                          />
                        </LocalizationProvider>
                        {/* <Input
                      id="date"
                      label="Birth Date"
                      type="date"
                      style={{ borderWidth: "2px" }}
                      value={BirthDate}
                      inputProps={{
                        dateFormat: "MM/dd/yyyy",
                        shrink: true,
                      }}
                      onChange={(e) => {
                        setBirthdate(e.target.value);
                        setIsBirthdate(true);
                      }}
                      error={!isBirthdate}
                      helperText={
                        isBirthdate ? "" : "Please Enter your Birthdate!!"
                      }
                    /> */}
                        {/* <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                >
                                                    <DatePicker
                                                        label="Birth Date"
                                                        value={BirthDate}
                                                        onChange={(e) => {
                                                            setBirthdate(
                                                                e.target.value
                                                            );
                                                            setIsBirthdate(
                                                                true
                                                            );
                                                        }}
                                                        error={!isBirthdate}
                                                        helperText={
                                                            isBirthdate
                                                                ? ""
                                                                : "Please Enter your Birthdate!!"
                                                        }
                                                    />
                                                </LocalizationProvider> */}
                      </FormControl>
                      <FormControl
                        variant="standard"
                        fullWidth
                        style={{ marginTop: "10px" }}
                      >
                        <TextField
                          select
                          id="BloodGroup"
                          label="Blood Group"
                          onChange={(e) => {
                            setBloodGroup(e.target.value);
                            setIsBloodGroup(true);
                          }}
                          error={!isBloodGroup}
                          helperText={
                            isBloodGroup
                              ? ""
                              : "Please Select your BloodGroup!!"
                          }
                        >
                          <MenuItem value="">Select Blood Group</MenuItem>
                          <MenuItem value="A+">A+</MenuItem>
                          <MenuItem value="A-">A-</MenuItem>
                          <MenuItem value="B+">B+</MenuItem>
                          <MenuItem value="B-">B-</MenuItem>
                          <MenuItem value="AB+">AB+</MenuItem>
                          <MenuItem value="AB-">AB-</MenuItem>
                          <MenuItem value="O+">O+</MenuItem>
                          <MenuItem value="O-">O-</MenuItem>
                        </TextField>
                      </FormControl>
                    </Stack>
                  </>
                )}
                {pharmacy && (
                  <>
                    <FormControl
                      variant="standard"
                      fullWidth
                      style={{ marginTop: "10px" }}
                    >
                      <TextField
                        label="Name"
                        id="FirstName"
                        type="text"
                        value={FirstName}
                        fullWidth
                        disabled={readonlyField}
                        endAdornment={
                          <InputAdornment position="end"></InputAdornment>
                        }
                        onChange={(e) => {
                          handleInputChange(e);
                          setIsFirstName(true);
                        }}
                        error={!isFirstName}
                        helperText={isFirstName ? "" : "Please Enter Name!!"}
                      />
                    </FormControl>
                  </>
                )}

                <FormControl
                  variant="standard"
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  <TextField
                    id="Address"
                    label="Address"
                    type="text"
                    fullWidth
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton>
                          <HomeIcon></HomeIcon>
                        </IconButton>
                      </InputAdornment>
                    }
                    onChange={(e) => {
                      setIsAddress(true);
                      handleInputChange(e);
                    }}
                    error={!isAddress}
                    helperText={isAddress ? "" : "Please Enter your Address!!"}
                  />
                </FormControl>

                <FormControl
                  variant="standard"
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  <TextField
                    id="Phone"
                    label="Phone"
                    type="text"
                    fullWidth
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton>
                          <PhoneIcon></PhoneIcon>
                        </IconButton>
                      </InputAdornment>
                    }
                    onChange={(e) => {
                      setIsPhone(true);
                      handleInputChange(e);
                    }}
                    error={!isPhone}
                    helperText={
                      isPhone
                        ? ""
                        : "Please Enter a valid 10 digit Phone Number!!"
                    }
                  />
                </FormControl>

                <FormControl
                  variant="standard"
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  <TextField
                    id="Email"
                    label="Email"
                    type="text"
                    value={Email}
                    fullWidth
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton>
                          <EmailIcon></EmailIcon>
                        </IconButton>
                      </InputAdornment>
                    }
                    onChange={(e) => {
                      setIsEmail(true);
                      handleInputChange(e);
                    }}
                    disabled={readonlyField}
                    error={!isEmail}
                    helperText={isEmail ? "" : "Please Enter a valid Email!!"}
                  />
                </FormControl>

                <FormControl
                  variant="standard"
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  <TextField
                    id="Password"
                    label="Password"
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
                    onChange={(e) => {
                      setIsPassword(true);
                      handleInputChange(e);
                    }}
                    error={!isPassword}
                    helperText={
                      isPassword ? "" : "Please Enter your Password!!"
                    }
                  />
                </FormControl>

                <FormControl
                  variant="standard"
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  <TextField
                    id="ConfirmPassword"
                    label="Confirm Password"
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
                <FormControl
                  variant="standard"
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  <TextField
                    type="file"
                    inputProps={{
                      accept: "application/pdf",
                    }}
                    onChange={(e) => {
                      setIsSelectedFile(true);
                      handleFileChange(e);
                    }}
                    InputProps={{
                      endAdornment: isSelectedFile && (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              handleFileUpload();
                            }}
                          >
                            <CloudUploadIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* <Button
                                            variant="outlined"
                                            component="label"
                                            endIcon={<CloudUploadIcon />}
                                            onClick={() => {
                                                handleFileUpload();
                                            }}
                                            style={{
                                                marginTop: 10,
                                                alignSelf: "center",
                                            }}
                                        >
                                            Upload
                                        </Button> */}
                </FormControl>

                <FormControl
                  variant="standard"
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    color="primary"
                    onClick={() => handleSubmit()}
                    fullWidth
                    variant="contained"
                    style={{
                      alignSelf: "center",
                    }}
                    disabled={!isFileUploaded}
                  >
                    Sign Up
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
