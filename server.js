const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
var http = require('http').Server(app)
var io = require('socket.io')(http)
var firebase = require('firebase');
const firebaseConfig = require('./firebase-config')  

app.use(express.urlencoded({
  extended: true
}));

app.use(express.json());

app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});

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

  if (!name || !lastName || !date) res.json("Data not valid!");

  let dataToSend = person.push()
  await dataToSend.set({
    name,
    lastName,
    date
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
        await database.ref('persons/'+ id ).remove().then(() => {
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