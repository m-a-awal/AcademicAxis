const sql = require("../model/db");

const Class = function (class_c) {
  this.cid = class_c.cid;
  this.classname = class_c.classname;
  this.is_removed = "No";
};

Class.create = (newClass, result) => {
  //First delete the class if it's status is 'Yes' (Previously removed)

  //Then insert a new one
  sql.query("INSERT INTO Class SET ?", newClass, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // console.log("Created Class: ", { ...newClass });
    result(null, { ...newClass });
  });
};

Class.updateOne = (class_c, result) => {
  sql.query(
    "UPDATE Class SET classname = ? WHERE cid = ?",
    [class_c.classname, class_c.cid],
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

      //console.log("Updated Class: ", { id: cid, ...class_c });
      result(null, { ...class_c });
    }
  );
};

Class.remove = (cid, result) => {
  // Don't check the foreign key since class will delete but subject will not.
  sql.query("SET FOREIGN_KEY_CHECKS=0;", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
  });

  // Delete(Update) from class table
  sql.query(
    "UPDATE Class SET is_removed='Yes' WHERE cid = ?",
    cid,
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
      // Deasign the student from the ClassStudent Table
      sql.query("DELETE FROM ClassStudent WHERE cid = ?", cid, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
      });

      // MAking the subject status Archived
      sql.query(
        "UPDATE Subject SET status = 'Archived' WHERE cid = ?",
        cid,
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
          }
        }
      );

      // Enable the foreign key checking active
      sql.query("SET FOREIGN_KEY_CHECKS=1;", (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
      });

      console.log("Deleted class with id: ", cid);
      result(null, res);
    }
  );
};

Class.getAll = (result) => {
  sql.query("SELECT * FROM Class WHERE is_removed='No'", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("class: ", res);
    result(null, res);
  });
};

Class.getAllWithRemoved = (result) => {
  sql.query("SELECT * FROM Class", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("class: ", res);
    result(null, res);
  });
};

Class.getPupilClasses = (uid, result) => {
  sql.query(
    "SELECT Class.cid, Class.classname, T.isAssigned FROM Class INNER JOIN (SELECT ClassStudent.cid, ClassStudent.isAssigned FROM ClassStudent WHERE ClassStudent.uid = ?) as T ON Class.cid = T.cid",
    uid,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      console.log("class: ", res);
      result(null, res);
    }
  );
};

Class.getCurrentClassNameByPupilId = (uid, result) => {
  sql.query(
    "SELECT Class.cid, Class.classname, T.isAssigned FROM Class INNER JOIN (SELECT ClassStudent.cid, ClassStudent.isAssigned FROM ClassStudent WHERE ClassStudent.uid = ? AND ClassStudent.isAssigned='Y') as T ON Class.cid = T.cid",
    uid,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      console.log("class: ", res);
      result(null, res);
    }
  );
};

module.exports = Class;
