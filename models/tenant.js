export default (sequelize, DataTypes) => {
  const Tenant = sequelize.define("Tenant", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subdomain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: "tenants",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  });

  Tenant.associate = (models) => {
    Tenant.hasMany(models.User, { foreignKey: "tenant_id" });
  };

  return Tenant;
};