module.exports = [
   {
       name: 'default', type: 'mysql',
  host: 'mysql_user',
  port: 3306,
  username: 'admin',
  password: 'admin',
  database: 'user_db',
  entities: [ __dirname + '/dist/**/*.entity.{js,ts}'],
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
  }}
]