module.exports = (app) => {
  const user = require("../controllers/user.controller");

  var router = require("express").Router();

  router.post("/user", user.findOne);

  app.use("/sow/sign_in", router);
};
