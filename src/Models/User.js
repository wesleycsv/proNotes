const { Schema, model, connection } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("password")) {
    const newPassword = (error, hasedPassword) => {
      if (error) {
        next(error);
      } else {
        this.password = hasedPassword;
        next();
      }
    };

    bcrypt.hash(this.password, 10, newPassword);
  }
});

userSchema.methods.isComparaPasswords = function (password, callback) {
  bcrypt.compare(password, this.password, function (error, same) {
    if (error) {
      callback(error)
    }else{
      callback(error, same)
    }
  });
};

const modelName = "users";
module.exports =
  connection && connection.models[modelName]
    ? connection.models[modelName]
    : model(modelName, userSchema);
