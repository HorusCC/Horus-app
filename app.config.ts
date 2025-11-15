export default {
  name: "SeuApp",
  slug: "seuapp",
  scheme: "seuapp",

  extra: {
    API_URL: process.env.API_URL,
    API_TOKEN: process.env.API_TOKEN,
    DAILY_KCAL_GOAL: Number(process.env.DAILY_KCAL_GOAL || 2000),
  },

  android: {
    package: "com.anonymous.seuapp", // escolha o ID do seu app
  },
};
