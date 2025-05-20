const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    trim: true
  },
  idNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => v && v.length === 13 && !isNaN(v),
      message: 'ID number must be exactly 13 digits'
    }
  },
  dateOfBirth: {
    type: String,
    required: true,
    validate: {
      validator: v => {
        if (!v || typeof v !== 'string') return false;
        const parts = v.split('/');
        if (parts.length !== 3) return false;

        const [day, month, year] = parts.map(Number);
        const date = new Date(year, month - 1, day);

        return (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day &&
          date <= new Date()
        );
      },
      message: 'Date must be valid and in the format dd/mm/yyyy'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
