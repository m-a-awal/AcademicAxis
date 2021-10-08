const Test = require("../model/test.model");
const Result = require("../model/test.model");

exports.getMarksByTestId = (req, res) => {
  Test.getAllMarks(req.query.sid, req.query.tid, req.query.cid, (err, data) => {
    if (err)
      res.status(200).send({
        status: "FAILED",
        statusCode: 500,
        message: err.message || "Some error occurred while retrieving Marks.",
      });
    else
      res.status(200).send({
        status: "SUCCESS",
        statusCode: 200,
        data: data,
      });
  });
};

exports.getAvgGradeOfSubjects = (req, res) => {
  Test.getAvgGrade(req.params.sid, req.params.cid, (err, data) => {
    if (err)
      res.status(200).send({
        status: "FAILED",
        statusCode: 500,
        message: err.message || "Some error occurred while retrieving Marks.",
      });
    else
      res.status(200).send({
        status: "SUCCESS",
        statusCode: 200,
        data: data,
      });
  });
};

//Create a test
exports.createTest = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!",
      status: "FAILED",
      statusCode: "400",
    });
  }

  const newTest = new Test({
    tid: req.body.tid,
    testname: req.body.testname,
    testdate: req.body.testdate.replace("T", " ").substring(0, 19),
    sid: req.body.sid,
  });

  // Save Test in the database
  Test.create(newTest, (err, data) => {
    if (err)
      res.status(200).send({
        message: err.message || "Some error occurred while creating the Test.",
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

exports.getAllTestsBySid = (req, res) => {
  Test.getAllTestInfoBySid(req.params.sid, (err, data) => {
    if (err)
      res.status(200).send({
        message: err.message || "Some error occurred while retrieving Tests.",
        status: "FAILED",
        statusCode: 500,
      });
    else
      res.status(200).send({
        status: "SUCCESS",
        statusCode: 200,
        data: data,
      });
  });
};

exports.updateTestByTid = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!",
      status: "FAILED",
      statusCode: 400,
    });
  }

  Test.updateByTid(req.params.tid, new Test(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found Test with tid ${req.params.tid}.`,
          status: "FAILED",
          statusCode: 404,
        });
      } else {
        res.status(200).send({
          message: "Error updating Test with tid " + req.params.tid,
          status: "FAILED",
          statusCode: 500,
        });
      }
    } else
      res.status(200).send({
        status: "SUCCESS",
        statusCode: 200,
        data: data,
      });
  });
};

exports.deleteTestByTid = (req, res) => {
  Test.removeByTid(req.params.tid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found test with tid ${req.params.tid}.`,
          status: "FAILED",
          statusCode: 404,
        });
      } else if (err.kind === "found_exam") {
        res.status(200).send({
          message: `Found test(exam) results with tid ${req.params.tid}.`,
          status: "FAILED",
          statusCode: 500,
        });
      } else {
        res.status(200).send({
          message: "Could not delete test with tid " + req.params.tid,
          status: "FAILED",
          statusCode: 500,
        });
      }
    } else
      res.status(200).send({
        message: "Test was deleted successfully!",
        status: "SUCCESS",
        statusCode: 200,
      });
  });
};

exports.updateMarksByResid = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!",
      status: "FAILED",
      statusCode: 400,
    });
  }
  

  Test.updateMarks(req.params.resid, new Test(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found Test with tid ${req.params.resid}.`,
          status: "FAILED",
          statusCode: 404,
        });
      } else {
        res.status(200).send({
          message: "Error updating Test with tid " + req.params.resid,
          status: "FAILED",
          statusCode: 500,
        });
      }
    } else
      res.status(200).send({
        status: "SUCCESS",
        statusCode: 200,
        data: data,
      });
  });
};
