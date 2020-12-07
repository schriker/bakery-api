import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductIsPublished1607333168105 implements MigrationInterface {
    name = 'ProductIsPublished1607333168105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "count" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "isPublished" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "isPublished"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "count"`);
    }

}
