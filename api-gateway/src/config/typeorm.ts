import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: process.env.PRIMARY_DB_HOST,
  port: parseInt(process.env.PRIMARY_DB_PORT),
  username: process.env.PRIMARY_DB_USERNAME,
  password: process.env.PRIMARY_DB_PASSWORD,
  database: process.env.PRIMARY_DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ["src/migrations/**"],
  autoLoadEntities: true,
  synchronize: true,
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);