import { Module } from "@nestjs/common"
import { ConsoleModule } from "nestjs-console"

@Module({
    imports: [ConsoleModule]
})
export default class AppModule {}
