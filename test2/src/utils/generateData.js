const {   getRandomAge,getRandomBirthDate } = require('./generateDates');
const {   getRandomName,getRandomSurname,generateInitials } =  require('./generateNames');



generateData = (numOfRows) => {
    const data = [];
    let id = 1;
    const uniqueCombinations = new Set();

    while (data.length < numOfRows) {            
        const name = getRandomName();
        const surname = getRandomSurname();
        const initials = generateInitials(name, surname);
        const age = getRandomAge();
        const dateOfBirth = getRandomBirthDate(age);

        // Create a unique key using the full values that need to be unique
        const uniqueKey = `${name}|${surname}|${age}|${dateOfBirth}`;

        // Check if this combination already exists
        if (!uniqueCombinations.has(uniqueKey)) {
            // Add to our tracking set
            uniqueCombinations.add(uniqueKey);
            
            // Create and add the record
            const record = {
                id,
                name,
                surname,
                initials,
                age,
                dateOfBirth
            };
            
            data.push(record);
            id++;
        }
    }

    return data;
}


module.exports = {
  generateData
};