const User = require("../model/user.model");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//Create a user
exports.createUser = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!",
      status: "FAILED",
      statusCode: 400,
    });
  }

  const newUser = new User({
    uid: req.body.uid,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    role: req.body.role,
  });

  // Save User in the database
  User.create(newUser, (err, data) => {
    if (err)
      res.status(200).send({
        message: err.message || "Some error occurred while creating the User.",
        status: "FAILED",
        statusCode: 500,
      });
    else
      res.status(200).send({
        data: data,
        status: "SUCCESS",
        statusCode: 201,
      });
  });
};

exports.findOne = (req, res) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          status: "FAILED",
          statusCode: 404,
          message: `Not found Customer with id ${req.params.userId}.`,
        });
      } else {
        res.status(200).send({
          status: "FAILED",
          statusCode: 500,
          message: "Error retrieving Customer with id " + req.params.userId,
        });
      }
    } else
      res.status(200).send({
        data: data,
        status: "SUCCESS",
        statusCode: 200,
      });
  });
};

exports.findUserByRole = (req, res) => {
  User.getAllByRole(req.params.role, (err, data) => {
    if (err)
      res.status(200).send({
        message: err.message || "Some error occurred while retrieving users.",
        status: "FAILED",
        statusCode: 500,
      });
    else
      res.status(200).send({
        data: data,
        status: "SUCCESS",
        statusCode: 200,
      });
  });
};

exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers.",
        status: "FAILED",
        statusCode: 500,
      });
    else
      res.status(200).send({
        data: data,
        status: "SUCCESS",
        statusCode: 200,
      });
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!",
      status: "FAILED",
      statusCode: "400",
    });
  }

  User.updateByUid(req.params.uid, new User(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found Customer with id ${req.params.uid}.`,
          status: "FAILED",
          statusCode: "404",
        });
      } else {
        res.status(200).send({
          message: "Error updating User with uid " + req.params.uid,
          status: "FAILED",
          statusCode: "500",
        });
      }
    } else res.send({
      data: data,
      status:"SUCCESS",
      statusCode: 200
    });
  });
};

exports.delete = (req, res) => {
  User.removeByUid(req.params.uid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found user with id ${req.params.uid}.`,
          status: "FAILED",
          statusCode: "404",
        });
      } else if(err.kind === "found_assign") {
        res.status(200).send({
          message: "found assigned subject and not archived (user cannot be deleted) uid: " + req.params.uid,
          status: "FAILED",
          statusCode: "500",
        });
      } else {
        res.status(200).send({
          message: "Could not delete user with id " + req.params.uid,
          status: "FAILED",
          statusCode: "500",
        });
      }
    } else
      res.status(200).send({
        message: "User was deleted successfully!",
        status: "SUCCESS",
        statusCode: 200,
      });
  });
};

exports.checkDuplicateUsername = (req, res) => {
  User.duplicateUsername(req.params.username, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          status: "FAILED",
          statusCode: 404,
          message: `Not found Customer with id ${req.params.userId}.`,
        });
      } else {
        res.status(200).send({
          status: "FAILED",
          statusCode: 500,
          message: "Error retrieving Customer with id " + req.params.userId,
        });
      }
    } else
      res.status(200).send({
        data: data,
        status: "SUCCESS",
        statusCode: 200,
      });
  });
}


exports.searchAllPupil = (req, res) => {
  User.searchPupil(req.params.sParam, (err, data) => {
    if (err)
      res.status(200).send({
        message:
          err.message || "Some error occurred while retrieving customers.",
        data: [],
        status: "FAILED",
        statusCode: 500,
      });
    else
      res.status(200).send({
        data: data,
        status: "SUCCESS",
        statusCode: 200,
      });
  });
};


exports.getAllPupilByClassId = (req, res) => {
  User.getPupilByClassId(req.params.cid, (err, data) => {
    if (err)
      res.status(200).send({
        message: err.message || "Some error occurred while retrieving users.",
        status: "FAILED",
        statusCode: 500,
      });
    else
      res.status(200).send({
        data: data,
        status: "SUCCESS",
        statusCode: 200,
      });
  });
};