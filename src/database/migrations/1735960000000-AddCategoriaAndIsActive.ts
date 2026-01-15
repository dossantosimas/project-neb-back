import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCategoriaAndIsActive1735960000000 implements MigrationInterface {
  name = 'AddCategoriaAndIsActive1735960000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columna categoria
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'categoria',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // Agregar columna is_active
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'is_active',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar columnas
    await queryRunner.dropColumn('users', 'is_active');
    await queryRunner.dropColumn('users', 'categoria');
  }
}
