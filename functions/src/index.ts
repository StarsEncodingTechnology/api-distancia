import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "../.env" });

import * as functions from "firebase-functions";
import { SetupServer } from "./server";

(async () => {
  const server = new SetupServer(process.env.PORT);
  await server.init();

  exports.form = functions.https.onRequest(server.getApp);
})();
