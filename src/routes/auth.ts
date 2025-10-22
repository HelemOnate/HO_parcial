import { Application } from "express";
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from "../middleware/auth";

export class AuthRoutes {
  public authController: AuthController = new AuthController();

  public routes(app: Application): void {
    app.route("/api/register").post(this.authController.register);
    app.route("/api/login").post(this.authController.login);
  }
}