import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  Typography,
  Card,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { createUser } from "../../services/userDao";
import { useDBContext } from "../../context/DBContext";
import { useAuthContext } from "../../context/AuthContext";
import { emailValidate, passwordValidate } from "../../utils/formValidation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function EmailPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [emailOnBlur, setEmailOnBlur] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [passwordOnBlur, setPasswordOnBlur] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [path, setPath] = useState("")

  const { setAuthUser } = useAuthContext();
  const location = useLocation();

  useEffect(() => {
    console.log("Location: ", location);
    setPath(location.pathname)
  }, [location])

  const db = useDBContext();
  // const socket = useSocketContext();
  const uniqueId = uuidv4();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailError && passwordError) return;
    const data = {
      email,
      password,
    };

    console.log("data :", data);
    (async () => {
      // await signIn(data)
    })();
    // localStorage.setItem("userName", userName);
    // localStorage.setItem("userId", uniqueId);
    // setAuthUser({userId: uniqueId, userName});
    // const userData = {
    //   id: uniqueId,
    //   name: userName,
    //   createdAt: Date.now()
    // }
    // createUser(userData, db);
    // navigate("/chat", { replace: true });
  };

  const handleEmailInput = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailOnBlur) setEmailError(emailValidate(value));
  };

  const handlePasswordInput = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordOnBlur) setPasswordError(passwordValidate(value));
  };

  return (
    <Card sx={{ height: "84vh", display: "flex", flexDirection: "column" }}>
      <form onSubmit={handleSubmit} style={{ margin: "auto auto" }}>
        <Typography variant="h4" component="div" gutterBottom>
          {path === "/sign-in" ? "Sign In" : "Reset Password"}
        </Typography>
        <Box>
          <TextField
            type="text"
            value={email}
            onChange={handleEmailInput}
            onBlur={() => {
              setEmailOnBlur(true);
              setEmailError(emailValidate(email));
            }}
            name="email"
            id="email"
            label="Email"
            placeholder="mark10@gmail.com"
            variant="outlined"
            required
            sx={{ display: "flex" }}
            error={!!emailError}
          ></TextField>
          <Typography error={emailError} color="error" variant="caption">
            {emailError ? <span>{emailError}</span> : ""}
          </Typography>
        </Box>
        <Box>
          <TextField
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordInput}
            onBlur={() => {
              setPasswordOnBlur(true);
              setPasswordError(passwordValidate(password));
            }}
            name="password"
            id="password"
            label="Password"
            variant="outlined"
            required
            sx={{ display: "flex", marginTop: "20px" }}
            error={!!passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          ></TextField>
          <Typography error={passwordError} color="error" variant="caption">
            {passwordError ? <span>{passwordError}</span> : ""}
          </Typography>
        </Box>
        <div style={{ marginTop: "20px" }}>
          <Button type="submit" variant="contained">
            Start Chat
          </Button>
        </div>
        <Box mt={2} textAlign="center">
          <Typography variant="subtitle1" color="text">
            Forgot Password?{"  "}
            <Typography
              component={Link}
              to="/forgot-password"
              variant="subtitle1"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Click here to reset
            </Typography>
          </Typography>
        </Box>
      </form>
    </Card>
  );
}

export default EmailPassword;
