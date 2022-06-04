module.exports = [
   {
       name: 'user_default', type: 'mysql',
  host: 'mysql_user',
  port: 3306,
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