const express = require('express');
const app = express();
const port = 3000
const path = require('path');

app.set('view engine', 'ejs')
app.use(express.static('public'))
/**
 * page that renders when accessing localhost:3000 
 */

let tasks = [1, 1, 0]

app.get('/', function(req, res) {
  res.render('root', {tasks: tasks})
});

/**
 * Get api that returns the list of persons 
 */
  
app.get('/getList', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

/**
 * Post api add a new person to the database 
 */

app.post('/addPerson', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

/**
 * Get api that deletes a person from the database ...
 * something seems wrong though :/
 */

app.get('/deletePerson', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});


app.listen(port, () => {
  console.log(`backend app running 🔥 at http://localhost:${port}`)
})