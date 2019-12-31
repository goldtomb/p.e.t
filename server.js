if( process.env.NODE_ENV !== "production") {
    require('dotenv').load();
}

const express = require('express');
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require(stripe)(stripeSecretKey);


const app = express();
const port = PORT.env.process || 3000;

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));


app.listen(port, () => {
    
})
