export default (sequelize, DataTypes) => {
  return sequelize.define(
    "AuditLog",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: DataTypes.UUID,
      action: DataTypes.STRING,
      entity: DataTypes.STRING,
      entity_id: DataTypes.UUID,
      metadata: DataTypes.JSONB,
    },
    {
      tableName: "audit_logs",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    },
  );
};
