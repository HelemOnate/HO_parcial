import { Request, Response } from "express";
import { HO_Breed, HO_BreedI } from "../models/HO_Breed";

export class BreedController {
  // Get all breeds
  public async getAllBreeds(req: Request, res: Response) {
    try {
      const breeds: HO_BreedI[] = await HO_Breed.findAll();
      res.status(200).json({ breeds });
    } catch (error) {
      res.status(500).json({ error: "Error fetching breeds" });
    }
  }

  // Get a breed by ID
  public async getBreedById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const breed = await HO_Breed.findByPk(id);
      if (breed) {
        res.status(200).json(breed);
      } else {
        res.status(404).json({ error: "Breed not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching breed" });
    }
  }

  // Create a new breed
  public async createBreed(req: Request, res: Response) {
    const { name, description, origin_country, size, temperament, life_expectancy, is_active } = req.body;
    try {
      const body: HO_BreedI = {
        name,
        description,
        origin_country,
        size,
        temperament,
        life_expectancy,
        is_active: is_active || 'ACTIVE',
      };

      const newBreed = await HO_Breed.create({ ...body });
      res.status(201).json(newBreed);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a breed
  public async updateBreed(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, origin_country, size, temperament, life_expectancy, is_active } = req.body;
    try {
      const body: HO_BreedI = {
        name,
        description,
        origin_country,
        size,
        temperament,
        life_expectancy,
        is_active,
      };

      const breedExist = await HO_Breed.findByPk(id);

      if (breedExist) {
        await breedExist.update(body);
        res.status(200).json(breedExist);
      } else {
        res.status(404).json({ error: "Breed not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a breed
  public async deleteBreed(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const breedToDelete = await HO_Breed.findByPk(id);

      if (breedToDelete) {
        await breedToDelete.destroy();
        res.status(200).json({ message: "Breed deleted successfully" });
      } else {
        res.status(404).json({ error: "Breed not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting breed" });
    }
  }
}
