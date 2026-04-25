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
  },
  {
    timestamps: true,
  }
);

const Person = mongoose.model("Person", personSchema);

export default Person;