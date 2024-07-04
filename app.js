const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/UserRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

connectDB();

app.use(bodyParser.json());
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));