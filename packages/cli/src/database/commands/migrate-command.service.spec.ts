/* eslint-disable import/no-extraneous-dependencies */
import { Test, TestingModule } from "@nestjs/testing"
import { MigrateCommandService } from "./migrate-command.service"

describe("MigrateCommandService", () => {
    let service: MigrateCommandService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MigrateCommandService]
        }).compile()

        service = module.get<MigrateCommandService>(MigrateCommandService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })
})
