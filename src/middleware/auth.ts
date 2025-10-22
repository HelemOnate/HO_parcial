import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RefreshToken } from '../models/authorization/RefreshToken';
import { User } from '../models/authorization/User';
import { Role } from '../models/authorization/Role';
import { ResourceRole } from '../models/authorization/ResourceRole';
import { Resource } from '../models/authorization/Resource';
import { RoleUser } from '../models/authorization/RoleUser';
import { pathToRegexp } from 'path-to-regexp'; // Importar path-to-regexp
import { addEmitHelper } from 'typescript';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const currentRoute = req.originalUrl;
  const currentMethod = req.method;

  console.log('Current route:', currentRoute)
  if (!token) {
    res.status(401).json({ error: 'Acceso denegado: No se proporcionó el token.' });
    return;
  }

  try {
    // Verificar si el token JWT es válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as jwt.JwtPayload;
    console.log('Decoded token:', decoded);
    console.log('User ID from token:', decoded.id);

    // Buscar el usuario en la base de datos
    const user: User | null = await User.findOne({ where: { id: decoded.id, is_active: "ACTIVE" } });
    if (!user) {
      console.log(`User not found for ID: ${decoded.id}`);
      res.status(401).json({ error: 'Usuario no encontrado o inactivo.' });
      return;
    }
    console.log(`User found in middleware: ${user.getDataValue('email')}, ID: ${user.getDataValue('id')}`);

    // Validar autorización básica (verificar que el usuario tenga al menos un rol activo)
    const userRole = await RoleUser.findOne({
      where: { user_id: decoded.id, is_active: "ACTIVE" },
      include: [{
        model: Role,
        where: { is_active: "ACTIVE" }
      }]
    });

    if (!userRole) {
      res.status(403).json({ error: 'Usuario sin permisos válidos.' });
      return;
    }

    console.log('User has valid role, proceeding...');
    // Continuar con la solicitud
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'El token principal ha expirado.' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Token inválido.' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
    }
  }
};



export const validateAuthorization = async (userId: number, resourcePath: string, resourceMethod: string): Promise<boolean> => {
  try {
    // Obtener todos los recursos activos que coincidan con el método
    const resources = await Resource.findAll({
      where: { method: resourceMethod, is_active: "ACTIVE" },
    });

    // Convertir las rutas dinámicas a expresiones regulares y buscar coincidencias
    const matchingResource = resources.find((resource) => {
      const regex = pathToRegexp(resource.path).regexp.test(resourcePath);
      return regex;
    });

    if (!matchingResource) {
      return false; // No hay coincidencias para la ruta y el método
    }

    // Verificar si existe una relación válida entre el usuario, su rol y el recurso solicitado
    const resourceRole = await ResourceRole.findOne({
      include: [
        {
          model: Role,
          include: [
            {
              model: RoleUser,
              where: { user_id: userId, is_active: "ACTIVE" }, // Validar que el usuario esté asociado al rol
            },
          ],
          where: { is_active: "ACTIVE" }, // Validar que el rol esté activo
        },
      ],
      where: { resource_id: matchingResource.id, is_active: "ACTIVE" }, // Validar que la relación resource_role esté activa
    });

    return !!resourceRole; // Retorna true si se encuentra un registro coincidente
  } catch (error) {
    console.error('Error al validar la autorización:', error);
    return false;
  }
};
