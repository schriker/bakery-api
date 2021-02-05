import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductSlug1612268847857 implements MigrationInterface {
    name = 'ProductSlug1612268847857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "slug" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "slug"`);
    }

}
