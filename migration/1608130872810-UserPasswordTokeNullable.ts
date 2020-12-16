import {MigrationInterface, QueryRunner} from "typeorm";

export class UserPasswordTokeNullable1608130872810 implements MigrationInterface {
    name = 'UserPasswordTokeNullable1608130872810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordResetToken" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."passwordResetToken" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."passwordResetToken" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordResetToken" SET NOT NULL`);
    }

}
