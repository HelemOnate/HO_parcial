import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import { sequelize } from "../database/connection";
import { initializeDatabase } from "../database/init";
import { Routes } from "../routes/index";
import { authMiddleware } from "../middleware/auth";
var cors = require("cors");

// Load environment variables from the .env file
dotenv.config();

export class App {
  public app: Application;
  public routePrv: Routes = new Routes();
  private authEnabled: boolean;

  constructor(private port?: number | string) {
    this.app = express();
    this.authEnabled = process.env.AUTH_ENABLED === 'true';

    this.settings();
    this.middlewares();
    this.routes();
    this.dbConnection();
  }

  // Application settings
  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  // Middleware configuration
  private middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    
    // Apply authentication middleware conditionally
    if (this.authEnabled) {
      console.log('🔐 Authentication is ENABLED');
      // Apply auth middleware to all /api routes except auth routes
      this.app.use('/api', (req, res, next) => {
        // Skip authentication for auth-related endpoints only
        if (req.path === '/register' || req.path === '/login' || req.path === '/refresh-token') {
          return next();
        }
        return authMiddleware(req, res, next);
      });
    } else {
      console.log('🔓 Authentication is DISABLED');
    }
  }

  // Route configuration
  private routes(): void {
    // Domain routes
    this.routePrv.breedRoutes.routes(this.app);
    this.routePrv.dogRoutes.routes(this.app);

    // Auth routes (always available, even if AUTH_ENABLED is false)
    this.routePrv.userRoutes.routes(this.app);
    this.routePrv.roleRoutes.routes(this.app);
    this.routePrv.roleUserRoutes.routes(this.app);
    this.routePrv.authRoutes.routes(this.app);
    this.routePrv.refreshTokenRoutes.routes(this.app);
    this.routePrv.resourceRoutes.routes(this.app);
    this.routePrv.resourceRoleRoutes.routes(this.app);
  }

  // Method to connect and synchronize the database
  private async dbConnection(): Promise<void> {
    try {
      // Use the complete initialization function that creates roles and default data
      await initializeDatabase();
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      process.exit(1); // Exit the process if database connection fails
    }
  }

  // Start the server
  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log('🚀 Server on port', this.app.get('port'));
  }
}
