// ================================ [IMPORTS] ================================ //
const { MIN_AGE, MAX_AGE } = require('./constants');

// ================================ [AGE GENERATION] ================================ //
const getRandomAge = () => {
  const ageRange = MAX_AGE - MIN_AGE + 1;
  return Math.floor(Math.random() * ageRange) + MIN_AGE;
}

// ================================ [BIRTH DATE GENERATION] ================================ //
const getRandomBirthDate = (age) => {
  const today = new Date();
  
  const yearOfBirth = today.getFullYear() - age;
  
  const birthMonth = Math.floor(Math.random() * 12);
  
  const birthDay = Math.floor(Math.random() * 28) + 1;
  
  const birthDate = new Date(yearOfBirth, birthMonth, birthDay);
  
  return formatAsDateString(birthDate);
}

// ================================ [DATE FORMATTING] ================================ //
const formatAsDateString = (date) => {
  const day = date.getDate().toString().padStart(2, '0');
  
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

// ================================ [MODULE EXPORTS] ================================ //
module.exports = {
  getRandomAge,
  getRandomBirthDate
};