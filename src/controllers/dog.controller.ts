import { Request, Response } from "express";
import { HO_Dog, HO_DogI } from "../models/HO_Dog";
import { HO_Breed } from "../models/HO_Breed";

export class DogController {
  // Get all dogs with breed information
  public async getAllDogs(req: Request, res: Response) {
    try {
      const dogs = await HO_Dog.findAll({
        include: [
          {
            model: HO_Breed,
            attributes: ["id", "name"],
          },
        ],
      });
      res.status(200).json({ dogs });
    } catch (error) {
      res.status(500).json({ error: "Error fetching dogs" });
    }
  }

  // Get a dog by ID with breed information
  public async getDogById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dog = await HO_Dog.findByPk(id, {
        include: [
          {
            model: HO_Breed,
            attributes: ["id", "name"],
          },
        ],
      });
      if (dog) {
        res.status(200).json(dog);
      } else {
        res.status(404).json({ error: "Dog not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching dog" });
    }
  }

  // Create a new dog
  public async createDog(req: Request, res: Response) {
    const { 
      name, birthday, gender, color, weight, value_dog, 
      microchip_id, health_status, is_vaccinated, is_sterilized,
      owner_name, owner_phone, registration_date, is_active, breed_id 
    } = req.body;
    
    try {
      // Verify breed exists
      const breedExists = await HO_Breed.findByPk(breed_id);
      if (!breedExists) {
        return res.status(404).json({ error: "Breed not found" });
      }

      const body: HO_DogI = {
        name,
        birthday,
        gender,
        color,
        weight,
        value_dog,
        microchip_id,
        health_status: health_status || 'HEALTHY',
        is_vaccinated: is_vaccinated !== undefined ? is_vaccinated : false,
        is_sterilized: is_sterilized !== undefined ? is_sterilized : false,
        owner_name,
        owner_phone,
        registration_date: registration_date || new Date(),
        is_active: is_active || 'ACTIVE',
        breed_id,
      };

      const newDog = await HO_Dog.create({ ...body });
      res.status(201).json(newDog);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a dog
  public async updateDog(req: Request, res: Response) {
    const { id } = req.params;
    const { 
      name, birthday, gender, color, weight, value_dog, 
      microchip_id, health_status, is_vaccinated, is_sterilized,
      owner_name, owner_phone, registration_date, is_active, breed_id 
    } = req.body;
    
    try {
      // Verify breed exists if breed_id is provided
      if (breed_id) {
        const breedExists = await HO_Breed.findByPk(breed_id);
        if (!breedExists) {
          return res.status(404).json({ error: "Breed not found" });
        }
      }

      const body: HO_DogI = {
        name,
        birthday,
        gender,
        color,
        weight,
        value_dog,
        microchip_id,
        health_status,
        is_vaccinated,
        is_sterilized,
        owner_name,
        owner_phone,
        registration_date,
        is_active,
        breed_id,
      };

      const dogExist = await HO_Dog.findByPk(id);

      if (dogExist) {
        await dogExist.update(body);
        res.status(200).json(dogExist);
      } else {
        res.status(404).json({ error: "Dog not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a dog
  public async deleteDog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dogToDelete = await HO_Dog.findByPk(id);

      if (dogToDelete) {
        await dogToDelete.destroy();
        res.status(200).json({ message: "Dog deleted successfully" });
      } else {
        res.status(404).json({ error: "Dog not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting dog" });
    }
  }
}
