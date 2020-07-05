import process from 'process';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const FACEBOOK_AUTH_LINK = isDev
  ? 'https://localhost:5000/auth/facebook'
  : 'https://food-budget.herokuapp.com/auth/facebook';
export const GOOGLE_AUTH_LINK = isDev
  ? 'https://localhost:5000/auth/google'
  : 'https://food-budget.herokuapp.com/auth/google';
