import { env } from "./config/env.js";
import { sequelize } from "./database/sequelize.js";
import { app } from "./app.js";

await sequelize.authenticate();

app.listen(env.PORT, () => {
  console.log(`API running on ${env.API_BASE_URL}`);
});
