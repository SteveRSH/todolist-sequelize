//NOTES

//To show table in terminal:
//psql todolist (todolist is the name of my database)
// \dt
// select * from mylists


//install the following through terminal npm install express mustache-express sequelize (DONE)

//install body-parser (DONE)

const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const Sequelize = require('Sequelize');

const app = express();

app.engine('mustache', mustache());
app.set('views', './views');
app.set('view engine', 'mustache');

// needed to access req.body from forms!
app.use(bodyparser.urlencoded({ extended: true }));

/*********TODO LIST SCHEMA*****************/
//my username is my firstlast name w/ no spaces - all lower caps

const db = new Sequelize('todolist', 'stevehorlback', '', {
  dialect: 'postgres',
});

const JustDo = db.define('mylist', {
  todo: Sequelize.STRING,
  priority: Sequelize.INTEGER,
  date: Sequelize.INTEGER,
  start: Sequelize.BOOLEAN,
});



//confirm if all tables exist (CHECKED TERMINAL - EXIST)
// JustDo.sync().then(function () {
//     console.log('just do nsync');
//
//       JustDo.create({
//     name: 'clean',
//     priority: 1,
//     date: 2017-10-10,
//     start: false,
//   });
// JustDo.create({
//     name: 'clean',
//     priority: 1,
//     date: 2017-10-10,
//     start: true,
//   });
// JustDo.create({
//     name: 'clean',
//     priority: 1,
//     date: 2017-10-10,
//     start: false,
//   });

// });

// get - used to linking a linking
// post - add to list in this case /mylist


app.get('/', function (req, res){

      JustDo.findAll({
        order: [
          ['createdAt', 'DESC']
        ]
      }).then(function (justdoit) {
          res.render('list', {
              mylist: justdoit, // todo: get info from database
          });
      });
  });

  app.get('/add', function (req, res) {
        res.render('add');
    });

    app.post('/mylist', function (req, res) {
        JustDo.create({
            todo: req.body.todo,
            priority: parseInt(req.body.priority),
            date: parseInt(req.body.date),
            start: true,
        }).then(function () {
            // Wait until insert is finished, then redirect.
            res.redirect('/');
        });
    });
//SORT TODOS BY CREATION DATE
//createdAT
//findAll({ limit: 10, order: '"createdAt" DESC' })

    app.post('/startThat/:theList', function (req, res) {
          const id = parseInt(req.params.theList);

          
          JustDo.update({
              start: true
          }, {
              where: {
                  id: id,
              },
                order: [
                  ['createdAt', 'DESC']
                ]
          }).then(function() {
              res.redirect('/');
          });
      });

      app.post('/startThis/:theList', function (req, res)
      {
      const id = parseInt(req.params.theList);


      JustDo.update({
          start: false},
      {
          where: {
              id: id,
          },
          order: [
            ['createdAt', 'DESC']
          ]
      }).then(function() {
          res.redirect('/');
      });
      });

      app.post('/edit/:theList' , function (req, res){
      let id  = req.params.theList;
      JustDo.update({
        todo: req.body.changes
      },
      {
          where: {
              id: id,
          },
          order: [
            ['createdAt', 'DESC']
          ]
      }).then(function() {
          res.redirect('/');
      });
      });

      app.post('/delete/:theList' , function (req, res){
      let id  = req.params.theList;
      JustDo.destroy({


          where: {
              id: id,
          },

      }).then(function() {
          res.redirect('/');
      });
      });









//per Ben if you create an express app and you run it on a port other than 3000, please have your app print the port it’s running on when it starts
  app.listen(3000);
