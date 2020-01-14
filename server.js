if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLISHABLE_KEY;

const express = require('express');
const stripe = require('stripe')(stripeSecretKey);
const bodyParser = require('body-parser');
const fs = require('fs');


const app = express();
const port = process.env.port || 3000;

/** EJS MIDDLEWARE */
app.set('view engine', 'ejs'); +

app.use(express.static("./public"));

/** BODYPARSER MIDDLEWARE */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {
    res.render('/index.html');
})

app.get('/classes', (req, res) => {
    fs.readFile('./models/classes.json', (error, data) => {
        if (error) {
            res.status(500).end()
        } else {
            res.render('classes.ejs', {
                items: JSON.parse(data)
            })
        }
    })
});

app.get('/checkout', (req, res) => {
    res.send('Error: Cannot access /checkout. To access, you must sign up for a class.')
})
app.post('/checkout', (req, res) => {
    res.render('checkout.ejs', {
        publicKey: stripePublicKey,
        classes: req.body
    });
});

app.post("/charge", (req, res) => {
    // read json file containing classes
    fs.readFile('./models/classes.json', (error, data) => {
        if (error) {
            res.status(500).end()
        } else {
            const classesJson = JSON.parse(data);
            const classesArray = classesJson.classes;
            let total = 0;
            const classJson = classesArray.find((i) => {
                return i.id == req.body.classId;
            });
            total = classJson.price;
            stripe.customers.create({
                    name: req.body.customerName,
                    email: req.body.token.email,
                    card: req.body.token.id
                })
                .then(customer =>
                    stripe.charges.create({
                        amount: total,
                        description: "",
                        currency: "usd",
                        customer: customer.id
                    }))
                .then(charge => res.send(charge))
                .catch(err => {
                    console.log("Error:", err);
                    res.status(500).send({
                        error: "Purchase Failed"
                    });
                });

        }
    })


});

app.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`);
})