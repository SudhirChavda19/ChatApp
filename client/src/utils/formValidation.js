const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailValidate = (email) => {
  return !email || email.length === 0
    ? "Email is required"
    : emailRegex.test(email)
    ? null
    : "Invalid Email Address";
};

const passwordValidate = (password) => {
  return !password || password.length === 0
    ? "Password is required"
    : password.length < 6
    ? "Password must be atleast 6 character long"
    : password.length > 30
    ? "Password maximum 30 character long"
    : null;
};
const userNameValidate = (userName) => {
  return !userName || userName.length === 0
    ? "User Name is required"
    : userName.length < 4
    ? "User Name must be atleast 4 character long"
    : userName.length > 30
    ? "User Name maximum 30 character long"
    : null;
};

export { emailValidate, passwordValidate, userNameValidate };
