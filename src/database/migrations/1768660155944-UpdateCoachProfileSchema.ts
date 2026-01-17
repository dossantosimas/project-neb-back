import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class UpdateCoachProfileSchema1768660155944
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Agregar columnas a coach_profiles
    await queryRunner.addColumn(
      'coach_profiles',
      new TableColumn({
        name: 'first_name',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'coach_profiles',
      new TableColumn({
        name: 'last_name',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'coach_profiles',
      new TableColumn({
        name: 'document_type',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'coach_profiles',
      new TableColumn({
        name: 'document',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // 2. Crear tabla intermedia coach_profile_categories
    await queryRunner.createTable(
      new Table({
        name: 'coach_profile_categories',
        columns: [
          {
            name: 'coach_profile_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'category_id',
            type: 'int',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    // 3. Crear Foreign Keys para coach_profile_categories
    await queryRunner.createForeignKey(
      'coach_profile_categories',
      new TableForeignKey({
        columnNames: ['coach_profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'coach_profiles',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'coach_profile_categories',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'CASCADE',
      }),
    );

    // 4. Crear índices para mejorar el rendimiento
    await queryRunner.createIndex(
      'coach_profile_categories',
      new TableIndex({
        name: 'IDX_coach_profile_categories_coach_profile_id',
        columnNames: ['coach_profile_id'],
      }),
    );

    await queryRunner.createIndex(
      'coach_profile_categories',
      new TableIndex({
        name: 'IDX_coach_profile_categories_category_id',
        columnNames: ['category_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.dropIndex(
      'coach_profile_categories',
      'IDX_coach_profile_categories_category_id',
    );
    await queryRunner.dropIndex(
      'coach_profile_categories',
      'IDX_coach_profile_categories_coach_profile_id',
    );

    // Eliminar Foreign Keys
    const coachProfileCategoriesTable = await queryRunner.getTable(
      'coach_profile_categories',
    );
    if (coachProfileCategoriesTable) {
      const foreignKeys = coachProfileCategoriesTable.foreignKeys;
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey(
          'coach_profile_categories',
          foreignKey,
        );
      }
    }

    // Eliminar tabla intermedia
    await queryRunner.dropTable('coach_profile_categories', true);

    // Eliminar columnas de coach_profiles
    await queryRunner.dropColumn('coach_profiles', 'document');
    await queryRunner.dropColumn('coach_profiles', 'document_type');
    await queryRunner.dropColumn('coach_profiles', 'last_name');
    await queryRunner.dropColumn('coach_profiles', 'first_name');
  }
}
