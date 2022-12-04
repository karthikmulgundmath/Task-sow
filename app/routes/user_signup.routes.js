module.exports = (app) => {
  const user = require("../controllers/user.controller");

  var router = require("express").Router();

  //create a User
  router.post("/user", user.create);

  // Update a User
  // router.put("/", user.update);

  app.use("/sow/sign_up", router);
};
