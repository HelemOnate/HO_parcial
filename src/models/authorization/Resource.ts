import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../database/connection";
export class Resource extends Model {
  public id!: number;
  public path!: string;
  public method!: string;
  public is_active!: "ACTIVE" | "INACTIVE";
}

export interface ResourceI {
  id?: number;
  path: string;
  method: string;
  is_active: "ACTIVE" | "INACTIVE";
}

Resource.init(
  {
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La ruta no puede estar vacía" },
      },
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El método no puede estar vacío" },
      },
    },
    is_active: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    tableName: "resources",
    sequelize: sequelize,
    timestamps: false,
  }
);
