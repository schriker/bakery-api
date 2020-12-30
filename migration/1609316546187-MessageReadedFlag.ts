import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessageReadedFlag1609316546187 implements MigrationInterface {
  name = 'MessageReadedFlag1609316546187';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" ADD "readed" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "readed"`);
  }
}
