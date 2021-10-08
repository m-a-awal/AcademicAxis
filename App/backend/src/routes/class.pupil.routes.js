const userMiddleware = require("../middleware/authjwt");

module.exports = app => {
    const classPupil = require("../controllers/class.pupil.controller");

    app.post('/assign-pupil/', userMiddleware.isAdminLoggedIn, classPupil.assignNewPupil)
    app.put('/assign-pupil/:uid',userMiddleware.isAdminLoggedIn, classPupil.assignUpdatePupil)
    app.get('/search-assign-pupil/:uid',userMiddleware.isAdminLoggedIn, classPupil.searchAssignedPupil)

  };

