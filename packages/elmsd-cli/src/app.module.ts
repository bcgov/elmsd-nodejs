import { Module } from "@nestjs/common"
import { ConsoleModule } from "nestjs-console"
import { DatabaseModule } from "./database/database.module"

@Module({
    imports: [ConsoleModule, DatabaseModule]
})
export class AppModule {}
