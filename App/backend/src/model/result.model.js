const sql = require("../model/db");

const Result = function (result) {
  this.rid = result.rid;
  this.sid = result.sid;
  this.tid = result.tid;
  this.uid = result.uid;
  this.grade = result.grade;
};

Result.createResult = (newResult, result) => {
  sql.query(
    "INSERT INTO result VALUES(?, ?, ?, (SELECT aid FROM AssignedSubject WHERE sid=? AND uid=?)) ON DUPLICATE KEY UPDATE marks=?",
    [
      newResult.rid,
      newResult.grade,
      newResult.tid,
      newResult.sid,
      newResult.uid,
      newResult.grade,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      // console.log("Created Class: ", { ...newClass });
      result(null, { res, msg:"Inserted"});
    }
  );
};

Result.checkRes = (tid, sid, uid, result) => {
    sql.query(
      "SELECT resid FROM result WHERE tid=? AND aid=(SELECT aid FROM AssignedSubject WHERE sid=? AND uid=?)",
      [
        tid,
        sid,
        uid,
      ],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        // console.log("Created Class: ", { ...newClass });
        result(null, { res, msg:"Inserted"});
      }
    );
  };

module.exports = Result;
