import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConversationProduct1609313647324 implements MigrationInterface {
  name = 'ConversationProduct1609313647324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD "productId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD CONSTRAINT "FK_85c39e2d694cd46df2c78576072" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP CONSTRAINT "FK_85c39e2d694cd46df2c78576072"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP COLUMN "productId"`,
    );
  }
}
