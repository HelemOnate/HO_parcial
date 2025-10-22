import { Request, Response } from 'express';
import { User } from '../models/authorization/User';
import { RefreshToken } from '../models/authorization/RefreshToken';
import { Role } from '../models/authorization/Role';
import { RoleUser } from '../models/authorization/RoleUser';
import bcrypt from 'bcryptjs';

export class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, username, email, password, is_active, avatar, role } = req.body;
      
      // Usar 'name' si se proporciona, sino usar 'username'
      const finalUsername = name || username;
      
      if (!finalUsername || !email || !password) {
        res.status(400).json({ error: 'Faltan campos requeridos: name/username, email, password' });
        return;
      }

      // Encriptar la contraseña manualmente para asegurar que se hace correctamente
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user_interface: User = await User.create({ 
        username: finalUsername, 
        email, 
        password: hashedPassword, 
        is_active: is_active || "ACTIVE", 
        avatar 
      });

      // Determinar el rol a asignar (el especificado o USER por defecto)
      const roleName = role || 'USER';
      console.log(`Attempting to assign role: ${roleName}`);

      // Buscar el rol especificado o crear USER por defecto
      let targetRole = await Role.findOne({ where: { name: roleName, is_active: 'ACTIVE' } });
      
      if (!targetRole) {
        if (roleName === 'USER') {
          console.log('Creating default USER role...');
          targetRole = await Role.create({ name: 'USER', is_active: 'ACTIVE' });
          console.log('Default USER role created:', targetRole.id);
        } else {
          // Si el rol especificado no existe, devolver error
          res.status(400).json({ error: `El rol '${roleName}' no existe` });
          return;
        }
      } else {
        console.log(`Found existing role '${roleName}':`, targetRole.id);
      }

      // Asignar el rol al usuario
      const roleAssignment = await RoleUser.create({
        user_id: user_interface.id,
        role_id: targetRole.id,
        is_active: "ACTIVE"
      });
      console.log('Role assigned to user:', roleAssignment.id, 'User:', user_interface.id, 'Role:', targetRole.name);
      
      const token = user_interface.generateToken();
      const { token: refreshToken, expiresAt } = user_interface.generateRefreshToken();

      // Crear refresh token
      await RefreshToken.create({
        user_id: user_interface.id,
        token: refreshToken,
        device_info: req.headers['user-agent'] || 'unknown',
        is_valid: "ACTIVE",
        expires_at: expiresAt
      });

      res.status(201).json({ 
        user: user_interface, 
        token, 
        refreshToken 
      });
    } catch (error: any) {
      console.error('Error en registro:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'El email ya está registrado' });
      } else {
        res.status(500).json({ error: 'Error al registrar el usuario', details: error.message });
      }
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validar que se proporcionen email y password
      if (!email || !password) {
        res.status(400).json({ error: 'Email y contraseña son requeridos' });
        return;
      }

      const user: User | null = await User.findOne(
        { 
          where: { 
            email,
            is_active: "ACTIVE" 
          } 
      });
      
      if (!user) {
        console.log(`Login attempt failed - User not found for email: ${email}`);
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }

      console.log(`User found: ${user.email}, ID: ${user.id}, Username: ${user.username}`);
      console.log(`User object:`, JSON.stringify(user, null, 2));
      console.log(`User password field exists:`, !!user.password, `Length:`, user.password?.length);
      console.log(`Direct access test - email: ${user.getDataValue('email')}, password exists: ${!!user.getDataValue('password')}`);
      
      const passwordValid = await user.checkPassword(password);
      
      if (!passwordValid) {
        console.log(`Login attempt failed - Invalid password for user: ${email}`);
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }

      const token = user.generateToken();
      const { token: refreshToken, expiresAt } = user.generateRefreshToken();

      // Crear un nuevo registro en RefreshToken
      await RefreshToken.create({
        user_id: user.id,
        token: refreshToken,
        device_info: req.headers['user-agent'] || 'unknown',
        is_valid: "ACTIVE",
        expires_at: expiresAt
      });

      res.status(200).json({ user, token, refreshToken });
    } catch (error: any) {
      console.error('Error en login:', error);
      res.status(500).json({ 
        error: 'Error al iniciar sesión', 
        details: error.message || 'Error interno del servidor'
      });
    }
  }

}