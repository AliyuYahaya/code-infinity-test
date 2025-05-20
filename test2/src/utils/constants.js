// ================================ [FIRST NAMES] ================================ //
const FIRST_NAMES = [
    "James", "Emma", "Michael", "Sophia",  
    "David", "Olivia", "Robert", "Ava", 
    "William", "Isabella", "Richard", "Mia", 
    "Joseph", "Charlotte", "Thomas", "Amelia", 
    "Daniel", "Harper", "Matthew", "Evelyn",
    "Thabo", "Lerato", "Zukiswa"
];

// ================================ [LAST NAMES] ================================ //
const LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", 
    "Jones", "Garcia", "Miller", "Davis", 
    "Rodriguez", "Martinez", "Hernandez", "Lopez", 
    "Wilson", "Anderson", "Thomas", "Taylor", 
    "Moore", "Jackson", "Martin", "Lee",
    "Ndlovu", "Mkhize", "Singh", "Chao"
];

// ================================ [AGE LIMITS] ================================ //
const MIN_AGE = 18;
const MAX_AGE = 85;

// ================================ [DATABASE CONFIG] ================================ //
const DB_TABLE = "csv_import";
const CSV_FILENAME = "output.csv";

// ================================ [MODULE EXPORTS] ================================ //
module.exports = {
  FIRST_NAMES,
  LAST_NAMES,
  MIN_AGE,
  MAX_AGE,
  DB_TABLE,
  CSV_FILENAME
};