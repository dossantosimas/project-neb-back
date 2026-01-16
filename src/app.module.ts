import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from './env.model';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { CoachesModule } from './coaches/coaches.module';
import { PaymentsModule } from './payments/payments.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { MatchesModule } from './matches/matches.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<Env>) => {
        const databaseUrl = configService.get('DATABASE_URL', { infer: true });
        if (!databaseUrl) {
          throw new Error(
            'DATABASE_URL no está definida en las variables de entorno',
          );
        }
        return {
          type: 'postgres',
          url: databaseUrl,
          ssl: true, // Requerido para Neon
          autoLoadEntities: true,
          synchronize: false, // no es recomendable en producción porque puede borrar datos, mejor usar migrations
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    PlayersModule,
    CoachesModule,
    PaymentsModule,
    TournamentsModule,
    MatchesModule,
    StatisticsModule,
  ],
})
export class AppModule {}
