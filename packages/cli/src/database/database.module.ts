import { Module } from "@nestjs/common"
import { DatabaseCommandService } from "./commands/database-command.service"
import { MigrateCommandService } from "./commands/migrate-command.service"
import { SeedCommandService } from "./commands/seed-command.service"

@Module({
    providers: [DatabaseCommandService, MigrateCommandService, SeedCommandService]
})
export class DatabaseModule {}
