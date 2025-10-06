import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  emailValidate,
  userNameValidate,
} from "../utils/formValidation";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
} from "@mui/material";
import { UserApi } from "../services/userService";

function Profile({ open, onClose }) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState(null);
  const [userNameOnBlur, setUserNameOnBlur] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [emailOnBlur, setEmailOnBlur] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [profileData, setProfileData] = useState({});

  const queryClient = useQueryClient();

  const userId = localStorage.getItem("userId");

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => UserApi.GetUser(userId),
    enabled: !!userId,
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log("data :", data);
    if (data && data.data.data) {
      const { email, userName } = data.data.data;
      setProfileData({ userName, email });
      setUserName(userName);
      setEmail(email);
    }
    if(error) console.log("Error while getting User Data");
  }, [data]);

  const updateProfile = useMutation({
    mutationFn: UserApi.UpdateUser,
    onError: (error) => {
      console.log("error :", error.response.data);
      const { message, status } = error.response.data;
      if (status === "Fail") {
        setServerError(message);
      }
    },
    onSuccess: (data) => {
      console.log("RES=======: ", data);
      handleClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailError || userNameError) return;

    if (
      profileData.userName === userName.trim() &&
      profileData.email === email.trim()
    ) {
      return;
    }

    const data = {
      email: email.trim(),
      userName: userName.trim(),
    };
    updateProfile.mutate({ id: userId, data });
    console.log("data :", data);
  };

  const handleClose = () => {
    queryClient.removeQueries({
      queryKey: ["user", userId],
      exact: true,
    });
    setIsUpdate(false);
    setUserName("");
    setEmail("");
    setUserNameError(null);
    setEmailError(null);
    setUserNameOnBlur(false);
    setEmailOnBlur(false);
    setProfileData({});
    onClose();
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

  const handleUpdateButton = () => {
    setIsUpdate(true);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isUpdate ? "Update Profile" : "Profile"}</DialogTitle>
      <DialogContent>
        <form>
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
              disabled={!isUpdate}
              sx={{ display: "flex", marginTop: "20px" }}
              error={!!userNameError}
            ></TextField>
            <Typography error={userNameError} color="error" variant="caption">
              {userNameError ? <span>{userNameError}</span> : ""}
            </Typography>
          </Box>

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
              disabled={!isUpdate}
              sx={{ display: "flex", marginTop: "20px" }}
              error={!!emailError}
            ></TextField>
            <Typography error={emailError} color="error" variant="caption">
              {emailError ? <span>{emailError}</span> : ""}
            </Typography>
          </Box>
          {serverError && (
            <Box mt={2}>
              <Typography error={serverError} color="error" variant="caption">
                {serverError ? <span>{serverError}</span> : ""}
              </Typography>
            </Box>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {isUpdate ? (
          <Button type="submit" form="subscription-form" onClick={handleSubmit}>
            Confirm
          </Button>
        ) : (
          <Button
            type="submit"
            form="subscription-form"
            onClick={handleUpdateButton}
          >
            Update Profile
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default Profile;
