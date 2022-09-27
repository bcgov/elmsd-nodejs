import { InvalidArgumentError } from "commander"
import Knex from "knex"
import { Command, Console, createSpinner } from "nestjs-console"
import path from "path"
import Options from "../../common/types/options.type"
import getErrorMessage from "../../common/utils/get-error-message.util"

const opts: Options = {
    dir: {
        flags: "-d, --dir <dir>",
        description: "directory where migrations are stored",
        required: true
    },
    ext: {
        flags: "-e, --ext <js|ts>",
        description: "extension of the migration file",
        required: true,
        fn: (value: string) => {
            const allowedValues: string[] = ["js", "ts"]
            if (!allowedValues.includes(value)) {
                throw new InvalidArgumentError(`Allowed values are: ${allowedValues.join(", ")}`)
            }

            return value
        }
    },
    table: {
        flags: "-t, --table <table>",
        description: "table where migrations are tracked",
        defaultValue: "_migrations",
        required: true
    },
    dbName: {
        flags: "--db-name <name>",
        description: "database name",
        required: true
    },
    dbHost: {
        flags: "--db-host <host>",
        description: "database host",
        required: true
    },
    dbPort: {
        flags: "--db-port <port>",
        description: "database port",
        required: true
    },
    dbUser: {
        flags: "--db-user <user>",
        description: "database user",
        required: true
    },
    dbPass: {
        flags: "--db-pass <pass>",
        description: "database password",
        required: true
    }
}

@Console({
    command: "db.migrate",
    description: "migration commands"
})
export class MigrateCommandService {
    spin = createSpinner()

    @Command({
        command: "make <name>",
        description: "create a named migration",
        options: [opts.dir, opts.ext, opts.table]
    })
    async makeHandler(name: string, { dir, ext }: Record<string, string>) {
        const knex = Knex({
            client: "pg",
            migrations: {
                directory: path.resolve(dir),
                extension: ext,
                stub: path.resolve(__dirname, `../stubs/migrate/${ext}.stub`)
            }
        })

        try {
            this.spin.start(`Creating migration`)
            await knex.migrate.make(name)

            this.spin.succeed(`Migration created`)
        } catch (error) {
            this.spin.fail(`Could not create migration: ${getErrorMessage(error)}`)
        } finally {
            await knex.destroy()
        }
    }

    @Command({
        command: "latest",
        description: "run next batch of migrations",
        options: [opts.dir, opts.ext, opts.table, opts.dbName, opts.dbHost, opts.dbPort, opts.dbUser, opts.dbPass]
    })
    async latestHandler({ dir, ext, table, dbName, dbHost, dbPort, dbUser, dbPass }: Record<string, any>) {
        const knex = Knex({
            client: "pg",
            connection: {
                database: dbName,
                host: dbHost,
                port: dbPort,
                user: dbUser,
                password: dbPass
            },
            migrations: {
                directory: path.resolve(dir),
                loadExtensions: [`.${ext}`],
                tableName: table
            }
        })

        try {
            this.spin.start("Running next batch of migrations")
            await knex.migrate.latest()
            this.spin.succeed("Migrations applied")
        } catch (error) {
            this.spin.fail(`Could not run next batch of migrations: ${getErrorMessage(error)}`)
        } finally {
            await knex.destroy()
        }
    }

    @Command({
        command: "up",
        description: "run next migration",
        options: [opts.dir, opts.ext, opts.table, opts.dbName, opts.dbHost, opts.dbPort, opts.dbUser, opts.dbPass]
    })
    async upHandler({ dir, ext, table, dbName, dbHost, dbPort, dbUser, dbPass }: Record<string, any>) {
        const knex = Knex({
            client: "pg",
            connection: {
                database: dbName,
                host: dbHost,
                port: dbPort,
                user: dbUser,
                password: dbPass
            },
            migrations: {
                directory: path.resolve(dir),
                loadExtensions: [`.${ext}`],
                tableName: table
            }
        })

        try {
            this.spin.start("Running next migration")
            await knex.migrate.up()
            this.spin.succeed("Migration applied")
        } catch (error) {
            this.spin.fail(`Could not run next migration: ${getErrorMessage(error)}`)
        } finally {
            await knex.destroy()
        }
    }

    @Command({
        command: "rollback",
        description: "undo last batch of migrations",
        options: [
            opts.dir,
            opts.ext,
            opts.table,
            opts.dbName,
            opts.dbHost,
            opts.dbPort,
            opts.dbUser,
            opts.dbPass,
            {
                flags: "--all",
                description: "undo all completed migrations"
            }
        ]
    })
    async rollbackHandler({ all, dir, ext, table, dbName, dbHost, dbPort, dbUser, dbPass }: Record<string, any>) {
        const knex = Knex({
            client: "pg",
            connection: {
                database: dbName,
                host: dbHost,
                port: dbPort,
                user: dbUser,
                password: dbPass
            },
            migrations: {
                directory: path.resolve(dir),
                loadExtensions: [`.${ext}`],
                tableName: table
            }
        })

        try {
            this.spin.start(`Undoing ${all ? "all" : "last batch of"} migrations`)
            await knex.migrate.rollback(undefined, all)
            this.spin.succeed(`Undid ${all ? "all" : "last batch of"} migrations`)
        } catch (error) {
            this.spin.fail(`Could not undo ${all ? "all" : "last batch of"} migrations: ${getErrorMessage(error)}`)
        } finally {
            await knex.destroy()
        }
    }

    @Command({
        command: "down",
        description: "undo last migration",
        options: [opts.dir, opts.ext, opts.table, opts.dbName, opts.dbHost, opts.dbPort, opts.dbUser, opts.dbPass]
    })
    async downHandler({ dir, ext, table, dbName, dbHost, dbPort, dbUser, dbPass }: Record<string, any>) {
        const knex = Knex({
            client: "pg",
            connection: {
                database: dbName,
                host: dbHost,
                port: dbPort,
                user: dbUser,
                password: dbPass
            },
            migrations: {
                directory: path.resolve(dir),
                loadExtensions: [`.${ext}`],
                tableName: table
            }
        })

        try {
            this.spin.start("Undoing last migration")
            await knex.migrate.down()
            this.spin.succeed("Undid last migration")
        } catch (error) {
            this.spin.fail(`Could not undo last migration: ${getErrorMessage(error)}`)
        } finally {
            await knex.destroy()
        }
    }
}
