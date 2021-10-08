const userMiddleware = require("../middleware/authjwt");

module.exports = app => {
    const result = require("../controllers/result.controller");

    app.post('/uploadResult/', result.uploadResult)
    app.get('/checkResId/', result.checkResultId)

  };
  
  