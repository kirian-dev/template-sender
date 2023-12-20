// src/migrations/CreateUserTable.ts

import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1627383278852 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableExists = await queryRunner.hasTable("user");

        if (!tableExists) {
            await queryRunner.createTable(new Table({
                name: "user",
                columns: [
                    { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                    { name: "email", type: "varchar" },
                    { name: "password", type: "varchar" },
                    { name: "createdAt", type: "timestamp", default: "now()" },
                    { name: "updatedAt", type: "timestamp", default: "now()" }
                ]
            }), true);

        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user");
    }
}
