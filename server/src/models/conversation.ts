import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../dbconfig";

interface conversationAttributes {
  id: string;
  user_id:string;
  topic:string;
}

export interface ChatInput extends Optional<conversationAttributes, "id"> {}
export interface ChatOutput extends Required<conversationAttributes> {}

class CONVERSATION extends Model<conversationAttributes, ChatInput> implements conversationAttributes {
  public id!: string;
  public user_id!: string;
  public topic!:string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CONVERSATION.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "conversation",
    timestamps: true,
  }
);

export default CONVERSATION;