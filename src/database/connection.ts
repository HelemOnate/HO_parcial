import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

let dbConfig: any = {};

switch (process.env.DB_DIALECT) {
  case 'postgres':
    dbConfig = {
      database: process.env.PG_NAME || 'parcial_oh',
      username: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASS || 'password',
      host: process.env.PG_HOST || 'localhost',
      port: Number(process.env.PG_PORT) || 5432,
      dialect: 'postgres',
      timezone: process.env.DB_TIMEZONE || 'America/Bogota',
    };
    break;
  case 'mssql':
    dbConfig = {
      database: process.env.MSSQL_NAME || 'parcial_oh',
      username: process.env.MSSQL_USER || 'sa',
      password: process.env.MSSQL_PASS || 'password',
      host: process.env.MSSQL_HOST || 'localhost',
      port: Number(process.env.MSSQL_PORT) || 1433,
      dialect: 'mssql',
      timezone: process.env.DB_TIMEZONE || 'America/Bogota',
      dialectOptions: {
        options: {
          encrypt: false,
        }
      }
    };
    break;
  case 'oracle':
    dbConfig = {
      database: process.env.ORACLE_NAME || 'parcial_oh',
      username: process.env.ORACLE_USER || 'system',
      password: process.env.ORACLE_PASS || 'password',
      host: process.env.ORACLE_HOST || 'localhost',
      port: Number(process.env.ORACLE_PORT) || 1521,
      dialect: 'oracle',
      dialectOptions: {
        connectString: `${process.env.ORACLE_HOST || 'localhost'}:${process.env.ORACLE_PORT || 1521}/${process.env.ORACLE_SID || 'XE'}`
      },
      timezone: process.env.DB_TIMEZONE || 'America/Bogota',
    };
    break;
  case 'sqlite':
    dbConfig = {
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../database.sqlite'),
      logging: false
    };
    break;
  default: // mysql
    dbConfig = {
      database: process.env.MYSQL_NAME || 'parcial_oh',
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASS || 'password',
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      dialect: 'mysql',
      timezone: process.env.DB_TIMEZONE || 'America/Bogota',
    };
}

export const sequelize = new Sequelize(
  dbConfig.database || 'parcial_oh',
  dbConfig.username || 'root',
  dbConfig.password || 'password',
  dbConfig
);
