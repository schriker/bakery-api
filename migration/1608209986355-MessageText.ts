import {MigrationInterface, QueryRunner} from "typeorm";

export class MessageText1608209986355 implements MigrationInterface {
    name = 'MessageText1608209986355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "text" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "text"`);
    }

}
