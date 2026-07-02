const express = require('express');
require('dotenv').config();
const sequelize = require('./config/db'); 
const cors = require('cors');
const usersRouter = require('./routes/users');
const binomersRouter = require('./routes/binomers');
const coinsRouter = require('./routes/coins');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/uploads', express.static('uploads'));
app.use('/binomers', binomersRouter);
app.use('/coins', coinsRouter);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully.');

    await sequelize.sync({ alter: true });
    console.log('Database tables synced.');

    app.listen(PORT, () => {
      console.log(`Server running: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Database connection error: ', error);
  }
};

startServer();