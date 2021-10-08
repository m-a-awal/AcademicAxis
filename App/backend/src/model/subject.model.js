const sql = require("../model/db");

const Subject = function (subject) {
  this.sid = subject.sid;
  this.subjectname = subject.subjectname;
  this.status = subject.status;
  this.uid = subject.uid;
  this.cid = subject.cid;
};

Subject.getAll = (cid, result) => {
  var query =
    "SELECT CONCAT(firstname, ' ',lastname) as fullname, T.subjectname, T.status, T.uid, T.sid FROM User INNER JOIN (SELECT subjectname, status, uid, Subject.sid FROM Subject INNER JOIN (SELECT Subject.sid FROM Subject WHERE Subject.cid = ?)  as TT ON Subject.sid = TT.sid) as T ON User.uid = T.uid";
  sql.query(query, cid, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("class: ", res);
    result(null, res);
  });
};

Subject.getAllTestGrades = (sid, pid, result) => {
  console.log(sid, pid)
  var query =
    "SELECT Test.tid, Test.testname as tname, Test.testdate, T.marks as score FROM Test INNER JOIN (SELECT result.marks, result.tid FROM result WHERE result.aid = (SELECT AssignedSubject.aid FROM AssignedSubject WHERE uid = ? AND sid = ?)) as T ON Test.tid = T.tid";
  sql.query(query, [pid, sid], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("class: ", res);
    result(null, res);
  });
};


Subject.update = (sid, reqBody, result) => {

  res_count = 0;
  sql.query(
    "SELECT COUNT(tid) as count FROM Test WHERE sid = ?", sid, (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(null, res);
        return;
      }
      res_count = res[0].count;
      console.log("Count: ", res_count);

      var isAllowToUpdate = 0;

      if (reqBody.status == "Archived") {
        if (!res_count) {
          console.log("##############")
          result({ kind: "cant_updated" }, null);
          return;
        } else {
          isAllowToUpdate = 1;
        }
      } {
        isAllowToUpdate = 1;
      }

      if (isAllowToUpdate == 1) {
        /*sql.query("UPDATE AssignedSubject SET uid=?", subject.uid, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
          }
        });*/

        sql.query(
          "UPDATE Subject SET subjectname = ?, status = ?, uid= ?, cid=? WHERE sid = ?",
          [reqBody.subjectname, reqBody.status, reqBody.uid, reqBody.cid, sid],
          (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(null, err);
              return;
            }
            if (res.affectedRows == 0) {
              // not found Customer with the id
              result({ kind: "not_found" }, null);
              return;
            }
            //console.log("Updated Subject: ", { ...subject });
            result(null, { ...reqBody });
            return;
          }
        );
      }
    }
  );
};



Subject.deleteOne = (sid, result) => {
  res_count = 0;
  sql.query(
    "SELECT COUNT(tid) as count FROM Test WHERE sid = ?",
    sid,
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(null, res);
        return;
      }
      res_count = res[0].count;
      console.log("Count: ", res_count);
      //console.log(typeof(res))

      if (!res_count) {
        sql.query(
          "DELETE FROM AssignedSubject WHERE sid = ?",
          sid,
          (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(null, err);
              return;
            }
          }
        );
        sql.query("DELETE FROM Subject WHERE sid = ?", sid, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
          }
        });
        result(null, res);
        return;
      }

      result({ kind: "cant_delete" }, null);
      return;
    }
  );
};

Subject.create = (newSubject, result) => {
  sql.query("INSERT INTO Subject SET ?", newSubject, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Created Class ###: ", { ...newSubject });

    sql.query("SELECT uid FROM ClassStudent WHERE cid = ?", newSubject.cid, (
      err, studentsUid) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("class: ", res);
 
        studentsUid.forEach((stu_uid, idx) => {
          var aid = "AI" + Date.now() + "A" + idx;
          sql.query(
            "INSERT INTO AssignedSubject VALUES (?, ?, ?, 'Not Archived')",
            [aid, stu_uid.uid, newSubject.sid],
            (err, res) => {
              if (err) {
                console.log("error in inserting AssignSubject: ", err);
                result(err, null);
                return;
              }
            }
          );
        })

        result(null, { ...newSubject });
    });
  });
};

Subject.getAverageGrade = (subjectId, result) => {
  var query =
    "SELECT CONCAT(User.firstname, ' ', User.lastname) as name , TT.AVG_MARK FROM User INNER JOIN (SELECT AssignedSubject.uid as userid, T.AVG_MARK FROM AssignedSubject INNER JOIN (SELECT aid, AVG(marks) as AVG_MARK FROM result INNER JOIN (SELECT tid FROM Test WHERE sid = ?) as T ON result.tid = T.tid GROUP BY result.aid) as T ON AssignedSubject.aid = T.aid) as TT ON User.uid = TT.userid";
  sql.query(query, subjectId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("class: ", res);
    result(null, res);
  });
};

Subject.getAllSUbjectOfPupil = (pid, result) => {
  var query =
    "SELECT Subject.sid, subjectname FROM Subject INNER JOIN (SELECT sid FROM AssignedSubject WHERE uid = ?) as T ON Subject.sid = T.sid";
  sql.query(query, pid, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("class: ", res);
    result(null, res);
  });
};

Subject.getAverageGradeBySubAndPupil = (sid, pid, result) => {
  console.log(sid, pid);
  var query =
    "SELECT AVG(marks) as AVG_MARK FROM result INNER JOIN (SELECT tid FROM Test WHERE sid = ?) as T INNER JOIN (SELECT AssignedSubject.aid FROM AssignedSubject WHERE uid = ? AND sid = ?) as TT ON result.aid = TT.aid";
  sql.query(query, [sid, pid, sid], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("class: ", res);
    result(null, res);
  });
};

Subject.getSubjectClassTeacherByCid = (cid, result) => {

  var query =
    "SELECT Subject.sid, Subject.uid, Subject.subjectname, Class.cid, Class.classname, CONCAT(User.firstname, ' ',User.lastname) AS tname, Subject.status FROM Subject " +
    "INNER JOIN Class ON Subject.cid = Class.cid INNER JOIN User ON Subject.uid = User.uid WHERE Subject.cid = '" + cid + "' ORDER BY Class.cid DESC";
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("class: ", res);
    result(null, res);
  });
};

Subject.getAvgGradeByPupilId = (pid, cid, result) => {
  var query = `SELECT R_T_S_AS.sid as sid, R_T_S_AS.subjectname as subjectname, CAST(AVG(marks) AS DECIMAL (10,1)) AS avgGrade FROM result RIGHT JOIN (SELECT Test.tid, T_S_AS.*
    FROM Test
    RIGHT JOIN (
    SELECT Subject.subjectname, Subject.sid, S_AS.aid
    FROM Subject
    RIGHT JOIN (SELECT AssignedSubject.sid, aid FROM AssignedSubject Where AssignedSubject.uid = ?) as S_AS
    ON Subject.sid = S_AS.sid AND Subject.cid=?) as T_S_AS
    ON Test.sid = T_S_AS.sid
    )as R_T_S_AS
    ON result.tid=R_T_S_AS.tid AND result.aid=R_T_S_AS.aid
    GROUP BY sid`;
  sql.query(query, [pid, cid], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("class: ", res);
    result(null, res);
  });
};

Subject.checkSubExists = (subname, uid, cid, result) => {

  sql.query("SELECT * FROM Subject WHERE subjectname='" + subname + "' AND uid='" + uid + "' AND cid='" + cid + "'",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, res);
    })

}

Subject.getSubjectDetailsForTeacher = (tid, result) => {
  var query = "Select T.sid, Class.classname, T.subjectname, Class.cid FROM Class INNER JOIN (SELECT * FROM Subject WHERE Subject.uid='"+tid+"' AND status ='Not Archived') as T ON Class.cid = T.cid"
  console.log(query)
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("Subjects: ", res);
    result(null, res);
  });
};

module.exports = Subject;
