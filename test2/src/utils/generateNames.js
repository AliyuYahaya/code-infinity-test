const { NAMES, SURNAMES } = require('./constants');


generateName = () => {
    randomIndex =  Math.floor(Math.random() * NAMES.length);
    return NAMES[randomIndex];
}

generateSurname = () => {
    randomIndex =  Math.floor(Math.random() * SURNAMES.length);
    return NAMES[randomIndex];
}

generateInitialsFromNames = (name, surname) => {
  return name.charAt(0) + surname.charAt(0);
}

module.exports = {
  getRandomName,
  getRandomSurname,
  generateInitials
};