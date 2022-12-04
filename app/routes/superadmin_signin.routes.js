module.exports = (app) => {
  const admin = require("../controllers/admin.controller");

  var router = require("express").Router();

  router.post("/superadmin", admin.adminSignIn);

  app.use("/sow/sign_in", router);
};
