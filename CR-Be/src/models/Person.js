import mongoose from "mongoose";

const personSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    birthCity: {
      type: String,
      trim: true,
    },
    birthCountry: {
      type: String,
      trim: true,
    },
    siblingSeniorityNo: {
      type: Number,
      min: 1,
    },

    // NEW FIELDS ADDED
    isAlive: {
      type: Boolean,
      required: true,
      default: true,
    },
    deathDate: {
      type: Date,
      default: null,
    },
    deathDateText: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Person = mongoose.model("Person", personSchema);

export default Person;