const userMiddleware = require("../middleware/authjwt");

module.exports = app => {
    const class_c = require("../controllers/class.controller");

    app.post('/class/', userMiddleware.isAdminLoggedIn, class_c.createClass)

    app.put('/class/:classId', userMiddleware.isAdminLoggedIn, class_c.updateById)

    app.delete('/class/:classId', userMiddleware.isAdminLoggedIn, class_c.deleteClassById)

    app.get('/class/', class_c.getAllClass)

    app.get('/class-with-removed/', class_c.getAllClassWithRemoved)

    app.get('/classname/:uid', userMiddleware.isPupilLoggedIn, class_c.getClassName)

    app.get('/pupilClasses/:uid', userMiddleware.isPupilLoggedIn, class_c.getAllClassesByPupil)

  };
  
