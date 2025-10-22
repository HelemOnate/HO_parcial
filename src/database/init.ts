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
    
    // Create default resources and permissions
    await createDefaultResources();
    
    // Assign permissions to roles
    await assignRolePermissions();
    
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

async function createDefaultResources(): Promise<void> {
  try {
    const resources = [
      // Breed resources
      { path: '/api/breeds', method: 'GET', description: 'Listar todas las razas' },
      { path: '/api/breeds/:id', method: 'GET', description: 'Obtener raza por ID' },
      { path: '/api/breeds', method: 'POST', description: 'Crear nueva raza' },
      { path: '/api/breeds/:id', method: 'PUT', description: 'Actualizar raza' },
      { path: '/api/breeds/:id', method: 'DELETE', description: 'Eliminar raza' },
      
      // Dog resources
      { path: '/api/dogs', method: 'GET', description: 'Listar todos los perros' },
      { path: '/api/dogs/:id', method: 'GET', description: 'Obtener perro por ID' },
      { path: '/api/dogs', method: 'POST', description: 'Crear nuevo perro' },
      { path: '/api/dogs/:id', method: 'PUT', description: 'Actualizar perro' },
      { path: '/api/dogs/:id', method: 'DELETE', description: 'Eliminar perro' },
      
      // User management resources
      { path: '/api/users', method: 'GET', description: 'Listar todos los usuarios' },
      { path: '/api/users/:id', method: 'GET', description: 'Obtener usuario por ID' },
      { path: '/api/users/:id', method: 'PUT', description: 'Actualizar usuario' },
      { path: '/api/users/:id', method: 'DELETE', description: 'Eliminar usuario' },
      
      // Role management resources
      { path: '/api/roles', method: 'GET', description: 'Listar todos los roles' },
      { path: '/api/roles', method: 'POST', description: 'Crear nuevo rol' },
      { path: '/api/roles/:id', method: 'PUT', description: 'Actualizar rol' },
      { path: '/api/roles/:id', method: 'DELETE', description: 'Eliminar rol' }
    ];

    for (const resourceData of resources) {
      const existingResource = await Resource.findOne({ 
        where: { 
          path: resourceData.path, 
          method: resourceData.method 
        } 
      });
      
      if (!existingResource) {
        await Resource.create({
          path: resourceData.path,
          method: resourceData.method,
          description: resourceData.description,
          is_active: 'ACTIVE'
        });
        console.log(`🔒 Resource created: ${resourceData.method} ${resourceData.path}`);
      }
    }
  } catch (error) {
    console.error('❌ Error creating default resources:', error);
  }
}

async function assignRolePermissions(): Promise<void> {
  try {
    // Get all roles and resources
    const adminRole = await Role.findOne({ where: { name: 'ADMIN' } });
    const moderatorRole = await Role.findOne({ where: { name: 'MODERATOR' } });
    const userRole = await Role.findOne({ where: { name: 'USER' } });
    const viewerRole = await Role.findOne({ where: { name: 'VIEWER' } });

    const allResources = await Resource.findAll();

    if (adminRole) {
      // ADMIN: Acceso completo a todo
      for (const resource of allResources) {
        const exists = await ResourceRole.findOne({
          where: { role_id: adminRole.id, resource_id: resource.id }
        });
        if (!exists) {
          await ResourceRole.create({
            role_id: adminRole.id,
            resource_id: resource.id,
            is_active: 'ACTIVE'
          });
        }
      }
      console.log('🔐 ADMIN permissions: Full access to all resources');
    }

    if (moderatorRole) {
      // MODERATOR: Puede leer todo, crear/actualizar breeds y dogs, no puede eliminar usuarios ni roles
      const moderatorPermissions = allResources.filter(r => 
        !r.path.includes('/api/users') && !r.path.includes('/api/roles') || 
        (r.path.includes('/api/users') && r.method === 'GET') ||
        (r.path.includes('/api/roles') && r.method === 'GET')
      );
      
      for (const resource of moderatorPermissions) {
        const exists = await ResourceRole.findOne({
          where: { role_id: moderatorRole.id, resource_id: resource.id }
        });
        if (!exists) {
          await ResourceRole.create({
            role_id: moderatorRole.id,
            resource_id: resource.id,
            is_active: 'ACTIVE'
          });
        }
      }
      console.log('🔐 MODERATOR permissions: Manage breeds/dogs, view users/roles');
    }

    if (userRole) {
      // USER: Puede leer y crear breeds/dogs, no puede eliminar ni gestionar usuarios/roles
      const userPermissions = allResources.filter(r => 
        (r.path.includes('/api/breeds') || r.path.includes('/api/dogs')) && 
        (r.method === 'GET' || r.method === 'POST' || r.method === 'PUT')
      );
      
      for (const resource of userPermissions) {
        const exists = await ResourceRole.findOne({
          where: { role_id: userRole.id, resource_id: resource.id }
        });
        if (!exists) {
          await ResourceRole.create({
            role_id: userRole.id,
            resource_id: resource.id,
            is_active: 'ACTIVE'
          });
        }
      }
      console.log('🔐 USER permissions: Create/read/update breeds and dogs');
    }

    if (viewerRole) {
      // VIEWER: Solo lectura de breeds y dogs
      const viewerPermissions = allResources.filter(r => 
        (r.path.includes('/api/breeds') || r.path.includes('/api/dogs')) && 
        r.method === 'GET'
      );
      
      for (const resource of viewerPermissions) {
        const exists = await ResourceRole.findOne({
          where: { role_id: viewerRole.id, resource_id: resource.id }
        });
        if (!exists) {
          await ResourceRole.create({
            role_id: viewerRole.id,
            resource_id: resource.id,
            is_active: 'ACTIVE'
          });
        }
      }
      console.log('🔐 VIEWER permissions: Read-only access to breeds and dogs');
    }
  } catch (error) {
    console.error('❌ Error assigning role permissions:', error);
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
      
      // Assign ADMIN role to the admin user
      const adminRole = await Role.findOne({ where: { name: 'ADMIN' } });
      if (adminRole) {
        await RoleUser.create({
          user_id: adminUser.id,
          role_id: adminRole.id,
          is_active: 'ACTIVE'
        });
      }
      
      console.log('👤 Default admin user created:', adminUser.email);
    } else {
      console.log('👤 Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default user:', error);
  }
}
