
if( process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const express = require('express');
const stripe = require('stripe')(stripeSecretKey);
const bodyParser = require('body-parser');


const app = express();
const port = process.env.port|| 3000;


app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json(), extended);
app.use(bodyParser.urlencoded());


app.listen(port, () => {
    console.log(`Server started on port: ${port}.`);
})
