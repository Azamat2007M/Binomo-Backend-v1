const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const usersRouter = require('./routes/users');
const binomersRouter = require('./routes/binomers');
const coinsRouter = require('./routes/coins');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/uploads', express.static('uploads'));
app.use('/binomers', binomersRouter)
app.use('/coins', coinsRouter)
mongoose.set('strictQuery', true);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Database connection error: ', error);
  }
};

startServer();