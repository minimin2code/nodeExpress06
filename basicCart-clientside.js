// load required libraries
const hbs = require('express-handlebars')
const express = require('express')
const bodyParser = require('body-parser');
const config = require('./config.json');

// create an instance of the application
const app = express();

// configure port
const PORT = parseInt(process.argv[2] || process.env.APP_PORT || 3000);

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
app.use(bodyParser.urlencoded());

// from index.html, name to be queried. '/cart' is the new page where your result is directed
app.get('/cart', (req, resp) => {
    const nameabc = req.query.name; // string
    let cart = []; // assigned/originated in server; so is an object?
    
    /*
    if (req.query.cart)
        {cart = JSON.parse(req.query.cart)};// cart belongs to form body so need to parse data for express to read in
    */

    resp.status(200)
    resp.type('text/html')
    resp.render('cart', {  // point to cart.hbs
        name: nameabc, // string
        cart: JSON.stringify(cart), // to pass to form need to stringtify otherwise form cannot read
        //cart: cart,
        layout: false
    })
});

//post result to /cart
app.post('/cart', (req, resp) => {  //'/cart' got to be same name as hbs
    const namexyz = req.body.name; //string
    const toAddxyz = req.body.toAdd; //string
    const cartxyz = JSON.parse(req.body.cart); // previously was stringtified so now need to parse to object for express server to store
    //const cart = req.body.cart;
    cartxyz.push(toAddxyz);

    resp.status(200)
    resp.type('text/html')
    resp.render('cart', { //point to cart.hbs
        name: namexyz, //string
        cart: JSON.stringify(cartxyz), //to post to form so need to stringtify
        items: cartxyz,// need to be object and not stringtified as it is not passed back to the form fields. Is an object
        layout: false
    })
});


