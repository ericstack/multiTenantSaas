import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  'saas_db',
  'postgres',
  'postgres',
  {
    host: 'postgres',
    port: '5432',
    dialect: "postgres",
    logging: false,
  }
);

try {
  await sequelize.authenticate();
  console.log("✅ Database connected!");
} catch (error) {
  console.error("❌ Unable to connect:", error);
}