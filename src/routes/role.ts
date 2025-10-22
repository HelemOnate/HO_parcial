import { Application } from "express";
import { RoleController } from '../controllers/role.controller';

export class RoleRoutes {
  public roleController: RoleController = new RoleController();

  public routes(app: Application): void {
    app.route("/api/roles").get(this.roleController.getAllRoles); // Obtener todos los roles
    app.route("/api/roles/:id").get(this.roleController.getRoleById); // Obtener un rol por ID
    app.route("/api/roles").post(this.roleController.createRole); // Crear un nuevo rol
    app.route("/api/roles/:id").patch(this.roleController.updateRole); // Actualizar un rol
    app.route("/api/roles/:id").delete(this.roleController.deleteRole); // Eliminar un rol físicamente
    app.route("/api/roles/:id/logic").delete(this.roleController.deleteRoleAdv); // Eliminar un rol lógicamente
  }
}