import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from 'typeorm';

export class MakeDocumentNullableInCoachProfile1768663000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si la columna existe y hacerla nullable
    const table = await queryRunner.getTable('coach_profiles');
    const documentColumn = table?.findColumnByName('document');

    if (documentColumn && !documentColumn.isNullable) {
      await queryRunner.changeColumn(
        'coach_profiles',
        'document',
        new TableColumn({
          name: 'document',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: hacer la columna NOT NULL (solo si no hay valores null)
    const table = await queryRunner.getTable('coach_profiles');
    const documentColumn = table?.findColumnByName('document');

    if (documentColumn && documentColumn.isNullable) {
      await queryRunner.changeColumn(
        'coach_profiles',
        'document',
        new TableColumn({
          name: 'document',
          type: 'varchar',
          isNullable: false,
        }),
      );
    }
  }
}
