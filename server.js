
if( process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const express = require('express');
const stripe = require('stripe')(stripeSecretKey);
const bodyParser = require('body-parser');
const fs = require('fs');


const app = express();
const port = process.env.port|| 3000;


app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json({extended: false}),);
app.use(bodyParser.urlencoded({extended: false}));

app.get('/classes', (req, res) => {
    fs.readFile('./models/classes.json', (req, res) => {
        if(error) {
            res.status(500).end()
        } else {
            res.render('classes.ejs', {
                items: JSON.parse(data)
            })
        }
    })
});

app.listen(port, () => {
    console.log(`Server started on port: ${port}.`);
})
