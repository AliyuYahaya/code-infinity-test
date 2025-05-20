// ================================ [IMPORTS] ================================ //
const { getRandomAge, getRandomBirthDate } = require('./generateDates');
const { generateName, generateSurname, generateInitialsFromNames } = require('./generateNames');
const { FIRST_NAMES, LAST_NAMES, MIN_AGE, MAX_AGE } = require('./constants');

// ================================ [DATA GENERATION] ================================ //
// Generates unique random people data based on the requested number of rows
// We're careful to avoid duplicates as required by the spec
const generateData = (numOfRows) => {
    const generatedPeople = [];
    const usedCombinations = new Set();
    let currentId = 1;
    let attempts = 0;
    const maxAttempts = numOfRows * 10; // Safety measure to prevent infinite loops
    
    console.log(`Generating ${numOfRows} unique records. Available first names: ${FIRST_NAMES.length}, last names: ${LAST_NAMES.length}`);
    console.log(`Maximum possible unique combinations: ${FIRST_NAMES.length * LAST_NAMES.length * (MAX_AGE - MIN_AGE + 1)} (before considering birth dates)`);
    
    // For small numbers, we'll just use the standard method
    if (numOfRows <= 100) {
        while (generatedPeople.length < numOfRows && attempts < maxAttempts) {  
            const firstName = generateName();
            const lastName = generateSurname();
            const initials = generateInitialsFromNames(firstName, lastName);
            const age = getRandomAge();
            const dateOfBirth = getRandomBirthDate(age);
            
            const uniqueKey = `${firstName}|${lastName}|${age}|${dateOfBirth}`;
            
            if (usedCombinations.has(uniqueKey)) {
                attempts++;
                continue;
            }
            
            usedCombinations.add(uniqueKey);
            
            const person = {
                id: currentId,
                name: firstName,
                surname: lastName,
                initials,
                age,
                dateOfBirth
            };
            
            generatedPeople.push(person);
            currentId++;
            attempts++;
        }
        
        if (attempts >= maxAttempts) {
            console.warn(`WARNING: Reached maximum attempts (${maxAttempts}) - could only generate ${generatedPeople.length} unique records`);
        }
    } else {
        // For larger numbers, we need to ensure we can meet the request
        // We'll use a more deterministic approach
        console.log('Using advanced technique for generating a larger number of records...');
        
        for (let i = 0; i < numOfRows; i++) {
            // Generate more variety by combining the name with the ID for larger datasets
            const nameIndex = i % FIRST_NAMES.length;
            const surnameIndex = Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length;
            
            // For really large datasets, we need to add unique identifiers
            let firstName = FIRST_NAMES[nameIndex];
            let lastName = LAST_NAMES[surnameIndex];
            
            // For very large sets, add a number to ensure uniqueness
            if (i >= FIRST_NAMES.length * LAST_NAMES.length) {
                const uniqueSuffix = Math.floor(i / (FIRST_NAMES.length * LAST_NAMES.length));
                firstName = `${firstName}${uniqueSuffix}`;
            }
            
            const initials = generateInitialsFromNames(firstName, lastName);
            
            // Create a more varied age and birthdate
            const ageOffset = i % (MAX_AGE - MIN_AGE + 1);
            const age = MIN_AGE + ageOffset;
            
            // Make the birthdate unique by varying day and month based on the ID
            const dayOfMonth = 1 + (i % 28); // 1-28
            const month = 1 + (i % 12); // 1-12
            const year = new Date().getFullYear() - age;
            const paddedDay = String(dayOfMonth).padStart(2, '0');
            const paddedMonth = String(month).padStart(2, '0');
            const dateOfBirth = `${paddedDay}/${paddedMonth}/${year}`;
            
            const person = {
                id: i + 1, // IDs start at 1
                name: firstName,
                surname: lastName,
                initials,
                age,
                dateOfBirth
            };
            
            generatedPeople.push(person);
            
            // Log progress for large datasets
            if (numOfRows > 1000 && (i + 1) % 10000 === 0) {
                console.log(`Generated ${i + 1} of ${numOfRows} records...`);
            }
        }
    }
    
    console.log(`Successfully generated ${generatedPeople.length} unique records`);
    return generatedPeople;
};
// ================================ [EoM] ================================ //

// ================================ [MODULE EXPORTS] ================================ //
module.exports = {
  generateData
};
// ================================ [EoF] ================================ //