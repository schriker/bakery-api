import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueCity1610956836978 implements MigrationInterface {
  name = 'UniqueCity1610956836978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "city" ADD CONSTRAINT "UQ_PLACE" UNIQUE ("name", "district", "voivodeship")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "city" DROP CONSTRAINT "UQ_PLACE"`);
  }
}
