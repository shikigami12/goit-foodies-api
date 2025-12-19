import { v5 as uuidv5 } from 'uuid';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import sequelize from './sequelize';
import {
    User,
    Category,
    Area,
    Ingredient,
    Recipe,
    RecipeIngredient,
    Testimonial,
} from '../models';
import { uploadToCloudinary } from '../config/cloudinary';

// Namespace UUID for generating deterministic UUIDs from MongoDB ObjectIDs
const NAMESPACE_UUID = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

// Category name to image filename mapping (handles naming differences)
const CATEGORY_IMAGE_MAP: Record<string, string> = {
    'Seafood': 'Seafood.jpg',
    'Lamb': 'Lamb.jpg',
    'Starter': 'Starter.jpg',
    'Chicken': 'Chicken.jpg',
    'Beef': 'Beef.jpg',
    'Dessert': 'Desserts.jpg', // Note: image has 's'
    'Vegan': 'Vegan.jpg',
    'Pork': 'Pork.jpg',
    'Vegetarian': 'Vegetarian.jpg',
    'Miscellaneous': 'Miscellaneous.jpg',
    'Pasta': 'Pasta.jpg',
    'Breakfast': 'Breakfast.jpg',
    'Side': 'Side.jpg',
    'Goat': 'Goat.jpg',
    'Soup': 'Soup.jpg',
};

// Import seed data
import usersData from './seed/users.json';
import categoriesData from './seed/categories.json';
import areasData from './seed/areas.json';
import ingredientsData from './seed/ingredients.json';
import recipesData from './seed/recipes.json';
import testimonialsData from './seed/testimonials.json';

/**
 * Convert MongoDB ObjectID to deterministic UUID
 */
function mongoIdToUuid(mongoId: string | { $oid: string }): string {
    const id = typeof mongoId === 'string' ? mongoId : mongoId.$oid;
    return uuidv5(id, NAMESPACE_UUID);
}

/**
 * Seed the database with initial data
 */
async function seed() {
    try {
        console.log('🌱 Starting database seed...\n');

        // Sync database (create tables if they don't exist, alter if they do)
        await sequelize.sync({ alter: true });

        // Maps to store ID conversions
        const userIdMap = new Map<string, string>();
        const categoryNameToIdMap = new Map<string, string>();
        const areaNameToIdMap = new Map<string, string>();
        const ingredientIdMap = new Map<string, string>();

        // 1. Seed Users
        console.log('👤 Seeding users...');
        for (const userData of usersData) {
            const mongoId = (userData._id as { $oid: string }).$oid;
            const uuid = mongoIdToUuid(mongoId);
            userIdMap.set(mongoId, uuid);

            const existingUser = await User.findByPk(uuid);
            if (!existingUser) {
                // Generate a default password hash for seed users
                const hashedPassword = await bcrypt.hash('password123', 10);
                await User.create({
                    id: uuid,
                    name: userData.name,
                    email: userData.email,
                    avatar: userData.avatar,
                    password: hashedPassword,
                });
            }
        }
        console.log(`   ✓ ${usersData.length} users processed\n`);

        // 2. Seed Categories (with image upload)
        console.log('📁 Seeding categories...');
        const categoryImagesDir = path.join(__dirname, './category_images');

        for (const categoryData of categoriesData) {
            const mongoId = (categoryData._id as { $oid: string }).$oid;
            const uuid = mongoIdToUuid(mongoId);
            categoryNameToIdMap.set(categoryData.name, uuid);

            const existingCategory = await Category.findByPk(uuid);

            // Helper function to upload category image
            const uploadCategoryImage = async (): Promise<string | null> => {
                const imageFileName = CATEGORY_IMAGE_MAP[categoryData.name];
                if (imageFileName) {
                    const imagePath = path.join(categoryImagesDir, imageFileName);
                    if (fs.existsSync(imagePath)) {
                        try {
                            const imageBuffer = fs.readFileSync(imagePath);
                            const thumbUrl = await uploadToCloudinary(imageBuffer, 'categories');
                            console.log(`   📷 Uploaded image for ${categoryData.name}`);
                            return thumbUrl;
                        } catch (err) {
                            console.warn(`   ⚠ Failed to upload image for ${categoryData.name}:`, err);
                        }
                    }
                }
                return null;
            };

            if (!existingCategory) {
                // Create new category with image
                const thumbUrl = await uploadCategoryImage();
                await Category.create({
                    id: uuid,
                    name: categoryData.name,
                    thumb: thumbUrl,
                    description: (categoryData as any).description,
                });
            } else {
                // Update existing category
                const thumbUrl = await uploadCategoryImage();
                const updates: any = { description: (categoryData as any).description };
                
                if (!existingCategory.thumb && thumbUrl) {
                    updates.thumb = thumbUrl;
                    console.log(`   🔄 Updated image for existing category ${categoryData.name}`);
                }
                
                await existingCategory.update(updates);
            }
        }
        console.log(`   ✓ ${categoriesData.length} categories processed\n`);

        // 3. Seed Areas
        console.log('🌍 Seeding areas...');
        for (const areaData of areasData) {
            const mongoId = (areaData._id as { $oid: string }).$oid;
            const uuid = mongoIdToUuid(mongoId);
            areaNameToIdMap.set(areaData.name, uuid);

            const existingArea = await Area.findByPk(uuid);
            if (!existingArea) {
                await Area.create({
                    id: uuid,
                    name: areaData.name,
                });
            }
        }
        console.log(`   ✓ ${areasData.length} areas processed\n`);

        // 4. Seed Ingredients
        console.log('🥕 Seeding ingredients...');
        for (const ingredientData of ingredientsData as Array<{
            _id: string;
            name: string;
            desc?: string;
            img?: string;
        }>) {
            const mongoId = ingredientData._id;
            const uuid = mongoIdToUuid(mongoId);
            ingredientIdMap.set(mongoId, uuid);

            const existingIngredient = await Ingredient.findByPk(uuid);
            if (!existingIngredient) {
                await Ingredient.create({
                    id: uuid,
                    name: ingredientData.name,
                    description: ingredientData.desc || null,
                    img: ingredientData.img || null,
                });
            }
        }
        console.log(`   ✓ ${ingredientsData.length} ingredients processed\n`);

        // 5. Seed Recipes
        console.log('🍳 Seeding recipes...');
        let recipesCreated = 0;
        for (const recipeData of recipesData as Array<{
            _id: { $oid: string };
            title: string;
            category: string;
            owner: { $oid: string };
            area: string;
            instructions: string;
            description?: string;
            thumb?: string;
            time?: string;
            ingredients: Array<{ id: string; measure: string }>;
        }>) {
            const recipeMongoId = recipeData._id.$oid;
            const recipeUuid = mongoIdToUuid(recipeMongoId);

            const existingRecipe = await Recipe.findByPk(recipeUuid);
            if (existingRecipe) continue;

            // Get foreign key IDs
            const ownerMongoId = recipeData.owner.$oid;
            const ownerId = userIdMap.get(ownerMongoId);
            const categoryId = categoryNameToIdMap.get(recipeData.category);
            const areaId = areaNameToIdMap.get(recipeData.area);

            if (!ownerId || !categoryId || !areaId) {
                console.warn(`   ⚠ Skipping recipe "${recipeData.title}" - missing reference`);
                continue;
            }

            // Create recipe
            await Recipe.create({
                id: recipeUuid,
                title: recipeData.title,
                instructions: recipeData.instructions,
                thumb: recipeData.thumb || null,
                time: recipeData.time ? `${recipeData.time} min` : null,
                ownerId,
                categoryId,
                areaId,
            });

            // Create recipe ingredients
            for (const ing of recipeData.ingredients) {
                const ingredientId = ingredientIdMap.get(ing.id);
                if (ingredientId) {
                    await RecipeIngredient.create({
                        recipeId: recipeUuid,
                        ingredientId,
                        measure: ing.measure,
                    });
                }
            }

            recipesCreated++;
        }
        console.log(`   ✓ ${recipesCreated} recipes processed\n`);

        // 6. Seed Testimonials
        console.log('💬 Seeding testimonials...');
        for (const testimonialData of testimonialsData as Array<{
            _id: { $oid: string };
            owner: { $oid: string };
            testimonial: string;
        }>) {
            const testimonialMongoId = testimonialData._id.$oid;
            const testimonialUuid = mongoIdToUuid(testimonialMongoId);

            const existingTestimonial = await Testimonial.findByPk(testimonialUuid);
            if (existingTestimonial) continue;

            const ownerMongoId = testimonialData.owner.$oid;
            const userId = userIdMap.get(ownerMongoId);

            if (!userId) {
                console.warn(`   ⚠ Skipping testimonial - missing user reference`);
                continue;
            }

            await Testimonial.create({
                id: testimonialUuid,
                testimonial: testimonialData.testimonial,
                userId,
            });
        }
        console.log(`   ✓ ${testimonialsData.length} testimonials processed\n`);

        console.log('✅ Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await sequelize.close();
    }
}

// Run seed if this file is executed directly
seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
