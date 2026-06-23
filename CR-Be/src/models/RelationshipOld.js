import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema(
  {
    familyGroupCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    fromPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },

    toPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },

    relationshipType: {
      type: String,
      required: true,
      enum: [
        "PARENT_OF",
        "CHILD_OF",
        "SPOUSE_OF",
        "SIBLING_OF",
        "ADOPTIVE_PARENT_OF",
        "ADOPTIVE_CHILD_OF",
        "GUARDIAN_OF",
        "OTHER",
      ],
    },

    relationshipDirection: {
      type: String,
      enum: ["DIRECTED", "UNDIRECTED"],
      default: "DIRECTED",
    },

    isBiological: {
      type: Boolean,
      default: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "DISPUTED", "UNKNOWN"],
      default: "ACTIVE",
    },

    sourceType: {
      type: String,
      enum: ["USER_ENTERED", "SYSTEM_GENERATED", "IMPORTED", "VERIFIED"],
      default: "USER_ENTERED",
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

relationshipSchema.index(
  { fromPersonId: 1, toPersonId: 1, relationshipType: 1 },
  { unique: true }
);

const Relationship = mongoose.model("Relationship", relationshipSchema);

export default Relationship;