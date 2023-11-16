// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 9100;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        res.render('index');                    
    });                                         

app.get('/index', function(req, res)
    {
        res.render('index');                
    });  

app.get('/categories', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        // Define our queries
        let queryCategories = "SELECT * FROM Categories;";  
        db.pool.query(queryCategories, function(error, rows, fields){    // Execute the query
            res.render('categories', {data: rows});                 
        })                                                     
    });                                                   


/* POST */

app.post('/add-category', function(req, res){
    // Get the incoming data
    let data = req.body;

    // Query database with this data
    queryCategoriesInsert = `INSERT INTO Categories (categoryName) VALUES ('${data['categoryName']}');`
    db.pool.query(queryCategoriesInsert, function(error, rows, fields){

        if (error) {
            // Send 400 Bad Request if there is an error
            console.log(error)
            res.sendStatus(400);
        }
        // If there is no error, render the page again (with the new data)
        else
        {
            res.redirect('/categories.html');
        }
    })
})


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});