"use client";
import { createStyles } from "antd-style";

export const useStyles = createStyles(({token}) => ({
    container: {
        display: "flex",
        backgroundImage: "url('/images/auth-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem",
        margin: "0",
        justifyContent: "space-around",   
        alignItems: "center",
    },
    button: {
        width: "100%", 
    },
    link: {
        color: token.colorPrimary,
    }
}))