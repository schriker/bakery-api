import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserVerification1608130135154 implements MigrationInterface {
  name = 'UserVerification1608130135154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isVerified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "verificationToken" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordResetToken" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "passwordResetToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "verificationToken"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isVerified"`);
  }
}
