// frontend/app.config.ts
import 'dotenv/config';

export default {
  expo: {
    name: 'SeuApp',
    slug: 'seuapp',
    scheme: 'seuapp', // para deep links se precisar
    extra: {
      // Estes valores ficam acessíveis em runtime via expo-constants
      API_URL: process.env.API_URL,
      API_TOKEN: process.env.API_TOKEN,
      DAILY_KCAL_GOAL: Number(process.env.DAILY_KCAL_GOAL || 2000),
    },
  },
};