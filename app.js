// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Transaction = require('./models/Transaction');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/money_tracker', { useNewUrlParser: true, useUnifiedTopology: true });

// Index route for displaying transactions
app.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find({});
        const balance = transactions.reduce((acc, cur) => {
            return cur.type === 'income' ? acc + cur.amount : acc - cur.amount;
        }, 0);
        res.render('index', { transactions: transactions, balance: balance });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Post route for adding a new transaction
app.post('/', async (req, res) => {
    try {
        const { description, amount, type } = req.body;
        const newTransaction = new Transaction({ description, amount, type });
        await newTransaction.save();
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
