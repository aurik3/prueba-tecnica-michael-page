import { sequelize } from "./sequelize.js";
import "./models.js";

await sequelize.sync({ alter: true });
await sequelize.close();
