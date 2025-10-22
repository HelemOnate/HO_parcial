import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/connection";

export class HO_Breed extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public origin_country!: string;
  public size!: "SMALL" | "MEDIUM" | "LARGE" | "GIANT";
  public temperament!: string;
  public life_expectancy!: number;
  public is_active!: "ACTIVE" | "INACTIVE";
}

export interface HO_BreedI {
  id?: number;
  name: string;
  description?: string;
  origin_country?: string;
  size?: "SMALL" | "MEDIUM" | "LARGE" | "GIANT";
  temperament?: string;
  life_expectancy?: number;
  is_active?: "ACTIVE" | "INACTIVE";
}

HO_Breed.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre de la raza no puede estar vacío" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    origin_country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    size: {
      type: DataTypes.ENUM("SMALL", "MEDIUM", "LARGE", "GIANT"),
      allowNull: false,
      defaultValue: "MEDIUM",
    },
    temperament: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    life_expectancy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: [1], msg: "La esperanza de vida debe ser de al menos 1 año" },
        max: { args: [30], msg: "La esperanza de vida no puede exceder los 30 años" },
      },
    },
    is_active: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    tableName: "ho_breeds",
    sequelize: sequelize,
    timestamps: false,
  }
);
