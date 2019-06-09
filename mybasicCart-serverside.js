// load required libraries
const hbs = require('express-handlebars')
const express = require('express')
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');

// create an instance of the application
const app = express();

// configure port
const PORT = parseInt(process.argv[2] || process.env.APP_PORT || 3000);


// create database
//const db = { }; //object in database
const db=[];

//set up PORT
app.listen(PORT, () => {
    console.info('Application started at %s on port %d',
        new Date(), PORT);
})

// to serve index.html file in public directory
app.get(/.*/, express.static(__dirname + '/public'));

// configure handlebars
app.engine('hbs', hbs())
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views');


// to use bodyParser as POST method is used and to read
// body of form (url encoded), express needs body data to be parsed
//use cookie parser for server side storage
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());



app.get('/cart', (req, resp) => { // '/cart is path of the new result pg

    //console.info('customer_name: ', req.cookies['customer_name']);

    const name = req.query.name; //string
    //let cart = []; //object in server
    let cart = db
    /*
    if (name in db)
        {cart = db[name]}
        
    else
        {db[name] = []}; // need to set db[name] i/o cart to [] so tt cart items will be stored in cookie
        //console.log(db)}

    resp.cookie('customer_name', name, { httpOnly: true, maxAge: 1000 * 60 * 60  });
    */

    resp.status(200)
    resp.type('text/html')
    resp.render('cart_server', { 
        name: name,
        cart: cart, // cart doesnt get into form, remains in database as object. If don't include this line, when user comes in again next time, the info will not be cached
        layout: false
    })
})

app.post('/cart', (req, resp) => { 
    const name = req.body.name; // string
    const toAdd = req.body.toAdd; //string
    //const cart = db[name] || []; // cart doesnt get into form, remains in database as object
    const cart = db;
    cart.push(toAdd);

    resp.status(200)
    resp.type('text/html')
    resp.render('cart_server', { 
        name: name,
        cart: cart, // cart doesnt get into form, remains in database as object
        layout: false
    })
});


