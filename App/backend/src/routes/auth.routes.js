const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const db = require("../model/db.js");
const userMiddleware = require("../middleware/authjwt");

module.exports = (app) => {
  app.post("/sign-up", userMiddleware.validateRegister, (req, res, next) => {
    db.query(
      `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(
        req.body.username
      )});`,
      (err, result) => {
        if (result.length) {
          return res.status(409).send({
            msg: "This username is already in use!",
          });
        } else {
          // username is available
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                msg: err,
              });
            } else {
              // has hashed pw => add to database
              db.query(
                `INSERT INTO users (id, username, password, registered) VALUES ('${uuid.v4()}', ${db.escape(
                  req.body.username
                )}, ${db.escape(hash)}, now())`,
                (err, result) => {
                  if (err) {
                    throw err;
                    return res.status(400).send({
                      msg: err,
                    });
                  }
                  return res.status(201).send({
                    msg: "Registered!",
                  });
                }
              );
            }
          });
        }
      }
    );
  });

  app.post("/login", (req, res, next) => {
    db.query(
      `SELECT * FROM User WHERE username = ${db.escape(req.body.username)};`,
      (err, result) => {
        // user does not exists
        if (err) {
          //throw err;
          return res.status(200).send({
            status:"FAILED",
            msg: err,
          });
        }
        if (!result.length) {
          return res.status(200).send({
            status:"FAILED",
            msg: "Username or password is incorrect!",
          });
        }

        // check password
        bcrypt.compare(
          req.body.password,
          result[0]["password"],
          (bErr, bResult) => {
            // wrong password
            if (bErr) {
              throw bErr;
              return res.status(200).send({
                status:"FAILED",
                msg: "Username or password is incorrect!",
              });
            }

            if (bResult) {
              const token = jwt.sign(
                {
                  username: result[0].username,
                  userId: result[0].id,
                  role: result[0].role,
                },
                "SECRETKEY",
                {
                  expiresIn: "7d",
                }
              );

              return res.status(200).send({
                status:"SUCCESS",
                msg: "Logged in",
                token,
                role: result[0].role,
                uid:result[0].uid,
                firstname: result[0].firstname,
                lastname:result[0].lastname
              });
            }
            return res.status(200).send({
              status:"FAILED",
              msg: "Username or password is incorrect!",
            });
          }
        );
      }
    );
  });

  app.get("/secret-route", userMiddleware.isLoggedIn, (req, res, next) => {
    res.send("This is the secret content. Only logged in users can see that!");
  });
};
