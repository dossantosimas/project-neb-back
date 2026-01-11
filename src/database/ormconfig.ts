import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

config();

// Detectar si estamos en producción (archivos compilados) o desarrollo
// En producción, el código está en dist/, en desarrollo está en src/
const isProduction = process.env.NODE_ENV === 'production' || !fs.existsSync(path.join(__dirname, '../..', 'src'));

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  entities: isProduction ? ['./dist/**/*.entity.js'] : ['./src/**/*.entity.ts'],
  migrations: isProduction ? ['./dist/database/migrations/*.js'] : ['./src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
});