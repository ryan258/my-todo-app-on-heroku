let express = require('express');
let mongodb = require('mongodb');
// create a server
let app = express();
let db;

// make contents of /public available in the root of our server
app.use(express.static('public'));

let connectionString =
  'mongodb+srv://Ryan:Sizzle66@cluster0.oi90j.mongodb.net/TodoApp?retryWrites=true&w=majority';
mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    db = client.db();
    // listen for incoming requests
    app.listen(3000);
  }
);

// take async requests
app.use(express.json());

// "hey express, add all form values to a body object!"
app.use(express.urlencoded({ extended: false }));

// what server should do if there's a request to the home page
app.get('/', function (req, res) {
  db.collection('items')
    .find()
    .toArray(function (err, items) {
      // console.log(items);
      res.send(`<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Simple To-Do App</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
          <div class="container">
            <h1 class="display-4 text-center py-1">👻 To-Do App 👻</h1>
            
            <div class="jumbotron p-3 shadow-sm">
              <form action="/create-item" method="POST">
                <div class="d-flex align-items-center">
                  <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                  <button class="btn btn-primary">Add New Item</button>
                </div>
              </form>
            </div>
            
            <ul class="list-group pb-5">
              ${items
                .map(function (item) {
                  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text">${item.text}</span>
                <div>
                  <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                  <button class="delete-me btn btn-danger btn-sm">Delete</button>
                </div>
              </li>`;
                })
                .join('')}
              
            </ul>
            
          </div>

          <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
          <script src="/browser.js"></script>
          
        </body>
        </html>`);
    });
});

app.post('/create-item', function (req, res) {
  // console.log(req.body.item);
  // let's save the new item to the mongo database
  db.collection('items').insertOne({ text: req.body.item }, function () {
    // res.send('thanks for submission!');
    res.redirect('/');
  });
});

app.post('/update-item', function (req, res) {
  // console.log(req.body.text);
  db.collection('items').findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { text: req.body.text } },
    function () {
      res.send('Success');
    }
  );
});
