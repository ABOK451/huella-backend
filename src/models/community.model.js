import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { User } from "./user.model.js";

export const CommunityPost = sequelize.define("CommunityPost", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Relación con usuario
User.hasMany(CommunityPost, { foreignKey: "userId" });
CommunityPost.belongsTo(User, { foreignKey: "userId" });
