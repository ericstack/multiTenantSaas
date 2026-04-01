import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sequelize } from '../../../models/index.js';
import { User, Tenant, Role } from '../../../models/index.js';

 const registerUser = async(req, res) => {
  const { company_name, subdomain, email, password } = req.body;

  try {

    //check if required fields is not empty
    if (!company_name || !subdomain || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    //check if tenant with same subdomain exists
    const tenantCheck = await Tenant.findOne({
      where: { subdomain },
    });

    if (tenantCheck) {
      return res.status(400).json({ error: "Tenant with this subdomain already exists" });
    }

    // 1. Create tenant
    const tenantResult = await Tenant.create({
      name: company_name,
      subdomain: subdomain
    });
    
    const tenantId = tenantResult.id;

    // 2. Create admin role if not exists
    let role = await Role.findOne({
      where: { name: 'admin' }
    });

    let roleId;

    if (!role == null) {
      const newRole = await Role.create({ name: 'admin' });
      
      roleId = newRole.id;
    } else {
      roleId = role.id;
    }
    console.log("Admin role created with ID:", role);
    // 3. Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // // 4. Create user
    // const userResult = await User.create({
    //   tenant_id: tenantId,
    //   email: email,
    //   password: hashedPassword,
    //   role_id: roleId
    // });

    // const userId = userResult.id;
    // console.log("User created with ID:", userId);

    res.json({
      message: "Registered successfully",
      // user: {
      //   id: userResult.id,
      //   email: userResult.email,
      //   tenant_id: userResult.tenant_id
      // }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
}

export default registerUser;