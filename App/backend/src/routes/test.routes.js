const userMiddleware = require("../middleware/authjwt");

module.exports = app => {
    const test = require("../controllers/test.controller");

    app.get('/test/:sid', test.getAllTestsBySid)
    app.put('/test/:tid', test.updateTestByTid)
    app.delete('/test/:tid', userMiddleware.isTeacherLoggedIn, test.deleteTestByTid)
    app.post('/test/', test.createTest)

    //Result API
    app.get("/marks/", test.getMarksByTestId);
    app.put("/marks/:resid", test.updateMarksByResid);
    app.get('/subjects/avgGrade/:sid/:cid', test.getAvgGradeOfSubjects)
  };
  
  