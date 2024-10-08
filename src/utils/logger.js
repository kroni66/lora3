const isDevelopment = process.env.NODE_ENV === 'development';

export const log = (...args) => {
  if (isDevelopment) {
    console.log(...args);
  }
};
