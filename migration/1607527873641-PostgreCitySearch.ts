import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostgreQueryTest1607527873641 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE INDEX document_weights_idx ON city USING GIN (document_with_weights);

    UPDATE city SET document_with_weights = setweight(to_tsvector(coalesce(name)), 'A') || setweight(to_tsvector(coalesce(voivodeship)), 'B') || setweight(to_tsvector(coalesce(district)), 'C');

    CREATE FUNCTION documents_search_trigger() RETURNS trigger AS $$
    begin
    new.document_with_weights :=
        setweight(to_tsvector(coalesce(new.name,'')), 'A') ||
        setweight(to_tsvector(coalesce(new.voivodeship,'')), 'B') ||
        setweight(to_tsvector(coalesce(new.district,'')), 'C');
    return new;
    end
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
        ON city FOR EACH ROW EXECUTE PROCEDURE documents_search_trigger();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
