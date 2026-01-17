import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from 'typeorm';

export class AddFamilyNameToPlayers1736400000000
  implements MigrationInterface
{
  name = 'AddFamilyNameToPlayers1736400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si la columna ya existe antes de agregarla
    const table = await queryRunner.getTable('players');
    const column = table?.findColumnByName('family_name');

    if (!column) {
      // Agregar columna family_name a la tabla players
      await queryRunner.addColumn(
        'players',
        new TableColumn({
          name: 'family_name',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Verificar si la columna existe antes de eliminarla
    const table = await queryRunner.getTable('players');
    const column = table?.findColumnByName('family_name');

    if (column) {
      // Eliminar columna family_name de la tabla players
      await queryRunner.dropColumn('players', 'family_name');
    }
  }
}
