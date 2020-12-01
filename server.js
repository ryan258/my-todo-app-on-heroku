let express = require("express")
let mongodb = require("mongodb")
let sanitizeHTML = require("sanitize-html")

// create a server
let app = express()
let db

// make contents of /public available in the root of our server
app.use(express.static("public"))

// create the connect
let connectionString = "mongodb+srv://Ryan:Sizzle66@cluster0.oi90j.mongodb.net/TodoApp?retryWrites=true&w=majority"
mongodb.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  db = client.db()
  // listen for incoming requests
  app.listen(3000)
})

// take async requests
app.use(express.json())

// "hey express, add all form values to a body object!"
app.use(express.urlencoded({ extended: false }))

function passwordProtected(req, res, next) {
  res.set("WWW-Authenticate", 'basic realm="Simple Todo App"')
  // next() says move on to the next function
  // next()
  console.log(req.headers.authorization)
  if (req.headers.authorization == "Basic bGVhcm46amF2YXNjcmlwdA==") {
    next()
  } else {
    res.status(401).send("Authentication required")
  }
}

// apply password protection to all our routes
app.use(passwordProtected)

// what server should do if there's a get request to the home page
// we can provide multiple functions in .get()
app.get("/", function (req, res) {
  db.collection("items")
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
              <form id="create-form" action="/create-item" method="POST">
                <div class="d-flex align-items-center">
                  <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                  <button class="btn btn-primary">Add New Item</button>
                </div>
              </form>
            </div>
            
            <ul id="item-list" class="list-group pb-5"></ul>
            
          </div>

          <script>
            let items = ${JSON.stringify(items)}
          </script>

          <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
          <script src="/browser.js"></script>
          
        </body>
        </html>`)
    })
})

app.post("/create-item", function (req, res) {
  let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} })
  // console.log(req.body.item);
  // let's save the new item to the mongo database
  db.collection("items").insertOne({ text: safeText }, function (err, info) {
    // res.send('thanks for submission!');
    // res.send("Success")
    // info - send back the JSON object that was just created
    res.json(info.ops[0])
  })
})

// NOTE THE UPDATE PATTERN!
app.post("/update-item", function (req, res) {
  let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} })
  // console.log(req.body.text);
  db.collection("items").findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { text: safeText } },
    // the function that runs when this database action is complete
    function () {
      res.send("Success")
    }
  )
})

// NOTE THE DELETE PATTERN!
app.post("/delete-item", function (req, res) {
  // .deleteOne(a, b)
  // - a - obj: which doc to delete
  // - b - fn: that runs after db action is complete
  db.collection("items").deleteOne({ _id: new mongodb.ObjectId(req.body.id) }, function () {
    res.send("success")
  })
})
