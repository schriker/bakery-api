import {MigrationInterface, QueryRunner} from "typeorm";

export class UserPhone1611154389556 implements MigrationInterface {
    name = 'UserPhone1611154389556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    }

}
