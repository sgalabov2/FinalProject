import { NutritionValues } from '../store';

export interface Food {
  name: string;
  nutritionValues: NutritionValues;
  calories: number;
}
