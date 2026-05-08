import mongoose from "mongoose";

const familyRootTransferSchema = new mongoose.Schema(
  {
    originalFamilyGPCode: {
      type: String,
      required: true,
      trim: true,
    },

    newFamilyGPCode: {
      type: String,
      trim: true,
    },

    oldRootPersonId: {
      type: String,
      required: true,
      trim: true,
    },

    newRootPersonId: {
      type: String,
      required: true,
      trim: true,
    },

    transferReason: {
      type: String,
      trim: true,
    },

    transferStatus: {
      type: String,
      default: "PLANNED",
      trim: true,
    },

    generationRecalculationRequired: {
      type: Boolean,
      default: true,
    },

    relationshipRecalculationRequired: {
      type: Boolean,
      default: true,
    },

    transferNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const FamilyRootTransfer = mongoose.model(
  "FamilyRootTransfer",
  familyRootTransferSchema
);

export default FamilyRootTransfer;