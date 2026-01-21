import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateProfileCategoriesJoinTable1737600000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Crear tabla puente (many-to-many) entre profiles y categories
    await queryRunner.createTable(
      new Table({
        name: 'profile_categories',
        columns: [
          {
            name: 'profile_id',
            type: 'int',
            isNullable: false,
            isPrimary: true,
          },
          {
            name: 'category_id',
            type: 'int',
            isNullable: false,
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'profile_categories',
      new TableForeignKey({
        columnNames: ['profile_id'],
        referencedTableName: 'profiles',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'profile_categories',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // 2) Migrar datos existentes desde profiles.categoria_id (si existe)
    const profilesTable = await queryRunner.getTable('profiles');
    const hasCategoriaId = !!profilesTable?.findColumnByName('categoria_id');

    if (hasCategoriaId) {
      await queryRunner.query(
        `INSERT INTO "profile_categories" ("profile_id", "category_id")
         SELECT "id", "categoria_id"
         FROM "profiles"
         WHERE "categoria_id" IS NOT NULL`,
      );

      // 3) Eliminar FK y columna antigua
      const fkCategoriaId = profilesTable?.foreignKeys.find((fk) =>
        fk.columnNames.includes('categoria_id'),
      );
      if (fkCategoriaId) {
        await queryRunner.dropForeignKey('profiles', fkCategoriaId);
      }

      await queryRunner.dropColumn('profiles', 'categoria_id');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1) Restaurar columna categoria_id en profiles (nullable)
    const profilesTable = await queryRunner.getTable('profiles');
    const hasCategoriaId = !!profilesTable?.findColumnByName('categoria_id');

    if (!hasCategoriaId) {
      await queryRunner.query(
        `ALTER TABLE "profiles" ADD COLUMN "categoria_id" int NULL`,
      );

      await queryRunner.createForeignKey(
        'profiles',
        new TableForeignKey({
          columnNames: ['categoria_id'],
          referencedTableName: 'categories',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
        }),
      );

      // Tomar 1 categoría por perfil (si tenía varias, se queda con la menor)
      await queryRunner.query(
        `UPDATE "profiles" p
         SET "categoria_id" = pc."category_id"
         FROM (
           SELECT "profile_id", MIN("category_id") AS "category_id"
           FROM "profile_categories"
           GROUP BY "profile_id"
         ) pc
         WHERE p."id" = pc."profile_id"`,
      );
    }

    // 2) Eliminar tabla puente
    await queryRunner.dropTable('profile_categories', true);
  }
}

