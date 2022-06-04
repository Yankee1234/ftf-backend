module.exports = [
   {
       name: 'default', type: 'mysql',
  host: 'localhost',
  port: 33070,
  username: 'admin',
  password: 'admin',
  database: 'nestjs',
  entities: [ __dirname + '/dist/**/*.entity.{js,ts}'],
  migrations: [],
  subscribers: [],
  logging: ['all'],
  logger: 'advanced-console',
  synchronize: false,}
]