const mongoose = require("mongoose");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 25,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => emailRegex.test(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
  }
}, {timestamps: true});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

exports.User = mongoose.model("User", userSchema);
