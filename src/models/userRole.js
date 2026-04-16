export default (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    "UserRole",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "user_roles",
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "role_id"],
        },
      ],
    },
  );

  return UserRole;
};
