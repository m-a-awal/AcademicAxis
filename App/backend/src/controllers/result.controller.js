const Result = require("../model/result.model");

exports.uploadResult = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!",
      status: "FAILED",
      statusCode: "400",
    });
  }

  const newResult = new Result({
    rid: req.body.rid,
    sid: req.body.sid,
    tid: req.body.tid,
    uid: req.body.uid,
    grade: req.body.grade,
  });
  console.log(newResult);
  // Save Test in the database
  Result.createResult(newResult, (err, data) => {
    if (err)
      res.status(200).send({
        message: err.message || "Some error occurred while creating the Test.",
        status: "FAILED",
        statusCode: "500",
      });
    else
      res.status(200).send({
        data: data,
        status: "SUCCESS",
        statusCode: 200,
      });
  });
};

exports.checkResultId = (req, res) => {
  Result.checkRes(req.query.tid, req.query.sid, req.query.uid, (err, data) => {
    if (err)
      res.status(200).send({
        message: err.message || "Some error occurred while creating the Test.",
        status: "FAILED",
        statusCode: "500",
      });
    else res.send(data);
  });
};
