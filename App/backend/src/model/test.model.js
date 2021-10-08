const sql = require("../model/db");

const Test = function (test) {
  this.tid = test.tid;
  this.testname = test.testname;
  this.testdate = test.testdate;
  this.sid = test.sid;
};

Test.getAllMarks = (sid, tid, cid, result) => {
  var query = "";
  if(tid){
    query = "SELECT resid, name, username, marks, uid, TT.aid FROM result RIGHT JOIN (SELECT CONCAT(firstname, ' ', lastname) as name, username, User.uid, aid FROM User  RIGHT JOIN (SELECT aid, AssignedSubject.uid FROM AssignedSubject INNER JOIN (SELECT uid from ClassStudent where cid = '"+cid+"' and isAssigned='Y') as TQ ON AssignedSubject.uid=TQ.uid and AssignedSubject.sid='"+sid+"') AS T ON User.uid=T.uid) as TT ON result.aid=TT.aid AND tid='"+tid+"'";
  }
  else{
    query = "SELECT resid, name, username, marks, uid, TT.aid FROM result RIGHT JOIN (SELECT CONCAT(firstname, ' ', lastname) as name, username, User.uid, aid FROM User  RIGHT JOIN (SELECT aid, AssignedSubject.uid FROM AssignedSubject INNER JOIN (SELECT uid from ClassStudent where cid = '"+cid+"' and isAssigned='Y') as TQ ON AssignedSubject.uid=TQ.uid and AssignedSubject.sid='"+sid+"') AS T ON User.uid=T.uid) as TT ON result.aid=TT.aid";
  }
    
  sql.query(query,  (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found tests: ", res);
      result(null, res);
      return;
    }

    // not found test with the sid
    result({ kind: "not_found" }, null);
  });
};

Test.create = (newTest, result) => {
  var query = "INSERT INTO Test SET ?";
  sql.query(query, newTest, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created test: ", { id: res.insertId, ...newTest });
    result(null, { ...newTest });
  });
};

Test.getAllTestsBySid = (sid, result) => {
  sql.query("SELECT * FROM Test WHERE sid ='" + sid + "'", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("Data: ", res);
    result(null, res);
  });
};

Test.getAvgGrade = (sid, cid, result) => {
  sql.query("SELECT resid, name, username, CAST(AVG(marks) AS DECIMAL (10,2)) AS avgGrade, uid, TT.aid FROM result RIGHT JOIN (SELECT CONCAT(firstname, ' ', lastname) as name, username, User.uid, aid FROM User RIGHT JOIN (SELECT aid, AssignedSubject.uid FROM AssignedSubject INNER JOIN (SELECT uid from ClassStudent where cid = '"+cid+"' and isAssigned='Y') as TQ ON AssignedSubject.uid=TQ.uid and AssignedSubject.sid='"+sid+"') AS T ON User.uid=T.uid) as TT ON result.aid=TT.aid GROUP BY uid", sid, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("Data: ", res);
    result(null, res);
  });
};

Test.getAllTestInfoBySid = (sid, result) => {
  sql.query("SELECT * FROM Test WHERE sid ='" + sid + "'", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    // console.log("Data: ", res);
    // result(null, res);
    console.log("found tests: ", res);
    result(null, res);

    // if (res.length) {
    //   console.log("found tests: ", res);
    //   result(null, res);
    //   return;
    // }
  });
};

Test.updateByTid = (tid, test, result) => {
  sql.query("SET FOREIGN_KEY_CHECKS=0;", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
  });

  sql.query(
    "UPDATE Test SET testname = ?, testdate = ?, sid = ? WHERE tid = ?",
    [
      test.testname,
      test.testdate.replace("T", " ").substring(0, 19),
      test.sid,
      tid,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found test with the tid
        result({ kind: "not_found" }, null);
        return;
      }

      sql.query("SET FOREIGN_KEY_CHECKS=1;", (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
      });

      console.log("updated test: ", { tid: tid, ...test });
      result(null, { tid: tid, ...test });
    }
  );
};

Test.removeByTid = (tid, result) => {
  var isFound = 0;
  sql.query("SELECT * FROM result WHERE tid ='" + tid + "'", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      isFound = 1;
      return;
    }

    if (res.length) {
      console.log("found result of exams (test cannot be deleted): ", res);
      result({ kind: "found_exam" }, null);
      isFound = 1;
      return;
    }

    if (isFound === 0) {
      sql.query("SET FOREIGN_KEY_CHECKS=0;", (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
      });

      sql.query("DELETE FROM Test WHERE tid = ?", tid, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found Test with the tid
          result({ kind: "not_found" }, null);
          return;
        }

        sql.query("SET FOREIGN_KEY_CHECKS=1;", (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
          }
        });

        console.log("deleted test with tid: ", tid);
        result(null, res);
      });
    }
  });
};

Test.updateMarks = (resid, test, result) => {
  console.log("Hello There " + resid + " " + test.marks);
  sql.query("SET FOREIGN_KEY_CHECKS=0;", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
  });

  sql.query(
    "UPDATE result SET marks = ? WHERE resid = ?",
    [test.marks, resid],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found test with the tid
        result({ kind: "not_found" }, null);
        return;
      }

      sql.query("SET FOREIGN_KEY_CHECKS=1;", (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
      });

      console.log("updated test: ", { resid: resid, ...test });
      result(null, { resid: resid, ...test });
    }
  );
};

module.exports = Test;
