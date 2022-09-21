import { Console } from "nestjs-console"

@Console({
    command: "db",
    description: "database commands"
})
export class DatabaseCommandService {}
