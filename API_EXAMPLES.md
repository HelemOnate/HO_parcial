# 📝 API USAGE EXAMPLES - ParcialRepeticion2_OH

## 🐕 MODELOS MEJORADOS

### HO_Breed (Razas)
```typescript
{
  id: number
  name: string                    // Nombre de la raza
  description: string             // Descripción
  origin_country: string          // País de origen
  size: "SMALL" | "MEDIUM" | "LARGE" | "GIANT"
  temperament: string             // Temperamento
  life_expectancy: number         // Años de vida esperados
  is_active: "ACTIVE" | "INACTIVE"
}
```

### HO_Dog (Perros)
```typescript
{
  id: number
  name: string                    // Nombre del perro
  birthday: Date                  // Fecha de nacimiento
  gender: "MALE" | "FEMALE"       // Género
  color: string                   // Color
  weight: number                  // Peso en kg
  value_dog: number               // Valor/Precio
  microchip_id: string            // ID de microchip (único)
  health_status: "HEALTHY" | "SICK" | "IN_TREATMENT"
  is_vaccinated: boolean          // ¿Está vacunado?
  is_sterilized: boolean          // ¿Está esterilizado?
  owner_name: string              // Nombre del dueño
  owner_phone: string             // Teléfono del dueño
  registration_date: Date         // Fecha de registro
  is_active: "ACTIVE" | "INACTIVE"
  breed_id: number                // FK a HO_Breed
}
```

---

## 📡 ENDPOINTS Y EJEMPLOS

### 1️⃣ CREAR UNA RAZA (Breed)

```bash
POST http://localhost:4000/api/breeds
Content-Type: application/json

{
  "name": "Border Collie",
  "description": "Highly intelligent and energetic working dog",
  "origin_country": "Scotland",
  "size": "MEDIUM",
  "temperament": "Intelligent, Energetic, Alert",
  "life_expectancy": 13,
  "is_active": "ACTIVE"
}
```

**Respuesta:**
```json
{
  "id": 16,
  "name": "Border Collie",
  "description": "Highly intelligent and energetic working dog",
  "origin_country": "Scotland",
  "size": "MEDIUM",
  "temperament": "Intelligent, Energetic, Alert",
  "life_expectancy": 13,
  "is_active": "ACTIVE"
}
```

---

### 2️⃣ CREAR UN PERRO (Dog)

```bash
POST http://localhost:4000/api/dogs
Content-Type: application/json

{
  "name": "Max",
  "birthday": "2020-05-15",
  "gender": "MALE",
  "color": "Golden",
  "weight": 30.5,
  "value_dog": 1500.00,
  "microchip_id": "MC1234567890",
  "health_status": "HEALTHY",
  "is_vaccinated": true,
  "is_sterilized": false,
  "owner_name": "Juan Pérez",
  "owner_phone": "+57 300 123 4567",
  "registration_date": "2024-10-22",
  "is_active": "ACTIVE",
  "breed_id": 1
}
```

**Respuesta:**
```json
{
  "id": 51,
  "name": "Max",
  "birthday": "2020-05-15T00:00:00.000Z",
  "gender": "MALE",
  "color": "Golden",
  "weight": 30.5,
  "value_dog": 1500.00,
  "microchip_id": "MC1234567890",
  "health_status": "HEALTHY",
  "is_vaccinated": true,
  "is_sterilized": false,
  "owner_name": "Juan Pérez",
  "owner_phone": "+57 300 123 4567",
  "registration_date": "2024-10-22T00:00:00.000Z",
  "is_active": "ACTIVE",
  "breed_id": 1
}
```

---

### 3️⃣ LISTAR TODOS LOS PERROS (con información de raza)

```bash
GET http://localhost:4000/api/dogs
```

**Respuesta:**
```json
{
  "dogs": [
    {
      "id": 1,
      "name": "Max",
      "birthday": "2020-05-15T00:00:00.000Z",
      "gender": "MALE",
      "color": "Golden",
      "weight": 30.5,
      "value_dog": 1500.00,
      "microchip_id": "MC1234567890",
      "health_status": "HEALTHY",
      "is_vaccinated": true,
      "is_sterilized": false,
      "owner_name": "Juan Pérez",
      "owner_phone": "+57 300 123 4567",
      "registration_date": "2024-10-22T00:00:00.000Z",
      "is_active": "ACTIVE",
      "breed_id": 1,
      "HO_Breed": {
        "id": 1,
        "name": "Labrador Retriever"
      }
    }
  ]
}
```

---

### 4️⃣ OBTENER UN PERRO POR ID

```bash
GET http://localhost:4000/api/dogs/1
```

**Respuesta:**
```json
{
  "id": 1,
  "name": "Max",
  "birthday": "2020-05-15T00:00:00.000Z",
  "gender": "MALE",
  "color": "Golden",
  "weight": 30.5,
  "value_dog": 1500.00,
  "microchip_id": "MC1234567890",
  "health_status": "HEALTHY",
  "is_vaccinated": true,
  "is_sterilized": false,
  "owner_name": "Juan Pérez",
  "owner_phone": "+57 300 123 4567",
  "registration_date": "2024-10-22T00:00:00.000Z",
  "is_active": "ACTIVE",
  "breed_id": 1,
  "HO_Breed": {
    "id": 1,
    "name": "Labrador Retriever",
    "description": "The Labrador Retriever is a wonderful dog breed...",
    "origin_country": "Canada",
    "size": "LARGE",
    "temperament": "Friendly, Active, Outgoing",
    "life_expectancy": 12,
    "is_active": "ACTIVE"
  }
}
```

---

### 5️⃣ ACTUALIZAR UN PERRO

```bash
PUT http://localhost:4000/api/dogs/1
Content-Type: application/json

{
  "health_status": "IN_TREATMENT",
  "is_vaccinated": true,
  "weight": 32.0
}
```

**Respuesta:**
```json
{
  "id": 1,
  "name": "Max",
  "health_status": "IN_TREATMENT",
  "is_vaccinated": true,
  "weight": 32.0,
  ...
}
```

---

### 6️⃣ LISTAR TODAS LAS RAZAS

```bash
GET http://localhost:4000/api/breeds
```

**Respuesta:**
```json
{
  "breeds": [
    {
      "id": 1,
      "name": "Labrador Retriever",
      "description": "The Labrador Retriever is a wonderful dog breed...",
      "origin_country": "Canada",
      "size": "LARGE",
      "temperament": "Friendly, Active, Outgoing",
      "life_expectancy": 12,
      "is_active": "ACTIVE"
    },
    {
      "id": 2,
      "name": "German Shepherd",
      "description": "The German Shepherd is a wonderful dog breed...",
      "origin_country": "Germany",
      "size": "LARGE",
      "temperament": "Confident, Courageous, Smart",
      "life_expectancy": 11,
      "is_active": "ACTIVE"
    }
  ]
}
```

---

### 7️⃣ ACTUALIZAR UNA RAZA

```bash
PUT http://localhost:4000/api/breeds/1
Content-Type: application/json

{
  "description": "Updated description for Labrador",
  "life_expectancy": 13
}
```

---

### 8️⃣ ELIMINAR UN PERRO

```bash
DELETE http://localhost:4000/api/dogs/1
```

**Respuesta:**
```json
{
  "message": "Dog deleted successfully"
}
```

---

### 9️⃣ ELIMINAR UNA RAZA

```bash
DELETE http://localhost:4000/api/breeds/1
```

**Respuesta:**
```json
{
  "message": "Breed deleted successfully"
}
```

---

## 🔐 CON AUTENTICACIÓN (AUTH_ENABLED=true)

### Login
```bash
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@parcialoh.com",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Usar el token en las peticiones
```bash
GET http://localhost:4000/api/dogs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
x-reset-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 CASOS DE USO PRÁCTICOS

### Buscar perros de una raza específica
```sql
-- Implementar filtro en el controlador
GET /api/dogs?breed_id=1
```

### Buscar perros por estado de salud
```sql
-- Implementar filtro
GET /api/dogs?health_status=HEALTHY
```

### Buscar perros vacunados
```sql
-- Implementar filtro
GET /api/dogs?is_vaccinated=true
```

### Buscar razas por tamaño
```sql
-- Implementar filtro
GET /api/breeds?size=LARGE
```

---

## 📊 DATOS DE PRUEBA CREADOS

Después de ejecutar `ts-node src/faker/populate_data.ts`:

- ✅ **15 razas** con información completa
- ✅ **50 perros** con datos realistas
- ✅ **3 usuarios** de prueba (admin, manager, user)
- ✅ **3 roles** configurados
- ✅ **10 recursos/endpoints** con permisos

---

## 💡 TIPS

1. **Microchip ID debe ser único**: No puedes registrar dos perros con el mismo microchip
2. **Validaciones activas**: Los campos tienen validaciones automáticas
3. **Relaciones**: Al consultar un perro, incluye automáticamente la información de su raza
4. **Soft delete**: Los registros usan `is_active` para eliminar lógicamente

---

## 🧪 TESTING CON CURL

```bash
# Crear raza
curl -X POST http://localhost:4000/api/breeds \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Husky Siberiano",
    "origin_country": "Rusia",
    "size": "LARGE",
    "life_expectancy": 12
  }'

# Crear perro
curl -X POST http://localhost:4000/api/dogs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Luna",
    "birthday": "2021-03-10",
    "gender": "FEMALE",
    "color": "White & Gray",
    "weight": 25.5,
    "value_dog": 2000,
    "owner_name": "María García",
    "owner_phone": "+57 310 555 1234",
    "breed_id": 1
  }'

# Listar perros
curl http://localhost:4000/api/dogs

# Listar razas
curl http://localhost:4000/api/breeds
```

---

**¡Los modelos están completamente mejorados y listos para usar!** 🎉
