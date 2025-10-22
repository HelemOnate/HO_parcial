import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/connection";
import { HO_Breed } from "./HO_Breed";

export class HO_Dog extends Model {
  public id!: number;
  public name!: string;
  public birthday!: Date;
  public gender!: "MALE" | "FEMALE";
  public color!: string;
  public weight!: number;
  public value_dog!: number;
  public microchip_id!: string;
  public health_status!: "HEALTHY" | "SICK" | "IN_TREATMENT";
  public is_vaccinated!: boolean;
  public is_sterilized!: boolean;
  public owner_name!: string;
  public owner_phone!: string;
  public registration_date!: Date;
  public is_active!: "ACTIVE" | "INACTIVE";
  public breed_id!: number;
}

export interface HO_DogI {
  id?: number;
  name: string;
  birthday: Date;
  gender: "MALE" | "FEMALE";
  color?: string;
  weight?: number;
  value_dog: number;
  microchip_id?: string;
  health_status?: "HEALTHY" | "SICK" | "IN_TREATMENT";
  is_vaccinated?: boolean;
  is_sterilized?: boolean;
  owner_name?: string;
  owner_phone?: string;
  registration_date?: Date;
  is_active?: "ACTIVE" | "INACTIVE";
  breed_id: number;
}

HO_Dog.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre del perro no puede estar vacío" },
      },
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La fecha de nacimiento no puede estar vacía" },
        isDate: true,
      },
    },
    gender: {
      type: DataTypes.ENUM("MALE", "FEMALE"),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: { args: [0.1], msg: "El peso debe ser mayor que 0" },
        max: { args: [200], msg: "El peso no puede exceder los 200 kg" },
      },
    },
    value_dog: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El valor del perro no puede estar vacío" },
        isDecimal: { msg: "El valor del perro debe ser un número válido" },
        min: { args: [0], msg: "El valor del perro debe ser mayor o igual a 0" },
      },
    },
    microchip_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    health_status: {
      type: DataTypes.ENUM("HEALTHY", "SICK", "IN_TREATMENT"),
      allowNull: false,
      defaultValue: "HEALTHY",
    },
    is_vaccinated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_sterilized: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    owner_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    owner_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    is_active: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    tableName: "ho_dogs",
    sequelize: sequelize,
    timestamps: false,
  }
);

// Define relationships
HO_Breed.hasMany(HO_Dog, {
  foreignKey: "breed_id",
  sourceKey: "id",
});
HO_Dog.belongsTo(HO_Breed, {
  foreignKey: "breed_id",
  targetKey: "id",
});
