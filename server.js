import dotenv from 'dotenv';
import app from './app.js';
import { sequelize } from './models/index.js';
dotenv.config();

const PORT = process.env.PORT;

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});