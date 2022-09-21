/* eslint-disable import/no-extraneous-dependencies */
import { Test, TestingModule } from "@nestjs/testing"
import { DatabaseCommandService } from "./database-command.service"

describe("DatabaseCommandService", () => {
    let service: DatabaseCommandService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DatabaseCommandService]
        }).compile()

        service = module.get<DatabaseCommandService>(DatabaseCommandService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })
})
