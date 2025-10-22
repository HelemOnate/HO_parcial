import { Application } from "express";
import { RoleUserController } from '../controllers/role_user.controller';

export class RoleUserRoutes {
  public roleUserController: RoleUserController = new RoleUserController();

  public routes(app: Application): void {
    app.route("/api/roleUsers").get(this.roleUserController.getAllRoleUsers); // Obtener todos los RoleUsers
    app.route("/api/roleUsers/:id").get(this.roleUserController.getRoleUserById); // Obtener un RoleUser por ID
    app.route("/api/roleUsers").post(this.roleUserController.createRoleUser); // Crear un nuevo RoleUser
    app.route("/api/roleUsers/:id").patch(this.roleUserController.updateRoleUser); // Actualizar un RoleUser
    app.route("/api/roleUsers/:id").delete(this.roleUserController.deleteRoleUser); // Eliminar un RoleUser físicamente
    app.route("/api/roleUsers/:id/logic").delete(this.roleUserController.deleteRoleUserAdv); // Eliminar un RoleUser lógicamente
  }
}