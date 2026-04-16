import {
  sequelize,
  Tenant,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
} from "../src/models/index.js";

import { hashPassword } from "../src/utils/hashing.js";

async function seed() {
  const transaction = await sequelize.transaction();

  try {
    console.log("🌱 Seeding database...");

    // 1. Create Permissions
    const permissionsList = [
      "manage_users",
      "create_user",
      "view_users",
      "delete_user",
      "manage_roles",
    ];

    const permissions = await Promise.all(
      permissionsList.map((name) =>
        Permission.create({ name }, { transaction }),
      ),
    );

    // Helper map
    const permissionMap = {};
    permissions.forEach((p) => {
      permissionMap[p.name] = p.id;
    });

    // 2. Create Tenant
    const tenant = await Tenant.create(
      {
        name: "Test Company",
        domain: "test.local",
        status: "active",
      },
      { transaction },
    );

    // 3. Create Roles
    const ownerRole = await Role.create(
      {
        tenant_id: tenant.id,
        name: "Owner",
        description: "Full access",
      },
      { transaction },
    );

    const staffRole = await Role.create(
      {
        tenant_id: tenant.id,
        name: "Staff",
        description: "Limited access",
      },
      { transaction },
    );

    // 4. Assign Permissions to Roles

    // Owner → ALL permissions
    await RolePermission.bulkCreate(
      permissions.map((p) => ({
        role_id: ownerRole.id,
        permission_id: p.id,
      })),
      { transaction },
    );

    // Staff → ONLY view_users
    await RolePermission.create(
      {
        role_id: staffRole.id,
        permission_id: permissionMap["view_users"],
      },
      { transaction },
    );

    // 5. Create Users
    const adminPassword = await hashPassword("password123");
    const staffPassword = await hashPassword("password123");

    const adminUser = await User.create(
      {
        tenant_id: tenant.id,
        email: "admin@test.com",
        password: adminPassword,
        first_name: "Admin",
        last_name: "User",
        status: "active",
      },
      { transaction },
    );

    const staffUser = await User.create(
      {
        tenant_id: tenant.id,
        email: "staff@test.com",
        password: staffPassword,
        first_name: "Staff",
        last_name: "User",
        status: "active",
      },
      { transaction },
    );

    // 6. Assign Roles to Users
    await UserRole.create(
      {
        user_id: adminUser.id,
        role_id: ownerRole.id,
      },
      { transaction },
    );

    await UserRole.create(
      {
        user_id: staffUser.id,
        role_id: staffRole.id,
      },
      { transaction },
    );

    // Commit
    await transaction.commit();

    console.log("✅ Seeding completed!");
    console.log("Admin Login: admin@test.com / password123");
    console.log("Staff Login: staff@test.com / password123");
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Seeding failed:", error);
  } finally {
    await sequelize.close();
  }
}

seed();
