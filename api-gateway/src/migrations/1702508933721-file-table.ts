import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialFile1639427750672 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const isTableExist = await queryRunner.hasTable('file');

    if (!isTableExist) {
      await queryRunner.createTable(
        new Table({
          name: 'file',
          columns: [
            { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
            { name: 'name', type: 'varchar' },
            { name: 'pending_emails', type: 'int' },
            { name: 'success_emails', type: 'int', default: 0 },
            { name: 'failed_emails', type: 'int', default: 0 },
            { name: 'userId', type: 'int' },
            { name: 'status', type: 'varchar', default: 'loading' },
            { name: 'endTime', type: 'timestamp', isNullable: true },
            { name: 'emailText', type: 'text' },
            { name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' },
            { name: 'updatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' },
          ],
        }),
        true
      );

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('file')
        .values([
          {
            name: 'Sample File',
            pending_emails: 10,
            userId: 1,
            emailText: 'Sample email text',
            success_emails: 0,
            failed_emails: 0,
            endTime: null,
          },
        ])
        .execute();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('file');
  }
}
