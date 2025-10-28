import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useAuthContext } from "../../context/AuthContext";
import {
  emailValidate,
  passwordValidate,
  userNameValidate,
} from "../../utils/formValidation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { AuthApi } from "../../services/authService";
import SnackBar from "./SnackBar";
import grantNotificationPermissionAndGenerateFcmToken from "../../utils/generateFcmToken";
import notificationSound from "../../assets/notification.mp3";
import { UserApi } from "../../services/userService";

function EmailPassword() {
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState(null);
  const [userNameOnBlur, setUserNameOnBlur] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [emailOnBlur, setEmailOnBlur] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [passwordOnBlur, setPasswordOnBlur] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [openErrorSnackBar, setOpenErrorSnackBar] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [path, setPath] = useState("");

  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  const signUpMutation = useMutation({
    mutationFn: AuthApi.SignUpService,
    onError: (error) => {
      const { message, status } = error.response.data;
      if (status === "Fail") {
        setServerError(message);
        setOpenErrorSnackBar(true);
      }
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        navigate("/sign-in", { replace: true });
      }
    },
  });
  const signInMutation = useMutation({
    mutationFn: AuthApi.SignInService,
    onError: (error) => {
      console.log("error :", error.response.data);
      const { message, status } = error.response.data;
      if (status === "Fail") {
        setServerError(message);
        setOpenErrorSnackBar(true);
      }
    },
    onSuccess: async (data) => {
      if (data.status === 200) {
        const { _id, userName } = data.data.data;
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
        const expirationTime = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
        localStorage.setItem(
          "userTokenExpiration",
          expirationTime.toISOString()
        );
        localStorage.setItem("userId", _id);
        localStorage.setItem("userName", userName);
        setAuthUser(true);
        // if (token) {
        //   await storeTokenMutation.mutate({
        //     id: _id,
        //     data: { fcmToken: token },
        //   });
        // }
        navigate("/chat", { replace: true });
      }
    },
  });
  // const storeTokenMutation = useMutation({
  //   mutationFn: UserApi.UpdateUser,
  //   onError: (error) => {
  //     console.log("error :", error.response.data);
  //     const { message, status } = error.response.data;
  //     if (status === "Fail") {
  //       setServerError(message);
  //     }
  //   },
  //   onSuccess: (data) => {
  //     // if (data.status === 201 && data.data.data) {
  //     //   console.log("data.data.data :", data.data.data);
  //     // }
  //   },
  // });

  const forgotPasswordMutation = useMutation({
    mutationFn: AuthApi.ForgotPasswordService,
    onError: (error) => {
      console.log("error :", error.response.data);
      const { message, status } = error.response.data;
      if (status === "Fail") {
        setServerError(message);
        setOpenErrorSnackBar(true);
      }
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        navigate("/sign-in", { replace: true });
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || passwordError || userNameError) return;

    const data = {
      email,
      password,
    };
    if (path === "/sign-up") {
      await userSignUp(data);
    } else if (path === "/sign-in") {
      new Audio(notificationSound).play().catch((e) => {
        console.log("Audio blocked until user interacts", e);
      });
      const token = await grantNotificationPermissionAndGenerateFcmToken();
      console.log("token :", token);
      data.fcmToken = token;
      await userSignIn(data);
    } else if (path === "/forgot-password") {
      await userForgotPassword(data);
    }
  };

  const userSignUp = async (data) => {
    data.userName = userName;
    signUpMutation.mutate(data);
  };
  const userSignIn = async (data) => {
    signInMutation.mutate(data);
  };
  const userForgotPassword = async (data) => {
    data.newPassword = password;
    delete data.password;
    forgotPasswordMutation.mutate(data);
  };

  const handleUserNameInput = (e) => {
    const value = e.target.value;
    setUserName(value);
    if (userNameOnBlur) setUserNameError(userNameValidate(value));
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

  const handleSnackBar = (snackBarStatus) => {
    if (!snackBarStatus) {
      setOpenErrorSnackBar(false);
    }
  };

  return (
    <Card sx={{ height: "84vh", display: "flex", flexDirection: "column" }}>
      <form onSubmit={handleSubmit} style={{ margin: "auto auto" }}>
        <Typography
          variant="h4"
          component="div"
          gutterBottom
          sx={{ margin: 0 }}
        >
          {path === "/sign-in"
            ? "Sign In"
            : path === "/sign-up"
            ? "Sign Up"
            : "Reset Password"}
        </Typography>
        {path === "/sign-up" && (
          <Box>
            <TextField
              type="text"
              value={userName}
              onChange={handleUserNameInput}
              onBlur={() => {
                setUserNameOnBlur(true);
                setUserNameError(userNameValidate(userName));
              }}
              name="userName"
              id="userName"
              label="User Name"
              placeholder="Mark_10"
              variant="outlined"
              required
              sx={{ display: "flex", marginTop: "20px" }}
              error={!!userNameError}
            ></TextField>
            <Typography error={userNameError} color="error" variant="caption">
              {userNameError ? <span>{userNameError}</span> : ""}
            </Typography>
          </Box>
        )}
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
            sx={{ display: "flex", marginTop: "20px" }}
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
            label={path === "/forgot-password" ? "New Password" : "Password"}
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
            {path === "/sign-in"
              ? "Start Chat"
              : path === "/sign-up"
              ? "Sign Up"
              : "Reset Password"}
          </Button>
          <SnackBar
            setHorizontal={"center"}
            setVertical={"top"}
            setOpen={openErrorSnackBar}
            setMessage={serverError}
            setSeverity={"error"}
            handleSnackBar={handleSnackBar}
          />
        </div>
        {path === "/sign-in" && (
          <Box sx={{ margin: 0, padding: 0 }}>
            <Box mt={2} textAlign="center">
              <Typography variant="subtitle1" color="text">
                Don&apos;t have an account?{" "}
                <Typography
                  component={Link}
                  to="/sign-up"
                  variant="subtitle1"
                  color="info"
                  fontWeight="medium"
                >
                  Sign up
                </Typography>
              </Typography>
            </Box>
            <Box mt={2} textAlign="center">
              <Typography variant="subtitle1" color="text">
                Forgot Password?{"  "}
                <Typography
                  component={Link}
                  to="/forgot-password"
                  variant="subtitle1"
                  color="info"
                  fontWeight="medium"
                >
                  Click here to reset
                </Typography>
              </Typography>
            </Box>
          </Box>
        )}
      </form>
    </Card>
  );
}

export default EmailPassword;
