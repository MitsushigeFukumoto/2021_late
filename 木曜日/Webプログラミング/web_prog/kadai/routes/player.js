const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();

const pnum = 10;

// ログインチェックの関数
function check(req,res) {
  if (req.session.login == null) {
    req.session.back = '/player';
    res.redirect('/users/login');
    return true;
  } else {
    return false;
  }
}

// トップページへのアクセス
router.get('/', (req, res, next)=> {
  if (check(req,res)){ return };
  db.Player.findAll({
    where:{userId: req.session.login.id},
    limit:pnum,
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(mds=> {
    var data = {
      title: 'プロ野球選手データベース',
      login: req.session.login,
      message: 'データ一覧',
      form: {find:''},
      content:mds
    };
    res.render('player/index', data);    
  });
});

// 検索フォームの送信処理
router.post('/', (req, res, next)=> {
  if (check(req,res)){ return };
  db.Player.findAll({
    where:{
      [Op.or]:{
        name:{[Op.like]:'%'+req.body.find+'%'},
        position:{[Op.like]:'%'+req.body.find_p+'%'},
        hometown:{[Op.like]:'%'+req.body.find_h+'%'},
      }
    },
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(mds=> {
    var data = {
      title: 'プロ野球選手データベース',
      login: req.session.login,
      message:'データ一覧',
      form:req.body,
      content:mds
    };
    res.render('player/index', data);
  });
});

// 新規作成ページの表示
router.get('/add', (req, res, next) => {
  if (check(req,res)){ return };
  res.render('player/add', { title: '選手データ追加' });
});

// 新規作成フォームの送信処理
router.post('/add', (req, res, next) => {
  if (check(req,res)){ return };
  db.sequelize.sync()
  .then(() => db.Player.create({
    userId: req.session.login.id,
    name: req.body.name,
    age: req.body.age,
    position: req.body.position,
    hometown: req.body.hometown,
  })
  .then(model => {
     res.redirect('/player');
  })
  );
});
router.get('/edit',(req, res, next)=> {
  db.Player.findByPk(req.query.id)
  .then(usr => {
    var data = {
      title: '選手データ更新',
      form: usr
    }
    res.render('player/edit', data);
  });
});

router.post('/edit',(req, res, next)=> {
  db.Player.findByPk(req.body.id)
  .then(usr => {
    usr.name = req.body.name;
    usr.age = req.body.age;
    usr.position = req.body.position;
    usr.hometown = req.body.hometown;
    usr.save().then(()=>res.redirect('/player'));
  });
});

router.get('/delete',(req, res, next)=> {
  db.Player.findByPk(req.query.id)
  .then(usr => {
    var data = {
      title: '選手データ削除',
      form: usr
    }
    res.render('player/delete', data);
  });
});

router.post('/delete',(req, res, next)=> {
  db.Player.findByPk(req.body.id)
  .then(usr => {
    usr.destroy().then(()=>res.redirect('/player'));
  });
});

module.exports = router;