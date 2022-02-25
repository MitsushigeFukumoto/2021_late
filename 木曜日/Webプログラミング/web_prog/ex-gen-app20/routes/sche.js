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
    req.session.back = '/sche';
    res.redirect('/users/login');
    return true;
  } else {
    return false;
  }
}

// トップページへのアクセス
router.get('/', (req, res, next)=> {
  if (check(req,res)){ return };
  db.Schedule.findAll({
    where:{userId: req.session.login.id},
    limit:pnum,
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(mds=> {
    var data = {
      title: 'スケジュール管理システム',
      login: req.session.login,
      message: '※最近の投稿データ',
      form: {find:''},
      content:mds
    };
    res.render('sche/index', data);    
  });
});

// 検索フォームの送信処理
router.post('/', (req, res, next)=> {
  if (check(req,res)){ return };
  db.schedule.findAll({
    where:{
      userId:req.session.login.id,
      begin:{[Op.like]:'%'+req.body.find+'%'},
      end:{[Op.like]:'%'+req.body.find+'%'},
      place:{[Op.like]:'%'+req.body.find+'%'},
      content: {[Op.like]:'%'+req.body.find+'%'}
    },
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(mds=> {
    var data = {
      title: '検索結果',
      login: req.session.login,
      message:'※"' + req.body.find + 
        '" で検索された最近のスケジュール',
      form:req.body,
      content:mds
    };
    res.render('sche/index', data);
  });
});

// 新規作成ページの表示
router.get('/add', (req, res, next) => {
  if (check(req,res)){ return };
  res.render('sche/add', { title: 'Schedule/Add' });
});

// 新規作成フォームの送信処理
router.post('/add', (req, res, next) => {
  if (check(req,res)){ return };
  db.sequelize.sync()
  .then(() => db.Schedule.create({
    userId: req.session.login.id,
    begin:req.body.title,
    end:req.body.title,
    place:req.body.title,
    content:req.body.title,
  })
  .then(model => {
     res.redirect('/sche/index');
  })
  );
});

module.exports = router;