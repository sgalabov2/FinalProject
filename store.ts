import { Store } from 'pullstate';
import { Food } from './interfaces/Food';

export interface NutritionValues {
  protein: number;
  carbs: number;
  fats: number;
}

export interface DailyInfo {
  selectedDate: string;
  dailyNutrition: NutritionValues;
}

export interface NotificationSettings {
  breakfastNotification: string;
  lunchNotification: string;
  dinnerNotification: string;
}

export interface Meals {
  breakfast: Food[];
  lunch: Food[];
  dinner: Food[];
}

interface UIStore {
  user: {
    fullName: string;
    email: string;
    age: number;
    nutritionGoals: NutritionValues;
    rewardPoints: number;
  };
  dailyInfo: DailyInfo;
  notificationSettings: NotificationSettings;
  meals: Meals;
}

const initialStore: UIStore = {
  user: {
    fullName: '',
    email: '',
    age: 18,
    nutritionGoals: {
      protein: 230,
      carbs: 97,
      fats: 72,
    },
    rewardPoints: 0,
  },
  dailyInfo: {
    selectedDate: new Date().toISOString(),
    dailyNutrition: {
      protein: 0,
      carbs: 0,
      fats: 0,
    },
  },
  notificationSettings: {
    breakfastNotification: '8:00',
    lunchNotification: '12:00',
    dinnerNotification: '20:00',
  },
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
  },
};

export const store = new Store<UIStore>(initialStore);
