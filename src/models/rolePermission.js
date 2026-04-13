export default (sequelize, DataTypes) => {
  const RolePermission = sequelize.define("RolePermission", {
    role_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    permission_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  }, {
    tableName: "role_permissions",
    timestamps: false,
  });

  return RolePermission;
};