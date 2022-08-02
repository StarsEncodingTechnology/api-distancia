import { SetupServer } from "./server";

(async (): Promise<void> => {
    const server = new SetupServer(Number.parseInt(process.env["PORT"]));
    await server.init();
    server.start();
    
})