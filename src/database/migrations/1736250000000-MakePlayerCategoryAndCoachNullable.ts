import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from 'typeorm';

export class MakePlayerCategoryAndCoachNullable1736250000000
  implements MigrationInterface
{
  name = 'MakePlayerCategoryAndCoachNullable1736250000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hacer category_id nullable
    await queryRunner.changeColumn(
      'players',
      'category_id',
      new TableColumn({
        name: 'category_id',
        type: 'int',
        isNullable: true,
      }),
    );

    // Hacer coach_id nullable
    await queryRunner.changeColumn(
      'players',
      'coach_id',
      new TableColumn({
        name: 'coach_id',
        type: 'int',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir category_id a NOT NULL (requiere que todos los registros tengan valor)
    await queryRunner.query(
      `UPDATE "players" SET "category_id" = 1 WHERE "category_id" IS NULL`,
    );
    await queryRunner.changeColumn(
      'players',
      'category_id',
      new TableColumn({
        name: 'category_id',
        type: 'int',
        isNullable: false,
      }),
    );

    // Revertir coach_id a NOT NULL (requiere que todos los registros tengan valor)
    await queryRunner.query(
      `UPDATE "players" SET "coach_id" = 1 WHERE "coach_id" IS NULL`,
    );
    await queryRunner.changeColumn(
      'players',
      'coach_id',
      new TableColumn({
        name: 'coach_id',
        type: 'int',
        isNullable: false,
      }),
    );
  }
}
