import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../dbconfig";
import { UUID } from "crypto";

interface chatAttributes {
  id: number;
  conversation_id: string;
  sender: string;
  receiver: string;
  message: string;
}

export interface ChatInput extends Optional<chatAttributes, "id"> {}
export interface ChatOutput extends Required<chatAttributes> {}

class CHAT extends Model<chatAttributes, ChatInput> implements chatAttributes {
  public id!: number;
  public conversation_id!: string;
  public sender!: string;
  public receiver!: string;
  public message!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CHAT.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    conversation_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sender: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiver: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "chats",
    timestamps: true,
  }
);

export default CHAT;
