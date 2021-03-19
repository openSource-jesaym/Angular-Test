const express = require('express');
const app =  express();
const port = 3000;
const path = require('path');
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.set('view engine', 'ejs')
app.use(express.static('public'))
/**
 * page that renders when accessing localhost:3000 
 */

app.get('/', function(req, res) {
  res.render('root')
});

/**
 * Get api that returns the list of persons 
 */

app.get('/getPersonsList', (req, res) => {
  io.emit('gotPersonList', true);
  // res.send(['1','2'])
  res.render('root')
});

/**
 * Post api add a new person to the database 
 */

app.post('/addPerson', (req, res) => {
  io.emit('addedAPerson', true);
  res.render('root')
});

/**
 * Get api that deletes a person from the database ...
 * something seems wrong though :/
 */

app.get('/deletePerson', (req, res) => {
  io.emit('deletedAPerson', true);
  res.render('root')
});


//Whenever someone connects this gets executed
io.on('connection', (socket) => {
    console.log('A user connected');

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

// use nodemon, so we don't have to refresh
http.listen(port, () => {
  console.log(`backend app running 🔥 at http://localhost:${port}`)
})