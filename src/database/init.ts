import { sequelize } from './connection';
import { User } from '../models/authorization/User';
import { Role } from '../models/authorization/Role';
import { RoleUser } from '../models/authorization/RoleUser';
import { Resource } from '../models/authorization/Resource';
import { ResourceRole } from '../models/authorization/ResourceRole';
import { RefreshToken } from '../models/authorization/RefreshToken';
import { HO_Breed } from '../models/HO_Breed';
import { HO_Dog } from '../models/HO_Dog';

export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🔄 Initializing database...');
    
    // Test the connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized successfully');
    
    // Log all defined models
    console.log('📋 Available models:', Object.keys(sequelize.models));
    
    // Create default roles
    await createDefaultRoles();
    
    // Create default admin user
    await createDefaultUser();
    
    console.log('🎉 Database initialization completed successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function createDefaultRoles(): Promise<void> {
  try {
    const roles = [
      { name: 'ADMIN', description: 'Administrador con acceso completo' },
      { name: 'USER', description: 'Usuario regular con permisos básicos' },
      { name: 'MODERATOR', description: 'Moderador con permisos intermedios' },
      { name: 'VIEWER', description: 'Solo visualización, sin permisos de edición' }
    ];

    for (const roleData of roles) {
      const existingRole = await Role.findOne({ where: { name: roleData.name } });
      
      if (!existingRole) {
        await Role.create({
          name: roleData.name,
          is_active: 'ACTIVE'
        });
        console.log(`🔐 Role created: ${roleData.name}`);
      } else {
        console.log(`🔐 Role already exists: ${roleData.name}`);
      }
    }
  } catch (error) {
    console.error('❌ Error creating default roles:', error);
  }
}

async function createDefaultUser(): Promise<void> {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@parcialoh.com' } });
    
    if (!existingAdmin) {
      // Create admin user
      const adminUser = await User.create({
        username: 'Admin',
        email: 'admin@parcialoh.com',
        password: 'admin123',
        is_active: 'ACTIVE',
        avatar: null
      });
      
      console.log('👤 Default admin user created:', adminUser.email);
    } else {
      console.log('👤 Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default user:', error);
  }
}
