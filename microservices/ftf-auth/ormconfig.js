module.exports = [
   {
       name: 'default', type: 'mysql',
  host: 'localhost',
  port: 33080,
  username: 'admin',
  password: 'admin',
  database: 'user_db',
  entities: [ __dirname + '/dist/src/domain/entities/*.entity.{js,ts}'],
  subscribers: [],
  logging: ['all'],
  logger: 'advanced-console',
  synchronize: false,
  extra: {
    charset: 'utf8mb4_0900_ai_ci',
    timezone: 'Z',
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
  cli: {
    entitiesDir: 'src/domain'
  }
}
]