import { Application } from "express";
import { ResourceController } from "../controllers/resource.controller";

export class ResourceRoutes {
  public resourceController: ResourceController = new ResourceController();

  public routes(app: Application): void {
    app.route("/api/resources").get(this.resourceController.getAllResources);
    app.route("/api/resources/:id").get(this.resourceController.getResourceById);
    app.route("/api/resources").post(this.resourceController.createResource);
    app.route("/api/resources/:id").patch(this.resourceController.updateResource);
    app.route("/api/resources/:id").delete(this.resourceController.deleteResource);
    app.route("/api/resources/:id/logic").delete(this.resourceController.deleteResourceAdv);
  }
}