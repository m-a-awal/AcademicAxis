const sql = require("../model/db.js");

const User = function (user) {
  this.uid = user.uid;
  this.username = user.username;
  this.password = user.password;
  this.firstname = user.firstname;
  this.lastname = user.lastname;
  this.role = user.role;
};

User.create = (newUser, result) => {
  var query = "INSERT INTO User SET ?";
  sql.query(query, newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created customer: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

User.getAll = (result) => {
  sql.query("SELECT * FROM User", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("class: ", res);
    result(null, res);
  });
};

User.findById = (userId, result) => {
  //var query = "Select * from User where uid ='" +userId+ "'";
  sql.query("SELECT * FROM User WHERE uid ='" + userId + "'", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

User.searchPupil = (sp, result) => {
  var query =
    "SELECT Class.classname, TT.* FROM Class RIGHT JOIN (SELECT ClassStudent.cid, ClassStudent.isAssigned, T.* FROM ClassStudent RIGHT JOIN (SELECT * from User where role='Pupil' AND (firstname LIKE '%" +
    sp +
    "%' OR lastname LIKE '%" +
    sp +
    "%')) as T ON ClassStudent.uid = T.uid) as TT ON Class.cid = TT.cid";
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found pupil: ",res);
      result(null, res);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAllByRole = (role, result) => {
  var query = "SELECT * FROM User WHERE role ='" + role + "'";
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res);
      result(null, res);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

User.updateByUid = (uid, user, result) => {
  sql.query(
    "UPDATE User SET firstname = ?, lastname = ?, role = ? WHERE uid = ?",
    [user.firstname, user.lastname, user.role, uid],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the uid
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { uid: uid, ...user });
      result(null, { uid: uid, ...user });
    }
  );
};

User.removeByUid = (uid, result) => {
  var userRole = "";
  //Fetch role from uid
  sql.query("SELECT role FROM User WHERE uid ='" + uid + "'", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      userRole = JSON.stringify(res[0].role).replace('"', "").replace('"', "");
    }
    //User as a teacher
    if (userRole === "Teacher") {
      var isFound = 0;
      //Check if teacher has assigned into one subject and not archieved
      sql.query(
        "SELECT * FROM Subject WHERE uid ='" +
          uid +
          "' AND status='Not Archived'",
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(null, err);
            isFound = 1;
            return;
          }

          if (res.length) {
            console.log(
              "found assigned subject and not archived (user cannot be deleted): ",
              res
            );
            result({ kind: "found_assign" }, null);
            isFound = 1;
            return;
          }
          //If archived or no data at Subject table then delete the user
          if (isFound === 0) {
            sql.query("SET FOREIGN_KEY_CHECKS=0;", (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
              }
            });

            sql.query("DELETE FROM User WHERE uid = ?", uid, (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
              }
            });

            sql.query(
              "DELETE FROM AssignedSubject WHERE uid = ?",
              uid,
              (err, res) => {
                if (err) {
                  console.log("error: ", err);
                  result(null, err);
                  return;
                }
              }
            );

            sql.query("SET FOREIGN_KEY_CHECKS=1;", (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
              }

              console.log("deleted user with uid: ", uid);
              result(null, res);
            });
          }
        }
      );
      //User as a Pupil
    } else if (userRole === "Pupil") {
      sql.query("SET FOREIGN_KEY_CHECKS=0;", (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
      });
      //Delete Pupil from User table
      sql.query("DELETE FROM User WHERE uid = ?", uid, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        //Delete Pupil from ClassStudent
        sql.query("DELETE FROM ClassStudent WHERE uid = ?", uid, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
          }
        });

        sql.query("SET FOREIGN_KEY_CHECKS=1;", (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
          }
        });

        console.log("deleted user with uid: ", uid);
        result(null, res);
      });
      //User as an Admin
    } else {
      sql.query("DELETE FROM User WHERE uid = ?", uid, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found User with the uid
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("deleted user with uid: ", uid);
        result(null, res);
      });
    }
  });
};

User.duplicateUsername = (username, result) => {
  sql.query("SELECT * FROM User WHERE username= ? ", username, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    // console.log("user with ", username);
    result(null, res);
  });
};

User.getPupilByClassId = (cid, result) => {
  var query =
    "SELECT cs.uid, u.username, u.firstname as firstname, u.lastname as lastname, (SELECT classname from Class where cid = ?) as classname, cs.isAssigned from ClassStudent cs INNER JOIN User u ON cs.uid = u.uid WHERE cs.cid = ? and u.role ='Pupil'";
  sql.query(query, [cid, cid], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("class: ", res);
    result(null, res);
  });
};

module.exports = User;
