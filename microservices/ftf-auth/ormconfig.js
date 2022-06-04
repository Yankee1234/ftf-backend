module.exports = [
   {
       name: 'user_default', type: 'mysql',
  host: 'localhost',
  port: 33080,
  username: 'admin',
  password: 'admin',
  database: 'user_db',
  entities: [ __dirname + '/dist/**/*.entity.{js,ts}'],
  migrations: [],
  subscribers: [],
  logging: ['all'],
  logger: 'advanced-console',
  synchronize: false,}
]