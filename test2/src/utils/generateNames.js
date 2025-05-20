// ================================ [IMPORTS] ================================ //
const { FIRST_NAMES, LAST_NAMES } = require('./constants');

// ================================ [NAME GENERATION] ================================ //
const generateName = () => {
    const randomIndex = Math.floor(Math.random() * FIRST_NAMES.length);
    return FIRST_NAMES[randomIndex];
}

// ================================ [SURNAME GENERATION] ================================ //
const generateSurname = () => {
    const randomIndex = Math.floor(Math.random() * LAST_NAMES.length);
    return LAST_NAMES[randomIndex];
}

// ================================ [INITIALS GENERATION] ================================ //
const generateInitialsFromNames = (firstName, lastName) => {
  return firstName.charAt(0) + lastName.charAt(0);
}

// ================================ [MODULE EXPORTS] ================================ //
module.exports = {
  generateName,
  generateSurname,
  generateInitialsFromNames
};