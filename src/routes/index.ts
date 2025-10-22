import { Router } from "express";
import { BreedRoutes } from "./breed";
import { DogRoutes } from "./dog";
import { UserRoutes } from "./user";
import { RoleRoutes } from "./role";
import { RoleUserRoutes } from "./role_user";
import { AuthRoutes } from "./auth";
import { RefreshTokenRoutes } from "./refresk_token";
import { ResourceRoutes } from "./resource";
import { ResourceRoleRoutes } from "./resourceRole";

export class Routes {
  // Domain routes
  public breedRoutes: BreedRoutes = new BreedRoutes();
  public dogRoutes: DogRoutes = new DogRoutes();
  
  // Auth routes
  public userRoutes: UserRoutes = new UserRoutes();
  public roleRoutes: RoleRoutes = new RoleRoutes();
  public roleUserRoutes: RoleUserRoutes = new RoleUserRoutes();
  public authRoutes: AuthRoutes = new AuthRoutes();
  public refreshTokenRoutes: RefreshTokenRoutes = new RefreshTokenRoutes();
  public resourceRoutes: ResourceRoutes = new ResourceRoutes();
  public resourceRoleRoutes: ResourceRoleRoutes = new ResourceRoleRoutes();
}
