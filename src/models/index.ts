// Export all models
export { default as User } from './User';
export { default as Category } from './Category';
export { default as Area } from './Area';
export { default as Ingredient } from './Ingredient';
export { default as Testimonial } from './Testimonial';
export { default as Recipe } from './Recipe';
export { default as RecipeIngredient } from './RecipeIngredient';
export { default as Follower } from './Follower';
export { default as Favorite } from './Favorite';

// Import all models to register associations
import './User';
import './Category';
import './Area';
import './Ingredient';
import './Recipe';
import './RecipeIngredient';
import './Testimonial';
import './Follower';
import './Favorite';
