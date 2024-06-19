import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../dbconfig";
import e from "express";

interface tokenAttributes {
  userID: string;
  token: string;
  expiry:number;
}

export interface TokenInput extends Optional<tokenAttributes, 'expiry'>{}
export interface TokenOutput extends Required<tokenAttributes> {}

class Token extends Model<tokenAttributes,TokenInput> implements tokenAttributes {
  public userID!: string;
  public token!: string;
  public expiry!:number;

  public readonly createdAt!: Date;
}

Token.init(
  {
    userID: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiry:{
        type:DataTypes.INTEGER,
        defaultValue:3600
    }
  },
  {
    sequelize:sequelizeConnection,
    tableName:"tokens",
    timestamps:true
  }
);

export default Token