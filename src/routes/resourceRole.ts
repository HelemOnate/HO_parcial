import { Application } from "express";
import { ResourceRoleController } from "../controllers/resourceRole.controller";

export class ResourceRoleRoutes {
  public resourceRoleController: ResourceRoleController = new ResourceRoleController();

  public routes(app: Application): void {
    app.route("/api/resource-roles").get(this.resourceRoleController.getAllResourceRoles);
    app.route("/api/resource-roles/:id").get(this.resourceRoleController.getResourceRoleById);
    app.route("/api/resource-roles").post(this.resourceRoleController.createResourceRole);
    app.route("/api/resource-roles/:id").patch(this.resourceRoleController.updateResourceRole);
    app.route("/api/resource-roles/:id").delete(this.resourceRoleController.deleteResourceRole);
    app.route("/api/resource-roles/:id/logic").delete(this.resourceRoleController.deleteResourceRoleAdv);
  }
}