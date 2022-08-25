import { SetupServer } from "./server";
import config from "config"
import logger from "./logger";


enum ExitStatus {
    Failure = 1,
    Success = 0
}

(async () => {
    // parte inicial de tudo 
    try{
    const server = new SetupServer(config.get('App.port'));
    await server.init();
    server.start();


    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGURG'];

    exitSignals.map((sig) => process.on(sig, async() => {
        try{
            await server.close();
            process.exit(ExitStatus.Success);
        }catch (e) {
            logger.error(`App exited with error: ${e}`)
            process.exit(ExitStatus.Failure)
        }
    }))

}catch(e){
    logger.error(`App exited with error: ${e}`)
    process.exit(ExitStatus.Failure);
}
})();