import mongoose from "mongoose";

const familyGroupControlSchema = new mongoose.Schema(
  {
    familyGPCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    familyGroupName: {
      type: String,
      required: true,
      trim: true,
    },

    rootPersonId: {
      type: String,
      required: true,
      trim: true,
    },

    rootPersonCode: {
      type: String,
      required: true,
      trim: true,
    },

    familyGroupStatus: {
      type: String,
      default: "ACTIVE",
      trim: true,
    },

    familyGroupStatusReason: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const FamilyGroupControl = mongoose.model(
  "FamilyGroupControl",
  familyGroupControlSchema
);

export default FamilyGroupControl;