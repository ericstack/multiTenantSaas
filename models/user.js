export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.UUID,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  });

  User.associate = (models) => {
    User.belongsTo(models.Tenant, {
      foreignKey: "tenant_id",
    });

    User.belongsTo(models.Role, {
      foreignKey: "role_id",
    });
  };

  return User;
};