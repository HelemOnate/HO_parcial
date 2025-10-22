import { Application } from "express";
import { BreedController } from "../controllers/breed.controller";

export class BreedRoutes {
  public breedController: BreedController = new BreedController();

  public routes(app: Application): void {
    app.route("/api/breeds").get(this.breedController.getAllBreeds);
    app.route("/api/breeds/:id").get(this.breedController.getBreedById);
    app.route("/api/breeds").post(this.breedController.createBreed);
    app.route("/api/breeds/:id").put(this.breedController.updateBreed);
    app.route("/api/breeds/:id").delete(this.breedController.deleteBreed);
  }
}
