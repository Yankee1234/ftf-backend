const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

function loadFile(filename) {
  dotenv.config({ path: filename });
}

loadFile('.env');
const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_USER_PORT, MYSQL_USER_HOST } = process.env;

module.exports = [
   {
        name: 'default', type: 'postgres',
  host: MYSQL_USER_HOST,
  port: MYSQL_USER_PORT,
  username: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  entities: [ __dirname + '/dist/domain/**/*.entity.{js,ts}'],
  migrations: [__dirname + '/dist/domain/typeorm-migrations/*{.ts,.js}'],
  subscribers: [],
  logging: ['all'],
  logger: 'advanced-console',
  migrationsTableName: 'migrations_typeorm',
  synchronize: false,
  extra: {
    charset: 'utf8mb4_0900_ai_ci',
    timezone: 'Z',
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
  cli: {
    entitiesDir: 'src/domain/entities',
    migrationsDir: 'src/domain/typeorm-migrations',
  }
}
]