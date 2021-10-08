const Class = require("../model/class.model");

exports.createClass = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!",
      status: "FAILED",
      statusCode: 400,
    });
  }

  // Create a Customer
  const class_c = new Class({
    cid: req.body.cid,
    classname: req.body.classname,
    is_removed: 'NO'
  });

  // Save Customer in the database
  Class.create(class_c, (err, data) => {
    if (err)
      res.status(200).send({
        message: err.message || "Some error occurred while creating the Class.",
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

exports.updateById = (req, res) => {
  //console.log(req.body);
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!",
      status: "FAILED",
      statusCode: 400,
    });
  }

  Class.updateOne( new Class(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found Customer with id ${req.params.classId}.`,
          status: "FAILED",
          statusCode: 404,
        });
      } else {
        res.status(200).send({
          message: "Error retrieving Customer with id " + req.params.classId,
          status: "FAILED",
          statusCode: 500,
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

exports.deleteClassById = (req, res) => {
  Class.remove(req.params.classId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found Class with id ${req.params.classId}.`,
          status: "FAILED",
          statusCode: 404,
        });
      } else {
        res.status(200).send({
          message: "Could not delete Class with id " + req.params.customerId,
          status: "FAILED",
          statusCode: 500,
        });
      }
    } else
      res.status(200).send({
        message: "Class has been deleted successfully!",
        status: "SUCCESS",
        statusCode: 200,
      });
  });
};

exports.getAllClass = (req, res) => {
  Class.getAll((err, data) => {
    if (err)
      res.status(200).send({
        message: err.message || "Some error occurred while retrieving classes.",
        status: "FAILED",
        statusCode: "500",
      });
    else
      res.status(200).send({
        status: "SUCCESS",
        statusCode: 200,
        data: data,
      });
  });
};

exports.getAllClassWithRemoved = (req, res) => {
  Class.getAllWithRemoved((err, data) => {
    if (err)
      res.status(200).send({
        message: err.message || "Some error occurred while retrieving classes.",
        status: "FAILED",
        statusCode: "500",
      });
    else
      res.status(200).send({
        status: "SUCCESS",
        statusCode: 200,
        data: data,
      });
  });
};

exports.getAllClassesByPupil = (req, res) => {
  Class.getPupilClasses(req.params.uid, (err, data) => {
    if (err)
      res.status(200).send({
        message: err.message || "Some error occurred while retrieving classes.",
        status: "FAILED",
        statusCode: "500",
      });
    else
      res.status(200).send({
        status: "SUCCESS",
        statusCode: 200,
        data: data,
      });
  });
};

exports.getClassName = (req, res) => {
  Class.getCurrentClassNameByPupilId(req.params.uid, (err, data) => {
    if (err)
      res.status(200).send({
        message: err.message || "Some error occurred while retrieving classes.",
        status: "FAILED",
        statusCode: "500",
      });
    else
      res.status(200).send({
        status: "SUCCESS",
        statusCode: 200,
        data: data,
      });
  });
};
