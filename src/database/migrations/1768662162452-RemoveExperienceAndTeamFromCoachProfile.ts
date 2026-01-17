import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from 'typeorm';

export class RemoveExperienceAndTeamFromCoachProfile1768662162452
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar columna experience
    await queryRunner.dropColumn('coach_profiles', 'experience');

    // Eliminar columna team
    await queryRunner.dropColumn('coach_profiles', 'team');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaurar columna experience
    await queryRunner.addColumn(
      'coach_profiles',
      new TableColumn({
        name: 'experience',
        type: 'int',
        isNullable: false,
      }),
    );

    // Restaurar columna team
    await queryRunner.addColumn(
      'coach_profiles',
      new TableColumn({
        name: 'team',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }
}
