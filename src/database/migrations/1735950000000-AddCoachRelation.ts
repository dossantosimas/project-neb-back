import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddCoachRelation1735950000000 implements MigrationInterface {
  name = 'AddCoachRelation1735950000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columna coach_id
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'coach_id',
        type: 'int',
        isNullable: true,
      }),
    );

    // Crear foreign key
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['coach_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Obtener la foreign key para eliminarla
    const table = await queryRunner.getTable('users');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('coach_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('users', foreignKey);
      }
    }

    // Eliminar columna
    await queryRunner.dropColumn('users', 'coach_id');
  }
}
