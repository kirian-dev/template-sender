import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTimestampsToUser1702507595139 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'user', 
            new TableColumn({
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            })
        );

        await queryRunner.addColumn(
            'user', 
            new TableColumn({
                name: 'updatedAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', 'createdAt');
        await queryRunner.dropColumn('user', 'updatedAt');
    }

}
