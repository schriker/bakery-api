import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductDeliveryOptions1607700766633 implements MigrationInterface {
    name = 'ProductDeliveryOptions1607700766633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "delivery" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product" ADD "shipping" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product" ADD "pickup" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "pickup"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "shipping"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "delivery"`);
    }

}
