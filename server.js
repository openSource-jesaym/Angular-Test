const app = require('express')();
const http = require('http').Server(app);
const port = 3000;
const path = require('path');
const io = require('socket.io')(http);

/**
 * page that renders when accessing localhost:3000 
 */

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/view/index.html'));
});

/**
 * Get api that returns the list of persons 
 */

app.get('/getPersonsList', (req, res) => {
  io.emit('gotPersonList', true);
  res.send(['1','2'])
});

/**
 * Post api add a new person to the database 
 */

app.post('/addPerson', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

/**
 * Get api that deletes a person from the database ...
 * something seems wrong though :/
 */

app.get('/deletePerson', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
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