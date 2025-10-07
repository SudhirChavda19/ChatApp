import React, { useEffect, useState } from "react";
import { Snackbar, SnackbarContent } from "@mui/material";

function SnackBar({
  setHorizontal,
  setVertical,
  setOpen,
  setMessage,
  setSeverity,
  handleSnackBar,
}) {
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;

  useEffect(() => {
    setState({
      open: setOpen,
      vertical: setVertical,
      horizontal: setHorizontal,
      message: setMessage,
      severity: setSeverity,
    });
  }, [setOpen]);

  useEffect(() => {
    if (!open) {
      handleSnackBar(false);
    }
  }, [open]);

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={30000}
      onClose={handleClose}
      severity={severity}
      sx={{ div: { minWidth: "fit-content", padding: "8px 16px" } }}
      key={vertical + horizontal}
    >
      <SnackbarContent
        // padding={"8px 16px"}
        style={{
          backgroundColor: "#ffffffff",
          color: severity === "error" ? "#D32F2F" : "black",
          border: severity === "error" ? "1px solid #D32F2F" : "inherite",
          padding: "0px",
        }} // Apply custom background color
        message={message}
      />
    </Snackbar>
  );
}

export default SnackBar;
