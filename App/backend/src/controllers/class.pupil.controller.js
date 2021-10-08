const ClassPupil = require("../model/class.pupil.model");

exports.assignUpdatePupil = (req, res) => {
  //console.log(req.body);
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!",
      status: "FAILED",
      statusCode: 400,
    });
  }

  ClassPupil.updatePupilAssign(req.params.uid, new ClassPupil(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: "Not found ClassStudent with id ${req.params.classId}.",
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

exports.assignNewPupil = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!",
      status: "FAILED",
      statusCode: 400,
    });
  }

  const class_pupil = new ClassPupil({
    csid: req.body.csid,
    uid: req.body.uid,
    cid: req.body.cid
  });

  ClassPupil.assignNewPupil(class_pupil, (err, data) => {
    if (err)
      res.status(200).send({
        message: err.message || "Some error occurred while creating the ClassPupil.",
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

exports.searchAssignedPupil = (req, res) => {
  ClassPupil.searchAssignedPupil(req.params.uid, (err, data) => {
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
