const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;
const path = require('path');
var http = require('http').Server(app)
var io = require('socket.io')(http)
var firebase = require('firebase')
const cors = require('cors');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});

var firebaseConfig = {
  apiKey: "AIzaSyA_UpB9EGG4C3rq0y-aClvQnJEWMq826Nw",
  authDomain: "angulartest-7414b.firebaseapp.com",
  databaseURL: "https://angulartest-7414b-default-rtdb.firebaseio.com",
  projectId: "angulartest-7414b",
  storageBucket: "angulartest-7414b.appspot.com",
  messagingSenderId: "739692701555",
  appId: "1:739692701555:web:e8adaddfb49bd78d35c706"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// new db + collection
let person = database.ref('persons')

app.set('view engine', 'ejs')
app.use(express.static('public'));

/**
 * page that renders when accessing localhost:3000 
 */
app.get('/', function (req, res) {
  res.render('root')
});

/**
 * Get api that returns the list of persons 
 */

app.get('/getPersonsList', async (req, res) => {
  io.emit('gotPersonList', true);

  await database.ref('persons').once('value')
    .then((snapshot) => {

      let array = Object.entries(snapshot.val()).map(person =>  ({
        refPersonne: person[0],
        name: person[1].name,
        lastName: person[1].lastName,
        date: person[1].date
      }))

      res.json(array)
    })
  

})

/**
 * Post api add a new person to the database 
 */

app.post('/addPerson', async (req, res) => {

  const name = req.body.name
  const lastName = req.body.lastName
  const date = req.body.date

  let obj = {
    name: name,
    lastName: lastName,
    date: date
  }


  let dataToSend = person.push()
  await dataToSend.set({
    name: name,
    lastName: lastName,
    date: date
  })

  io.emit('addedAPerson', true);
  res.json(true);
  
});

/**
 * Get api that deletes a person from the database ...
 * something seems wrong though :/
 */

app.delete('/deletePerson/:id',async (req, res) => {

  const id = req.params.id
  
  let person = database.ref('persons/'+id)
  person.once('value')
    .then(async data => {

      if (data.val() !== null) 
        await database.ref('persons/'+ id ).remove().then(resp => {
          io.emit('deletedAPerson', true);
          res.json('User Deleted Suvvessfully');
        },err => {
          console.log(err);
          res.json(err);
        });
      else 
        res.json("there is no such user with that refPerson :/");
      
    })
    .catch(console.log);

  
});



//Whenever someone connects this gets executed
io.on('connection', (socket) => {
  console.log('Test Started');

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', () => {
    console.log('Test Closed');
  });
});

// use nodemon, so we don't have to refresh
http.listen(port, () => {
  console.log(`backend app running 🔥 at http://localhost:${port}`)
})