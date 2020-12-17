import { MigrationInterface, QueryRunner } from 'typeorm';

export class Conversations1608203472153 implements MigrationInterface {
  name = 'Conversations1608203472153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "conversation" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "conversationId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversation_participants_user" ("conversationId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_25e9241137cdb0f2336d267cc99" PRIMARY KEY ("conversationId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4928ef292e3fb48783034b82f7" ON "conversation_participants_user" ("conversationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d93fb1843f96fbdefea37dae8" ON "conversation_participants_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants_user" ADD CONSTRAINT "FK_4928ef292e3fb48783034b82f7a" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants_user" ADD CONSTRAINT "FK_5d93fb1843f96fbdefea37dae86" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation_participants_user" DROP CONSTRAINT "FK_5d93fb1843f96fbdefea37dae86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants_user" DROP CONSTRAINT "FK_4928ef292e3fb48783034b82f7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_5d93fb1843f96fbdefea37dae8"`);
    await queryRunner.query(`DROP INDEX "IDX_4928ef292e3fb48783034b82f7"`);
    await queryRunner.query(`DROP TABLE "conversation_participants_user"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "conversation"`);
  }
}
