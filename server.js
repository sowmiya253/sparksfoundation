// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
mongoose.connect('mongodb://localhost:27017/customer-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

// Customer Schema
const customerSchema = new mongoose.Schema({
    name: String,
    email: String
});

const Customer = mongoose.model('Customer', customerSchema);

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        console.error('Error getting customers:', err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/api/customers', async (req, res) => {
    try {
        const { name, email } = req.body;
        const customer = new Customer({ name, email });
        await customer.save();
        res.json(customer);
    } catch (err) {
        console.error('Error creating customer:', err.message);
        res.status(500).send('Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
