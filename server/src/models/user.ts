import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../dbconfig";
import { UUID } from "crypto";

interface userAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface UserInput extends Optional<userAttributes, "id"> {}
export interface UserOutput extends Required<userAttributes> {}

class USER extends Model<userAttributes, UserInput> implements userAttributes {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

USER.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "users",
    timestamps: true,
  }
);

export default USER;