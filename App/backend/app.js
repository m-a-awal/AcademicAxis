const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.set('query parser', 'simple');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// const router = require('./src/routes/auth.routes');
// app.use('/', router);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to School Management System" });
});

// Import All router
require("./src/routes/user.routes")(app);
require("./src/routes/auth.routes")(app);
require("./src/routes/class.routes")(app);
require("./src/routes/subject.routes")(app);
require("./src/routes/test.routes")(app);
require("./src/routes/class.pupil.routes")(app);
require("./src/routes/result.routes")(app);

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
