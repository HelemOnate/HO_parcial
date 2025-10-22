import { Application } from "express";
import { DogController } from "../controllers/dog.controller";

export class DogRoutes {
  public dogController: DogController = new DogController();

  public routes(app: Application): void {
    app.route("/api/dogs").get(this.dogController.getAllDogs);
    app.route("/api/dogs/:id").get(this.dogController.getDogById);
    app.route("/api/dogs").post(this.dogController.createDog);
    app.route("/api/dogs/:id").put(this.dogController.updateDog);
    app.route("/api/dogs/:id").delete(this.dogController.deleteDog);
  }
}
