export default (sequelize, DataTypes) => {
  const Permission = sequelize.define("Permission", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "permissions",
    timestamps: false,
  });

  Permission.associate = (models) => {
    Permission.belongsToMany(models.Role, {
      through: "role_permissions",
      foreignKey: "permission_id",
    });
  };

  return Permission;
};