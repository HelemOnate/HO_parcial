import { HO_Breed } from '../models/HO_Breed';
import { HO_Dog } from '../models/HO_Dog';
import { User } from '../models/authorization/User';
import { Role } from '../models/authorization/Role';
import { RoleUser } from '../models/authorization/RoleUser';
import { Resource } from '../models/authorization/Resource';
import { ResourceRole } from '../models/authorization/ResourceRole';
import { faker } from '@faker-js/faker';

async function createFakeData() {
    console.log('🌱 Starting to populate database...');

    // Create Roles
    console.log('Creating roles...');
    const adminRole = await Role.create({
        name: 'Admin',
        is_active: 'ACTIVE',
    });

    const managerRole = await Role.create({
        name: 'Manager',
        is_active: 'ACTIVE',
    });

    const userRole = await Role.create({
        name: 'User',
        is_active: 'ACTIVE',
    });

    // Create Users
    console.log('Creating users...');
    const adminUser = await User.create({
        username: 'admin',
        email: 'admin@parcialoh.com',
        password: 'admin123',
        is_active: 'ACTIVE',
        avatar: faker.image.avatar(),
    });

    const managerUser = await User.create({
        username: 'manager',
        email: 'manager@parcialoh.com',
        password: 'manager123',
        is_active: 'ACTIVE',
        avatar: faker.image.avatar(),
    });

    const normalUser = await User.create({
        username: 'user',
        email: 'user@parcialoh.com',
        password: 'user123',
        is_active: 'ACTIVE',
        avatar: faker.image.avatar(),
    });

    // Assign Roles to Users
    console.log('Assigning roles to users...');
    await RoleUser.create({
        user_id: adminUser.id,
        role_id: adminRole.id,
        is_active: 'ACTIVE',
    });

    await RoleUser.create({
        user_id: managerUser.id,
        role_id: managerRole.id,
        is_active: 'ACTIVE',
    });

    await RoleUser.create({
        user_id: normalUser.id,
        role_id: userRole.id,
        is_active: 'ACTIVE',
    });

    // Create Resources (API Endpoints)
    console.log('Creating resources...');
    const breedResources = [
        await Resource.create({ path: '/api/breeds', method: 'GET', is_active: 'ACTIVE' }),
        await Resource.create({ path: '/api/breeds/:id', method: 'GET', is_active: 'ACTIVE' }),
        await Resource.create({ path: '/api/breeds', method: 'POST', is_active: 'ACTIVE' }),
        await Resource.create({ path: '/api/breeds/:id', method: 'PUT', is_active: 'ACTIVE' }),
        await Resource.create({ path: '/api/breeds/:id', method: 'DELETE', is_active: 'ACTIVE' }),
    ];

    const dogResources = [
        await Resource.create({ path: '/api/dogs', method: 'GET', is_active: 'ACTIVE' }),
        await Resource.create({ path: '/api/dogs/:id', method: 'GET', is_active: 'ACTIVE' }),
        await Resource.create({ path: '/api/dogs', method: 'POST', is_active: 'ACTIVE' }),
        await Resource.create({ path: '/api/dogs/:id', method: 'PUT', is_active: 'ACTIVE' }),
        await Resource.create({ path: '/api/dogs/:id', method: 'DELETE', is_active: 'ACTIVE' }),
    ];

    // Assign Resources to Roles
    console.log('Assigning permissions...');
    
    // Admin has full access
    for (const resource of [...breedResources, ...dogResources]) {
        await ResourceRole.create({
            resource_id: resource.id,
            role_id: adminRole.id,
            is_active: 'ACTIVE',
        });
    }

    // Manager has read and write access, but no delete
    for (const resource of [...breedResources.slice(0, 4), ...dogResources.slice(0, 4)]) {
        await ResourceRole.create({
            resource_id: resource.id,
            role_id: managerRole.id,
            is_active: 'ACTIVE',
        });
    }

    // User has only read access
    for (const resource of [breedResources[0], breedResources[1], dogResources[0], dogResources[1]]) {
        if (resource) {
            await ResourceRole.create({
                resource_id: resource.id,
                role_id: userRole.id,
                is_active: 'ACTIVE',
            });
        }
    }

    // Create Breeds
    console.log('Creating breeds...');
    const breedsData = [
        { name: 'Labrador Retriever', origin: 'Canada', size: 'LARGE', temperament: 'Friendly, Active, Outgoing', life: 12 },
        { name: 'German Shepherd', origin: 'Germany', size: 'LARGE', temperament: 'Confident, Courageous, Smart', life: 11 },
        { name: 'Golden Retriever', origin: 'Scotland', size: 'LARGE', temperament: 'Intelligent, Friendly, Devoted', life: 12 },
        { name: 'French Bulldog', origin: 'France', size: 'SMALL', temperament: 'Playful, Adaptable, Smart', life: 11 },
        { name: 'Bulldog', origin: 'England', size: 'MEDIUM', temperament: 'Docile, Willful, Friendly', life: 10 },
        { name: 'Poodle', origin: 'Germany', size: 'MEDIUM', temperament: 'Intelligent, Active, Alert', life: 14 },
        { name: 'Beagle', origin: 'England', size: 'SMALL', temperament: 'Amiable, Determined, Excitable', life: 13 },
        { name: 'Rottweiler', origin: 'Germany', size: 'LARGE', temperament: 'Loyal, Loving, Confident', life: 10 },
        { name: 'Yorkshire Terrier', origin: 'England', size: 'SMALL', temperament: 'Bold, Independent, Confident', life: 15 },
        { name: 'Boxer', origin: 'Germany', size: 'LARGE', temperament: 'Playful, Energetic, Bright', life: 11 },
        { name: 'Dachshund', origin: 'Germany', size: 'SMALL', temperament: 'Clever, Stubborn, Devoted', life: 14 },
        { name: 'Siberian Husky', origin: 'Russia', size: 'MEDIUM', temperament: 'Outgoing, Mischievous, Loyal', life: 13 },
        { name: 'Doberman Pinscher', origin: 'Germany', size: 'LARGE', temperament: 'Loyal, Fearless, Alert', life: 11 },
        { name: 'Great Dane', origin: 'Germany', size: 'GIANT', temperament: 'Friendly, Patient, Dependable', life: 8 },
        { name: 'Miniature Schnauzer', origin: 'Germany', size: 'SMALL', temperament: 'Friendly, Smart, Obedient', life: 14 },
    ];

    const breeds = [];
    for (const breedData of breedsData) {
        const breed = await HO_Breed.create({
            name: breedData.name,
            description: `The ${breedData.name} is a wonderful dog breed known for its unique characteristics.`,
            origin_country: breedData.origin,
            size: breedData.size as "SMALL" | "MEDIUM" | "LARGE" | "GIANT",
            temperament: breedData.temperament,
            life_expectancy: breedData.life,
            is_active: 'ACTIVE',
        });
        breeds.push(breed);
    }

    // Create Dogs
    console.log('Creating dogs...');
    const dogNames = [
        'Max', 'Bella', 'Charlie', 'Luna', 'Cooper', 'Lucy', 'Rocky', 'Daisy',
        'Buddy', 'Molly', 'Jack', 'Sadie', 'Duke', 'Sophie', 'Bear', 'Maggie',
        'Oliver', 'Chloe', 'Tucker', 'Bailey', 'Zeus', 'Lily', 'Leo', 'Stella',
        'Milo', 'Zoey', 'Bentley', 'Penny', 'Toby', 'Coco', 'Winston', 'Lola'
    ];
    
    const colors = ['Black', 'White', 'Brown', 'Golden', 'Gray', 'Cream', 'Black & White', 'Brown & White', 'Brindle', 'Spotted'];

    for (let i = 0; i < 50; i++) {
        const selectedBreed = faker.helpers.arrayElement(breeds);
        await HO_Dog.create({
            name: faker.helpers.arrayElement(dogNames),
            birthday: faker.date.past({ years: 10 }),
            gender: faker.helpers.arrayElement(['MALE', 'FEMALE']) as 'MALE' | 'FEMALE',
            color: faker.helpers.arrayElement(colors),
            weight: parseFloat(faker.number.float({ min: 2, max: 80, fractionDigits: 2 }).toFixed(2)),
            value_dog: parseFloat(faker.commerce.price({ min: 100, max: 5000 })),
            microchip_id: `MC${faker.string.alphanumeric(10).toUpperCase()}`,
            health_status: faker.helpers.arrayElement(['HEALTHY', 'HEALTHY', 'HEALTHY', 'SICK', 'IN_TREATMENT']) as 'HEALTHY' | 'SICK' | 'IN_TREATMENT',
            is_vaccinated: faker.datatype.boolean({ probability: 0.8 }),
            is_sterilized: faker.datatype.boolean({ probability: 0.6 }),
            owner_name: faker.person.fullName(),
            owner_phone: `${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            registration_date: faker.date.past({ years: 2 }),
            is_active: 'ACTIVE',
            breed_id: selectedBreed.id,
        });
    }

    console.log('✅ Database populated successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Roles: 3 (Admin, Manager, User)`);
    console.log(`   - Users: 3`);
    console.log(`   - Resources: ${breedResources.length + dogResources.length}`);
    console.log(`   - Breeds: ${breeds.length}`);
    console.log(`   - Dogs: 50`);
    console.log('\n👤 Test Users:');
    console.log('   - admin@parcialoh.com / admin123 (Admin role)');
    console.log('   - manager@parcialoh.com / manager123 (Manager role)');
    console.log('   - user@parcialoh.com / user123 (User role)');
}

createFakeData().then(() => {
    console.log('\n🎉 Fake data created successfully!');
    process.exit(0);
}).catch((error) => {
    console.error('❌ Error creating fake data:', error);
    process.exit(1);
});

// Para ejecutar este script:
// ts-node src/faker/populate_data.ts
