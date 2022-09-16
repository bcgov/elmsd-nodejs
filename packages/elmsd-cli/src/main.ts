#!/usr/bin/env node
import { BootstrapConsole } from "nestjs-console"
import AppModule from "./app.module"

// async function bootstrap() {
//     await CommandFactory.run(AppModule)
// }
// bootstrap()

const bootstrap = new BootstrapConsole({
    module: AppModule,
    useDecorators: true
})

bootstrap.init().then(async (app) => {
    try {
        await app.init()
        await bootstrap.boot()
        await app.close()
    } catch (error) {
        console.error(error)
        await app.close()
        process.exit(1)
    }
})
