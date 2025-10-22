# ParcialRepeticion2_OH 🐕

Sistema de gestión de perros y razas con autenticación opcional desarrollado con Node.js, TypeScript, Express y Sequelize.

## � Características

- ✅ API REST completa con CRUD para Dogs y Breeds
- ✅ Sistema de autenticación JWT (opcional)
- ✅ Control de roles y permisos granulares
- ✅ Soporte para múltiples bases de datos (MySQL, PostgreSQL, SQL Server, Oracle)
- ✅ Arquitectura MVC limpia y escalable
- ✅ TypeScript para seguridad de tipos
- ✅ Datos de prueba con Faker

## �🚀 Instalación

```bash
# Clonar o navegar al proyecto
cd ParcialRepeticion2_OH

# Instalar dependencias
npm install
```

## ⚙️ Configuración

### 1. Configurar variables de entorno

Edita el archivo `.env` con tus credenciales:

```env
# Server
PORT=4000
NODE_ENV=development

# Autenticación (true/false)
AUTH_ENABLED=false

# JWT (si AUTH_ENABLED=true)
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Database
DB_DIALECT=postgres  # postgres, mysql, mssql, oracle

# PostgreSQL (ejemplo)
PG_HOST=localhost
PG_PORT=5432
PG_NAME=parcial_oh_db
PG_USER=postgres
PG_PASS=tu_contraseña
```

### 2. Crear la base de datos

Crea una base de datos llamada `parcial_oh_db` (o el nombre que configuraste) en tu motor de BD.

## 🏃 Ejecución

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# El servidor se iniciará en http://localhost:4000
```

### Poblar con datos de prueba (opcional)

```bash
# Una vez el servidor esté corriendo, ejecuta:
ts-node src/faker/populate_data.ts
```

Esto creará:
- 3 roles (Admin, Manager, User)
- 3 usuarios de prueba
- 15 razas de perros
- 50 perros
- Permisos configurados

## 📊 Modelos de Datos

### Dominio Principal:
```typescript
HO_Breed {
  id: number
  name: string
}

HO_Dog {
  id: number
  birthday: Date
  value_dog: decimal(10,2)
  breed_id: number  // FK -> HO_Breed
}
```

### Sistema de Autenticación:
- **User**: Usuarios del sistema
- **Role**: Roles (Admin, Manager, User)
- **RoleUser**: Relación N:M usuarios-roles
- **Resource**: Endpoints de la API
- **ResourceRole**: Permisos de roles sobre recursos
- **RefreshToken**: Tokens de refresco

## 🔐 Modos de Autenticación

### Modo SIN autenticación (`AUTH_ENABLED=false`)
- ✅ Acceso directo a todos los endpoints
- ✅ Ideal para desarrollo y pruebas
- ✅ No requiere tokens

### Modo CON autenticación (`AUTH_ENABLED=true`)
- ✅ Protección con JWT
- ✅ Control de permisos por rol
- ✅ Refresh tokens automáticos

**Usuarios de prueba (si poblaste la BD):**
```
Admin:
  Email: admin@parcialoh.com
  Pass: admin123

Manager:
  Email: manager@parcialoh.com
  Pass: manager123

User:
  Email: user@parcialoh.com
  Pass: user123
```

## 🛣️ Endpoints de la API

### 🐕 Dogs

| Método | Endpoint | Descripción | Rol requerido |
|--------|----------|-------------|---------------|
| GET | `/api/dogs` | Listar todos los perros | User, Manager, Admin |
| GET | `/api/dogs/:id` | Obtener perro por ID | User, Manager, Admin |
| POST | `/api/dogs` | Crear nuevo perro | Manager, Admin |
| PUT | `/api/dogs/:id` | Actualizar perro | Manager, Admin |
| DELETE | `/api/dogs/:id` | Eliminar perro | Admin |

**Ejemplo de creación:**
```json
POST /api/dogs
{
  "birthday": "2020-05-15",
  "value_dog": 1500.00,
  "breed_id": 1
}
```

### 🦴 Breeds

| Método | Endpoint | Descripción | Rol requerido |
|--------|----------|-------------|---------------|
| GET | `/api/breeds` | Listar todas las razas | User, Manager, Admin |
| GET | `/api/breeds/:id` | Obtener raza por ID | User, Manager, Admin |
| POST | `/api/breeds` | Crear nueva raza | Manager, Admin |
| PUT | `/api/breeds/:id` | Actualizar raza | Manager, Admin |
| DELETE | `/api/breeds/:id` | Eliminar raza | Admin |

**Ejemplo de creación:**
```json
POST /api/breeds
{
  "name": "Golden Retriever"
}
```

### 🔒 Autenticación (si AUTH_ENABLED=true)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/refresh` | Renovar token |
| POST | `/api/auth/logout` | Cerrar sesión |

**Login:**
```json
POST /api/auth/login
{
  "email": "admin@parcialoh.com",
  "password": "admin123"
}

// Respuesta:
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Uso del token:**
```bash
Authorization: Bearer <token>
x-reset-token: <refreshToken>
```

## 🏗️ Estructura del Proyecto

```
ParcialRepeticion2_OH/
├── src/
│   ├── config/          # Configuración de Express
│   ├── controllers/     # Controladores (lógica de negocio)
│   ├── database/        # Conexión a BD
│   ├── faker/           # Generador de datos de prueba
│   ├── middleware/      # Middleware de autenticación
│   ├── models/          # Modelos Sequelize
│   │   ├── authorization/  # Modelos de auth
│   │   ├── HO_Breed.ts
│   │   └── HO_Dog.ts
│   ├── routes/          # Definición de rutas
│   └── server.ts        # Punto de entrada
├── .env                 # Variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testing

```bash
# Con autenticación desactivada
AUTH_ENABLED=false npm run dev

# Probar endpoints
curl http://localhost:4000/api/dogs
curl http://localhost:4000/api/breeds
```

## 📝 Notas Importantes

- El proyecto usa `sequelize.sync({ force: true })` que **BORRA Y RECREA** las tablas cada vez que inicia
- Para producción, cambia a `{ force: false }` o usa migraciones
- Los errores de TypeScript desaparecerán después de `npm install`

## 🤝 Contribución

Este proyecto fue creado para el curso de Base de Datos - Universidad de La Guajira.

## 📄 Licencia

MIT

---

**Desarrollado con ❤️ por Duvan - Octubre 2025**
