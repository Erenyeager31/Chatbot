import { Dialect, Sequelize } from "sequelize";
import { config } from "dotenv";
config()

const dbName = process.env.DATABASE as string;
const dbUser = process.env.USER as string;
const dbHost = process.env.HOST;
const dbDriver = process.env.DB_DRIVER as "mysql" | "postgres" | "sqlite" | "mariadb" | "mssql" | "db2" | "snowflake" | "oracle";
const dbPassword = process.env.PASSWORD as string ;
const dbport = process.env.DBPORT ? parseInt(process.env.DBPORT) : undefined;

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port:dbport,
  dialect: dbDriver,
});

export default sequelizeConnection;
