import { Box, Link, Typography } from "@mui/material";
import React from "react";

export default function error404(){
    return(
        <>
            <Box>
            <img src={require('../../../assets/images/404.gif')} alt="404" />
            <Typography variant="h5">Couldn't find the page you were looking for! Go back to <Link onClick={()=>{window.location.href = "/Login"}} style={{cursor: 'pointer'}}>Login Page</Link></Typography>
            </Box>
        </>
    );
}