const express = require('express');
const router = express.Router();
const db = require('../models/index');

const {Op} = require("sequelize");

/* GET users listing. */
router.get('/', (req, res, next) => {
  const id = req.query.id;
  db.User.findAll({
    where: {
      id: {[Op.lte]:id}
    }
  }).then(usrs => {
    var data = {
      title: 'Users/Index',
      content: usrs
    }
    res.render('users/index',data);
  });
});
module.exports = router;
