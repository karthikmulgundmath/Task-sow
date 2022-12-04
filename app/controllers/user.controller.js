const db = require("../models");
const bcrypt = require("bcrypt");
const config = require("../../config/auth.config");
const jwt = require("jsonwebtoken");
const User = db.user;
const { user } = require("../models/user.model");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Create and Save a new User
//Sign up
exports.create = (req, res) => {
  console.log("IN method 😁");
  console.log("req.body", req.body);

  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Email Content can not be empty!" });
    return;
  }
  console.log(req.body.email, req.body.password);

  const email = req.body.email;
  const password = req.body.password;
  const isMerchant = req.body.isMerchant;
  const isAdmin = req.body.isAdmin;
  const isSuperAdmin=req.body.isSuperAdmin;

  sleep(1000);

  //hashing the password to store in the DB
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  let token = jwt.sign({ body: email }, config.secret, {
    algorithm: "HS256",
  });

  // Create a User
  const user = new User({
    email: email,
    isMerchant: isMerchant,
    isAdmin: isAdmin,
    isSuperAdmin: isSuperAdmin,
    isActive: true,
    password: hashedPassword,
    token: token,
  });

  User.findOne({ email: email })
    .then((data) => {
      if (!data) {
        // Save User in the database
        user
          .save(user)
          .then((data) => {
            console.log(data);
            res.send({
              message: "User Created",
              data: data,
              code: 200,
            });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the User.",
            });
          });
      } else {
        res.status(403).send({
          message: "User already exist, please login via Email",
          code: 403,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving user with this mobile number =" + email,
      });
    });
};


//Sign In
exports.findOne = (req, res) => {
  console.log("In method signin---> ", req.body);
  const email = req.body.email;
  const password = req.body.password;

  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    User.findOne({ token: bearerToken }).then((data) => {
      if (!data) {
        res.send({ message: "Unauthorized User. " });
      } else {
        // console.log(data);
        res.status(200).send({ data: data });
      }
    });
  } else {
    User.findOne({ email: email, isActive: true })
      .then((data) => {
        console.log("data--->", data);
        if (!data) {
          res
            .status(404)
            .send({ message: "User doesn't exist or inactive.. " });
        } else {
          // console.log("this user is loging in ::", data);
          if (req.body.password === undefined) {
            res.status(404).send({
              message: "User doesn't exist. Please sign-up with this number.",
            });
          } else {
            if (data.password !== undefined) {
              bcrypt.compare(password, data.password).then((validate) => {
                console.log("compare ::", validate);
                if (validate === true) {
                  // console.log("user data::", data);
                  // if token present login, otherwise create new one
                  if (data.token) {
                  }
                  res.status(200).send({
                    message: "Successfully login.",
                    "jwt-token": data.token,
                    isAuthenticate: data.isAuthenticate,
                    email: data.email,
                  });
                } else {
                  res.status(404).send({
                    message: "Incorrect password. Please try again!",
                  });
                }
              });
            } else {
              res.status(404).send({
                message: "Set password",
              });
            }
          }
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving User with email=" + email,
        });
      });
  }
};
