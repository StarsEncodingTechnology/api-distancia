import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "../.env" });

import { SetupServer } from "./server";

(async () => {
  const server = new SetupServer(process.env.PORT);
  await server.init();
  server.start();
})();
