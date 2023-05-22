import { db } from '../config/firebase';
import { DailyInfo, Meals, NutritionValues, store } from '../store';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { Food } from '../interfaces/Food';
import { posthog } from './posthog';

async function getAndSetDailyInfo(
  email: string,
  date: Date,
  food?: Food,
  mealName?: string
) {
  let existingData = false;
  const queryDailyInfoSnapshot = await getDocs(collection(db, 'dailyInfo'));
  queryDailyInfoSnapshot.forEach((el) => {
    const dailyInfo = JSON.parse(JSON.stringify(el.data()));
    const { userEmail, selectedDate } = dailyInfo;
    if (
      userEmail === email &&
      selectedDate.split('T')[0] === date.toISOString().split('T')[0]
    ) {
      existingData = true;

      if (food) {
        const dailyNutrition = food.nutritionValues;
        const updatedValue: NutritionValues = {
          protein: dailyInfo.dailyNutrition.carbs + dailyNutrition.protein,
          carbs: dailyInfo.dailyNutrition.carbs + dailyNutrition.carbs,
          fats: dailyInfo.dailyNutrition.fats + dailyNutrition.fats,
        };

        store.update((state) => {
          state.dailyInfo = {
            ...dailyInfo,
            dailyNutrition: updatedValue,
          };
        });

        updateDailyInfo(el.id, updatedValue);
      } else {
        store.update((state) => {
          state.dailyInfo = dailyInfo;
        });
      }
    }
  });

  if (!existingData) {
    const dailyInfo: DailyInfo = {
      selectedDate: date.toISOString(),
      dailyNutrition: {
        protein: 0,
        carbs: 0,
        fats: 0,
      },
    };

    store.update((state) => {
      state.dailyInfo = dailyInfo;
    });

    await addDoc(collection(db, 'dailyInfo'), {
      ...dailyInfo,
      userEmail: email,
    });
  }

  if (food && mealName) {
    createOrUpdateMeals(email, date, food, mealName);
  } else {
    getMeals(email, date);
  }
}

async function getMeals(email: string, date: Date) {
  const queryMealsSnapshot = await getDocs(collection(db, 'meals'));
  let existingData = false;
  queryMealsSnapshot.forEach((el) => {
    const meals = JSON.parse(JSON.stringify(el.data()));
    const { userEmail, selectedDate, breakfast, lunch, dinner } = meals;

    if (
      userEmail === email &&
      selectedDate.split('T')[0] === date.toISOString().split('T')[0]
    ) {
      existingData = true;
      store.update((state) => {
        state.meals.breakfast = breakfast;
        state.meals.lunch = lunch;
        state.meals.dinner = dinner;
      });
    }
  });

  if (!existingData) {
    store.update((state) => {
      state.meals.breakfast = [];
      state.meals.lunch = [];
      state.meals.dinner = [];
    });
  }
}

async function createOrUpdateMeals(
  email: string,
  date: Date,
  newFood: Food,
  mealName: string
) {
  const updatedMeals: Meals = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };
  switch (mealName) {
    case 'Breakfast':
      updatedMeals.breakfast.push(newFood);
      break;
    case 'Lunch':
      updatedMeals.lunch.push(newFood);
      break;
    case 'Dinner':
      updatedMeals.dinner.push(newFood);
      break;
  }

  store.update((state) => {
    switch (mealName) {
      case 'Breakfast':
        state.meals.breakfast.push(newFood);
        break;
      case 'Lunch':
        state.meals.lunch.push(newFood);
        break;
      case 'Dinner':
        state.meals.dinner.push(newFood);
        break;
    }
  });

  const queryMealsSnapshot = await getDocs(collection(db, 'meals'));
  if (queryMealsSnapshot.docs.length === 0) {
    createMeals(email, date, updatedMeals);
  } else {
    queryMealsSnapshot.forEach((el) => {
      const meals = JSON.parse(JSON.stringify(el.data()));
      const { userEmail, selectedDate, breakfast, lunch, dinner } = meals;

      if (
        userEmail === email &&
        selectedDate.split('T')[0] === date.toISOString().split('T')[0]
      ) {
        updateMeal(el.id, {
          userEmail: email,
          selectedDate: selectedDate,
          breakfast: [...breakfast, ...updatedMeals.breakfast],
          lunch: [...lunch, ...updatedMeals.lunch],
          dinner: [...dinner, ...updatedMeals.dinner],
        });
      }
    });
  }

  updateRewardPoints(email);
}

async function createMeals(email: string, date: Date, newMeals: Meals) {
  await addDoc(collection(db, 'meals'), {
    userEmail: email,
    selectedDate: date.toISOString(),
    breakfast: newMeals.breakfast,
    lunch: newMeals.lunch,
    dinner: newMeals.dinner,
  });
}

async function updateRewardPoints(email: string) {
  const queryNotificationsSnapshot = await getDocs(
    collection(db, 'notificationSettings')
  );
  queryNotificationsSnapshot.forEach((el) => {
    const notification = JSON.parse(JSON.stringify(el.data()));
    const {
      userEmail,
      breakfastNotification,
      lunchNotification,
      dinnerNotification,
    } = notification;

    if (userEmail === email) {
      const addedPoints = calculateRewardPoints(
        new Date(),
        breakfastNotification,
        lunchNotification,
        dinnerNotification
      );

      store.update((state) => {
        state.user.rewardPoints += addedPoints;
      });

      updateUser(userEmail, addedPoints * 10);

      posthog?.capture('Register a new food in meal - ' + addedPoints);
    }
  });
}

const calculateRewardPoints = (
  date: Date,
  bn: string,
  ln: string,
  dn: string
) => {
  const currentTime = `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  const bDiff = calculateTimeDifference(currentTime, bn);
  const lDiff = calculateTimeDifference(currentTime, ln);
  const dDiff = calculateTimeDifference(currentTime, dn);

  let minPositive = 300;
  if (bDiff > 0 && bDiff < minPositive) {
    minPositive = bDiff;
  }
  if (lDiff > 0 && lDiff < minPositive) {
    minPositive = lDiff;
  }
  if (dDiff > 0 && dDiff < minPositive) {
    minPositive = dDiff;
  }
  return minPositive;
};

const calculateTimeDifference = (current: string, notification: string) => {
  const startDate = new Date(`2000-01-01T${current}:00Z`);
  const endDate = new Date(`2000-01-01T${notification}:00Z`);
  const differenceInMs = startDate.getTime() - endDate.getTime();
  return Math.round(differenceInMs / (1000 * 60));
};

async function updateMeal(id: string, newValue) {
  const mealRef = doc(db, 'meals', id);
  await updateDoc(mealRef, newValue);
}

async function updateUser(userEmail: string, addedPoints: number) {
  const queryUserSnapshot = await getDocs(collection(db, 'users'));
  queryUserSnapshot.forEach((doc) => {
    const data = JSON.parse(JSON.stringify(doc.data()));
    const { email } = data;

    if (email === userEmail) {
      updateRewards(doc.id, addedPoints);
    }
  });
}

async function updateRewards(id: string, addedPoints: number) {
  const userRef = doc(db, 'users', id);
  await updateDoc(userRef, {
    rewardPoints: increment(addedPoints),
  });
}

async function updateDailyInfo(id: string, updatedValue: NutritionValues) {
  const dailyInfoRef = doc(db, 'dailyInfo', id);
  await updateDoc(dailyInfoRef, {
    dailyNutrition: updatedValue,
  });
}

export default getAndSetDailyInfo;
