import { Box, Link, Typography } from "@mui/material";
import React from "react";

export default function error401() {
  return (
    <>
      {/* <Box>
                <h1>401 - Unauthorized Access</h1>
            </Box> */}
      {/* <Box>
        <img src={require("../../../assets/images/404.gif")} alt="404" />
        <Typography variant="h5">
          Couldn't find the page you were looking for! Go back to{" "}
          <Link
            onClick={() => {
              window.location.href = "/Login";
            }}
            style={{ cursor: "pointer" }}
          >
            Login Page
          </Link>
        </Typography>
      </Box> */}
      <Box>
        <img src={require("../../../assets/images/403.gif")} alt="404" />
        <Typography variant="h5">
          Your session might have expired, Please login again{" "}
          <Link
            onClick={() => {
              window.location.href = "/Login";
            }}
            style={{ cursor: "pointer" }}
          >
            Login Page
          </Link>
        </Typography>
      </Box>
    </>
  );
}
