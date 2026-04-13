export default (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "roles",
    timestamps: false,
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: "role_id",
    });

    Role.belongsToMany(models.Permission, {
      through: "role_permissions",
      foreignKey: "role_id",
    });
  };

  return Role;
};