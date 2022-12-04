const db = require("../models");
const bcrypt = require("bcrypt");
const { error } = require("console");
const { user } = require("../models");
const User = db.user;

exports.adminSignIn = (req, res) => {
  console.log("body:::", req.body);
  if (!req.body.email || !req.body.password) {
    res.status(400).send({ message: "Email and password can not be empty!" });
    return;
  }
  User.findOne({ email: req.body.email }).then((data) => {
    if (!data) {
      res.send({ message: "User not found. " });
    } else {
      if (data.isSuperAdmin === true) {
        bcrypt.compare(req.body.password, data.password).then((validate) => {
          if (validate === true) {
            // if token present login, otherwise create new one
            if (!data.token) {
              let token = jwt.sign({ body: email }, config.secret, {
                algorithm: "HS256",
              });
              user
                .save({ token: token })
                .then((data) => {
                  console.log(data);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
            res.status(200).send({
              message: "Successfully login.",
              "jwt-token": data.token,
              isAuthenticate: data.isAuthenticate,
              email: data.email,
            });
          } else {
            res.status(404).send({
              message: "Incorrect login credentials.Please try again!",
            });
          }
        });
      } else {
        res
          .status(401)
          .send({ message: "User doesn't have SuperAdmin access." });
      }
    }
  });
};
