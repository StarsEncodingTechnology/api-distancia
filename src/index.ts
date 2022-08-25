import { SetupServer } from "./server";
import config from "config"


(async () => {
    // parte inicial de tudo 
    const server = new SetupServer(config.get('App.port'));
    await server.init();
    server.start();
})();