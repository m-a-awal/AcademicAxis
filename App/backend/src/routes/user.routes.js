const userMiddleware = require("../middleware/authjwt");

module.exports = app => {
    const user = require("../controllers/user.controller.js");

    app.get('/user/:userId', userMiddleware.isAdminLoggedIn, user.findOne)
    app.get("/user/getUserByRole/:role", userMiddleware.isAdminLoggedIn, user.findUserByRole);
    app.get('/usercheck/:username', userMiddleware.isAdminLoggedIn, user.checkDuplicateUsername);
    app.get("/users", userMiddleware.isAdminLoggedIn, user.findAll);
    app.get('/search-pupil/:sParam', userMiddleware.isAdminLoggedIn, user.searchAllPupil)
    app.get('/users/class/:cid', userMiddleware.isAdminLoggedIn, user.getAllPupilByClassId)

    app.post("/user/", userMiddleware.isAdminLoggedIn, user.createUser);
    app.put("/user/:uid", userMiddleware.isAdminLoggedIn, user.update);
    app.delete("/user/:uid", userMiddleware.isAdminLoggedIn, user.delete);
    
  };
