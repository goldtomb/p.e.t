const keys = require('./config/keys');
const stripeSecretKey = keys.stripeSecretKey;
const stripePublicKey = keys.stripePublishableKey;

const express = require('express');
const stripe = require('stripe')(stripeSecretKey);
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

/** EJS MIDDLEWARE */
app.set('view engine', 'ejs'); +

app.use(express.static("./public"));

/** BODYPARSER MIDDLEWARE */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {
    res.sendFile('index.html');
})
app.get('/about', (req, res) => {
    res.sendFile('about.html');
})
app.get('/contact', (req, res) => {
    res.sendFile('/contact.html');
})
app.post('/contact', (req, res) => {
    console.log(req.body);
    const output = `
    <p> You have a new contact request </p>
    <h3> Contact Details </h3>
    <ul>
        <li>Name: ${req.body.name} </li>
        <li>Email: ${req.body.email} </li>
        <li>Company: ${req.body.company} </li>
        <li>Phone Number: ${req.body.phone} </li>
    </ul>
    <h3> Message </h3>
    <p>  ${req.body.message} </p>
    `;
    // createTestAccount method only used during testing
    // change for production
    nodemailer.createTestAccount((err, testAccount) => {
        if(err) {
            res.send(err);
        }
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        transporter.sendMail({
            from: '"NodeMailer Contact" <foo@example.com>', // sender address
            to: "barraganjesus12@gmail.com", // list of receivers
            subject: "Contact Form - Request", // Subject line
            html: output // html body
        }, (err, info) => {
            if(err) {
                res.send(err);
            }
            console.log("Message sent: %s", info.messageId);
            // only used during testing
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        });
    });
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
                        description: classJson.name,
                        currency: "usd",
                        customer: customer.id,
                        receipt_email: customer.email
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
})

app.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`);
})