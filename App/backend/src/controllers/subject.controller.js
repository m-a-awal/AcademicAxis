const Subject = require("../model/subject.model");

exports.getAllSubjectByClass = (req, res) => {
  Subject.getAll(req.params.classId, (err, data) => {
    if (err)
      res.status(200).send({
        message:
          err.message || "Some error occurred while retrieving Subjects.",
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

exports.getAllGradeBySubjectPupilId = (req, res) => {
  //console.log(req.query.sid, req.query.pid)
  Subject.getAllTestGrades(req.query.sid, req.query.pid, (err, data) => {
    if (err)
      res.status(200).send({
        message:
          err.message || "Some error occurred while retrieving Subjects.",
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

exports.getAllSubjectByPupilId = (req, res) => {
  Subject.getAllSUbjectOfPupil(req.params.pupilId, (err, data) => {
    if (err)
      res.status(200).send({
        message:
          err.message || "Some error occurred while retrieving Subjects.",
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

exports.updateSubjectById = (req, res) => {
  Subject.update(req.params.subjectId, new Subject(req.body), (err, data) => {
    
    if (err){
      if (err.kind === "cant_updated") {
        res.status(200).send({
          message: "FAILED: No Dependent Test Found. Subject cannot be archived",
          status: "FAILED",
          statusCode: 500,
        });
      } else {
        res.status(200).send({
          message:
            err.message || "Some error occurred while retrieving Subjects.",
          status: "FAILED",
          statusCode: 500,
        });
      }
    }else
      res.status(200).send({
        data: data,
        status: "SUCCESS",
        statusCode: 200,
      });
  });
};

exports.deleteSubjectById = (req, res) => {
  Subject.deleteOne(req.params.subjectId, (err, data) => {
    if (err)
      if (err.kind === "cant_delete") {
        res.status(200).send({
          message: "Dependent Test Found. Subject cannot be deleted",
          status: "FAILED",
          statusCode: 500,
        });
      } else {
        res.status(200).send({
          message:
            err.message || "Some error occurred while deleting subject",
          status: "FAILED",
          statusCode: 500,
        });
      }
    else
      res.status(200).send({
        data: data,
        message: "Subject deleted",
        status: "SUCCESS",
        statusCode: 200,
      });
  });
};

exports.createSubject = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!",
      status: "FAILED",
      statusCode: 400,
    });
  }

  // Create a Subject
  const subject = new Subject({
    sid: req.query.sid,
    subjectname: req.query.subjectname,
    status: req.query.status,
    uid: req.query.uid,
    cid: req.query.cid,
  });

  // Save Customer in the database
  Subject.create(subject, (err, data) => {
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
        statusCode: 201,
      });
  });
};

exports.getAverageGradeBySubjectId = (req, res) => {
  Subject.getAverageGrade(req.params.subjectId, (err, data) => {
    if (err)
      res.status(200).send({
        message:
          err.message || "Some error occurred while retrieving Subjects.",
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

exports.getAverageGradePupilSUbject = (req, res) => {
  Subject.getAverageGradeBySubAndPupil(
    req.query.sid,
    req.query.pid,
    (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Subjects.",
        });
      else
        res.status(200).send({
          data: data,
          status: "SUCCESS",
          statusCode: 200,
        });
    }
  );
};

exports.getSubClassTeacherByCid = (req, res) => {
  Subject.getSubjectClassTeacherByCid(req.params.cid, (err, data) => {
    if (err)
      res.status(200).send({
        message:
          err.message || "Some error occurred while retrieving Subjects.",
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

exports.checkSubjectExists = (req, res) => {
  Subject.checkSubExists(
    req.query.subname, req.query.uid, req.query.cid, (err, data) => {
      if (err)
        res.status(200).send({
          message:
            err.message || "Some error occurred while retrieving Subjects.",
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

exports.getSubAvgGradeByPupilId = (req, res) => {
  Subject.getAvgGradeByPupilId(req.params.pid, req.params.cid, (err, data) => {
    if (err)
      res.status(200).send({
        message:
          err.message || "Some error occurred while retrieving Subjects.",
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
}

exports.getSubjectDetailsBYTeacherId = (req, res) => {
  Subject.getSubjectDetailsForTeacher(req.params.tid, (err, data) => {
    if (err)
      res.status(200).send({
        message:
            err.message || "Some error occurred while retrieving Subjects.",
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
}


