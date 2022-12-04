const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();

const bp = require("body-parser");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

const server = require("http").createServer(app);
const db = require("./app/models");

//DB Connection
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//Admin Login Route
require("./app/routes/superadmin_signin.routes")(app);

//user signup Route
require("./app/routes/user_signup.routes")(app);

//user signin Route
require("./app/routes/user_signin.routes")(app);

// set port, listen for requests
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
