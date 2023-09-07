import { CheckCircleRounded, HighlightOffRounded } from "@mui/icons-material/";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Typography,
} from "@mui/material";
import axios from "axios";
import { React, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import image from "../../assets/login.jpg";

export default function EmailVerification() {
  const [backdrop, setBackdrop] = useState(true);
  const [token, setToken] = useState("");
  const location = useLocation();

  const [Message, setMessage] = useState("");
  const [Type, setType] = useState("");

  //   let verifyObj = {
  //     verificationCode: token,
  //   };

  const verfication = (verificationCode) => {
    axios
      .put("users/verify", { verificationCode })
      .then((resp) => {
        console.log(resp);
        if (resp.status === 204) {
          setBackdrop(false);
          setMessage("Verification SuccessFull !!");
          setType("success");
        } else if (
          resp.response.status === 401 ||
          resp.response.status === 409 ||
          resp.response.status === 500 ||
          resp.response.status === 400
        ) {
          setBackdrop(false);
          setMessage(resp.response.data.message);
          setType("error");
        }
      })
      .catch((error) => {
        console.log(error);
        console.log(error.config);
        console.log(error.message);
        console.log(error.response);
        setBackdrop(false);
        setMessage("Link Expired Please Regiseter Again");
        setType("error");
      });
  };
  let runOnce = true;
  useEffect(() => {
    if (runOnce) {
      const searchParams = new URLSearchParams(location.search);
      //alert(searchParams.get("token"));
      setToken(searchParams.get("token"));
      verfication(searchParams.get("token"));
      runOnce = false;
    }
  }, []);

  return (
    <>
      <Box
        display={{ xs: "none", md: "block" }}
        sx={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!backdrop && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
            }}
          >
            <Card style={{ maxWidth: 400 }}>
              <CardContent>
                {Type === "success" && (
                  <CheckCircleRounded color={Type} fontSize="large" />
                )}

                {Type === "error" && (
                  <HighlightOffRounded color={Type} fontSize="large" />
                )}

                <Typography variant="h5" component="h2">
                  {Message}
                </Typography>

                {Type === "success" && (
                  <FormControl
                    variant="standard"
                    fullWidth
                    style={{ marginTop: "10px" }}
                  >
                    <Button
                      color="primary"
                      onClick={() => {
                        window.location.href = "/Login";
                      }}
                      fullWidth
                      variant="contained"
                      style={{
                        marginTop: 10,
                        alignSelf: "center",
                      }}
                    >
                      Login
                    </Button>
                  </FormControl>
                  // <FormControl fullWidth style={{ display: "inline", marginTop: 10 }}>
                  //     <Link onClick={() => { window.location.href = "/login" }}>login</Link>
                  // </FormControl>
                )}

                {Type === "error" && (
                  <FormControl
                    variant="standard"
                    fullWidth
                    style={{ marginTop: "10px" }}
                  >
                    <Button
                      color="primary"
                      onClick={() => {
                        window.location.href = "/Registration";
                      }}
                      fullWidth
                      variant="contained"
                      style={{
                        marginTop: 10,
                        alignSelf: "center",
                      }}
                    >
                      Sign Up
                    </Button>
                  </FormControl>
                  // <FormControl
                  //     fullWidth
                  //     style={{
                  //         display: "inline",
                  //         marginTop: 10,
                  //     }}
                  // >
                  //     <Link
                  //         onClick={() => {
                  //             window.location.href =
                  //                 "/Registration";
                  //         }}
                  //     >
                  //         Registration
                  //     </Link>
                  // </FormControl>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </Box>
      {backdrop && (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={backdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
}
