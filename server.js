import dotenv from 'dotenv';
import app from './app.js';
import { sequelize } from './src/config/db.js';
dotenv.config();

const PORT = process.env.PORT || 5000;

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});