import {MigrationInterface, QueryRunner} from "typeorm";

export class PhotosUrl1607956004382 implements MigrationInterface {
    name = 'PhotosUrl1607956004382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "photo" ADD "url" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "name"`);
    }

}
