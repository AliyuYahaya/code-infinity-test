// to generate a random age
getRandomAge = () => {
  return Math.floor(Math.random() * 91) + 18;
}

// to generate a random birth date based on age
getRandomBirthDate = (age) => {
  const today = new Date();
  const birthYear = today.getFullYear() - age;
  
  // Random month (0-11)
  const month = Math.floor(Math.random() * 12);
  
  // Random day (1-28 to avoid invalid dates)
  const day = Math.floor(Math.random() * 28) + 1;
  
  const birthDate = new Date(birthYear, month, day);
  
  // Format as DD/MM/YYYY
  return formatDate(birthDate);
}

// Helper to format date as DD/MM/YYYY
formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

module.exports = {
  getRandomAge,
  getRandomBirthDate
};