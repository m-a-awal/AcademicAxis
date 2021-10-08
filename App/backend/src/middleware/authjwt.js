// middleware/users.js

const jwt = require("jsonwebtoken");

module.exports = {
  validateRegister: (req, res, next) => {
    // username min length 3
    if (!req.body.username || req.body.username.length < 3) {
      return res.status(400).send({
        msg: "Please enter a username with min. 3 chars",
      });
    }

    // password min 6 chars
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).send({
        msg: "Please enter a password with min. 6 chars",
      });
    }

    // password (repeat) does not match
    if (
      !req.body.password_repeat ||
      req.body.password != req.body.password_repeat
    ) {
      return res.status(400).send({
        msg: "Both passwords must match",
      });
    }

    next();
  },

  isLoggedIn: (req, res, next) => {
   // console.log(req.headers.authorization);
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
          token,
          'SECRETKEY'
      );
      req.userData = decoded;
     // console.log("Decoded: ",req.userData.role)
      return res.status(200).send({
        status: "SUCCESS",
        statusCode: 200,
        role: req.userData.role
      });
    } catch (err) {
      return res.status(200).send({
        status: "FAILED",
        statusCode: 400,
        msg: 'Your session is not valid!'
      });
    }
  },

  isAdminLoggedIn: (req, res, next) => {
   // console.log(req.headers.authorization);
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "SECRETKEY");
      req.userData = decoded;

      if (req.userData.role != "Admin") {
        return res.status(401).send({
          msg: "You are not authorized to see the data!",
        });
      }

     // console.log("Decoded: ", req.userData.role);
      next();
    } catch (err) {
      return res.status(401).send({
        msg: "Your session is not valid!",
      });
    }
  },
  isTeacherLoggedIn: (req, res, next) => {
   // console.log(req.headers.authorization);
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "SECRETKEY");
      req.userData = decoded;

      if (req.userData.role != "Teacher") {
        return res.status(401).send({
          msg: "You are not authorized to see the data!",
        });
      }

     // console.log("Decoded: ", req.userData.role);
      next();
    } catch (err) {
      return res.status(401).send({
        msg: 'Your session is not valid!'
      });
    }
  },
  isPupilLoggedIn: (req, res, next) => {
   // console.log(req.headers.authorization);
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "SECRETKEY");
      req.userData = decoded;

      if (req.userData.role != "Pupil") {
        return res.status(401).send({
          msg: "You are not authorized to see the data!",
        });
      }

      //console.log("Decoded: ", req.userData.role);
      next();
    } catch (err) {
      return res.status(401).send({
        msg: "Your session is not valid!",
      });
    }
  },
};
