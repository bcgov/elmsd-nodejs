import { InvalidArgumentError } from "commander"
import Knex from "knex"
import { Command, Console, createSpinner } from "nestjs-console"
import path from "path"
import Options from "../../common/types/options.type"
import getErrorMessage from "../../common/utils/get-error-message.util"

const opts: Options = {
    dir: {
        flags: "-d, --dir <dir>",
        description: "directory where seeds are stored",
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
    command: "db.seed",
    description: "seed commands"
})
export class SeedCommandService {
    spin = createSpinner()

    @Command({
        command: "make <name>",
        description: "create a named seed",
        options: [opts.dir, opts.ext]
    })
    async makeHandler(name: string, { dir, ext }: Record<string, string>) {
        const knex = Knex({
            client: "pg",
            seeds: {
                directory: path.resolve(dir),
                extension: ext,
                timestampFilenamePrefix: true
            }
        })

        try {
            this.spin.start("Creating seed")
            await knex.seed.make(name)

            this.spin.succeed("Seed created")
        } catch (error) {
            this.spin.fail(`Could not create seed: ${getErrorMessage(error)}`)
        } finally {
            await knex.destroy()
        }
    }

    @Command({
        command: "run",
        description: "run seed files",
        options: [opts.dir, opts.ext, opts.dbName, opts.dbHost, opts.dbPort, opts.dbUser, opts.dbPass]
    })
    async runHandler({ dir, ext, dbName, dbHost, dbPort, dbUser, dbPass }: Record<string, any>) {
        const knex = Knex({
            client: "pg",
            connection: {
                database: dbName,
                host: dbHost,
                port: dbPort,
                user: dbUser,
                password: dbPass
            },
            seeds: {
                directory: path.resolve(dir),
                loadExtensions: [`.${ext}`]
            }
        })

        try {
            this.spin.start("Running seeds")
            await knex.seed.run()

            this.spin.succeed("Seeds applied")
        } catch (error) {
            this.spin.fail(`Could not run seeds: ${getErrorMessage(error)}`)
        } finally {
            await knex.destroy()
        }
    }
}
