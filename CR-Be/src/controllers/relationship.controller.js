// import Relationship from "../models/Relationship.js";
// import Person from "../models/Person.js";
// import { sendDuplicateRelationshipEmail } from "../utils/sendDuplicateRelationshipEmail.js";

// export const getRelationships = async (req, res) => {
//   try {
//     const relationships = await Relationship.find()
//       .populate("fromPersonId", "firstName lastName aliasName generationNo")
//       .populate("toPersonId", "firstName lastName aliasName generationNo");

//     res.status(200).json(relationships);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch relationships", error: error.message });
//   }
// };


// export const getRelationshipById = async (req, res) => {
//   try {
//     const relationship = await Relationship.findById(req.params.id)
//       .populate("fromPersonId", "firstName lastName aliasName generationNo")
//       .populate("toPersonId", "firstName lastName aliasName generationNo");

//     if (!relationship) {
//       return res.status(404).json({ message: "Relationship not found" });
//     }

//     res.status(200).json(relationship);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch relationship", error: error.message });
//   }
// };

// // export const createRelationship = async (req, res) => {
// //   try {
// //     const relationship = await Relationship.create(req.body);
// //     res.status(201).json(relationship);
// //   } catch (error) {
// //     res.status(400).json({ message: "Failed to create relationship", error: error.message });
// //   }
// // };

// export const createRelationship = async (req, res) => {
//   try {
//     const {
//       fromPersonId,
//       toPersonId,
//       relationshipType,
//     } = req.body;

//     // Prevent self relationship
//     if (fromPersonId === toPersonId) {
//       return res.status(400).json({
//         success: false,
//         message: "A person cannot have relationship with themselves",
//       });
//     }

//     // Check if ANY relationship already exists between these persons
//     const existingRelationship = await Relationship.findOne({
//       $or: [
//         {
//           fromPersonId,
//           toPersonId,
//         },
//         {
//           fromPersonId: toPersonId,
//           toPersonId: fromPersonId,
//         },
//       ],
//     });

//     // If relationship already exists
//     if (existingRelationship) {
//       // Fetch full person details
//       const fromPerson = await Person.findById(fromPersonId);
//       const toPerson = await Person.findById(toPersonId);

//       // Send email to admin
//       await sendDuplicateRelationshipEmail({
//         fromPerson,
//         toPerson,
//         newRelationshipType: relationshipType,
//         existingRelationshipType:
//           existingRelationship.relationshipType,
//       });

//       return res.status(409).json({
//         success: false,
//         message:
//           "Sorry, relationship already exists between these persons. Multiple relationships are not allowed.",
//       });
//     }

//     // Create relationship
//     const relationship = await Relationship.create(req.body);

//     res.status(201).json({
//       success: true,
//       message: "Relationship created successfully",
//       data: relationship,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to create relationship",
//       error: error.message,
//     });
//   }
// };

// export const updateRelationship = async (req, res) => {
//   try {
//     const relationship = await Relationship.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!relationship) {
//       return res.status(404).json({ message: "Relationship not found" });
//     }

//     res.status(200).json(relationship);
//   } catch (error) {
//     res.status(400).json({ message: "Failed to update relationship", error: error.message });
//   }
// };

// export const deleteRelationship = async (req, res) => {
//   try {
//     const relationship = await Relationship.findByIdAndDelete(req.params.id);

//     if (!relationship) {
//       return res.status(404).json({ message: "Relationship not found" });
//     }

//     res.status(200).json({ message: "Relationship deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete relationship", error: error.message });
//   }
// };

// export const getRelationshipsByPerson = async (req, res) => {
//   try {
//     const { personId } = req.params;

//     const relationships = await Relationship.find({
//       $or: [{ fromPersonId: personId }, { toPersonId: personId }],
//     })
//       .populate("fromPersonId", "firstName lastName aliasName generationNo")
//       .populate("toPersonId", "firstName lastName aliasName generationNo");

//     res.status(200).json(relationships);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch person relationships", error: error.message });
//   }
// };

// export const getRelationshipsByFamilyGroup = async (req, res) => {
//   try {
//     const { familyGroupCode } = req.params;

//     const relationships = await Relationship.find({
//       familyGroupCode: familyGroupCode.toUpperCase(),
//     })
//       .populate("fromPersonId", "firstName lastName aliasName generationNo")
//       .populate("toPersonId", "firstName lastName aliasName generationNo");

//     res.status(200).json(relationships);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch family group relationships", error: error.message });
//   }
// };



import Relationship from "../models/Relationship.js";
import Person from "../models/Person.js";
import { sendDuplicateRelationshipEmail } from "../utils/sendDuplicateRelationshipEmail.js";
import {
  validateRelationshipType,
  getReverseRelationshipType,
  getRelationshipCategory,
} from "../utils/relationshipUtils.js";

// ─────────────────────────────────────────────
// Helper: check if ANY relationship exists between two persons
// regardless of direction or type
// ─────────────────────────────────────────────
const findExistingRelationshipBetween = async (
  personAId,
  personBId,
  excludeRelationshipId = null
) => {
  const query = {
    $or: [
      { fromPersonId: personAId, toPersonId: personBId },
      { fromPersonId: personBId, toPersonId: personAId },
    ],
  };

  // When updating, exclude the current relationship from the check
  if (excludeRelationshipId) {
    query._id = { $ne: excludeRelationshipId };
  }

  return await Relationship.findOne(query)
    .populate("fromPersonId", "firstName lastName aliasName generationNo gender")
    .populate("toPersonId", "firstName lastName aliasName generationNo gender");
};

// ─────────────────────────────────────────────
// GET all relationships
// ─────────────────────────────────────────────
export const getRelationships = async (req, res) => {
  try {
    const relationships = await Relationship.find()
      .populate("fromPersonId", "firstName lastName aliasName generationNo gender")
      .populate("toPersonId", "firstName lastName aliasName generationNo gender");

    res.status(200).json(relationships);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch relationships",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// GET relationship by ID
// ─────────────────────────────────────────────
export const getRelationshipById = async (req, res) => {
  try {
    const relationship = await Relationship.findById(req.params.id)
      .populate("fromPersonId", "firstName lastName aliasName generationNo gender")
      .populate("toPersonId", "firstName lastName aliasName generationNo gender");

    if (!relationship) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    res.status(200).json(relationship);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch relationship",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// CREATE relationship
// Rule: two persons can only ever have ONE relationship between them
// ─────────────────────────────────────────────
export const createRelationship = async (req, res) => {
  try {
    const { fromPersonId, toPersonId, relationshipType } = req.body;

    // 1. Prevent self-relationship
    if (String(fromPersonId) === String(toPersonId)) {
      return res.status(400).json({
        success: false,
        message: "A person cannot have a relationship with themselves",
      });
    }

    // 2. Validate relationship type
    const validation = validateRelationshipType(relationshipType);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    // 3. Verify both persons exist
    const [fromPerson, toPerson] = await Promise.all([
      Person.findById(fromPersonId),
      Person.findById(toPersonId),
    ]);

    if (!fromPerson || !toPerson) {
      return res.status(404).json({
        success: false,
        message: !fromPerson ? "From-person not found" : "To-person not found",
      });
    }

    // 4. Check if ANY relationship already exists between these two persons
    //    in either direction — block if found
    const existingRelationship = await findExistingRelationshipBetween(
      fromPersonId,
      toPersonId
    );

    if (existingRelationship) {
      // Notify admin about attempted duplicate
      await sendDuplicateRelationshipEmail({
        fromPerson,
        toPerson,
        newRelationshipType: relationshipType,
        existingRelationshipType: existingRelationship.relationshipType,
      });

      return res.status(409).json({
        success: false,
        message:
          "A relationship already exists between these two persons. " +
          "Multiple relationships between the same pair are not allowed.",
        existingRelationship: {
          id: existingRelationship._id,
          type: existingRelationship.relationshipType,
          direction: `${existingRelationship.fromPersonId?.firstName} → ${existingRelationship.toPersonId?.firstName}`,
        },
      });
    }

    // 5. Create the relationship
    const relationship = await Relationship.create(req.body);

    res.status(201).json({
      success: true,
      message: "Relationship created successfully",
      data: relationship,
    });
  } catch (error) {
    console.error("createRelationship error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create relationship",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// UPDATE relationship
// Rule: if fromPersonId or toPersonId is being changed,
// ensure the new pair doesn't already have a relationship
// ─────────────────────────────────────────────
export const updateRelationship = async (req, res) => {
  try {
    const { id } = req.params;
    const { fromPersonId, toPersonId, relationshipType } = req.body;

    // 1. Validate new relationship type if provided
    if (relationshipType) {
      const validation = validateRelationshipType(relationshipType);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
        });
      }
    }

    // 2. Fetch the existing relationship
    const existingRelationship = await Relationship.findById(id);
    if (!existingRelationship) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    // 3. Resolve the final fromPersonId and toPersonId after update
    const resolvedFromId = fromPersonId
      ? String(fromPersonId)
      : String(existingRelationship.fromPersonId);

    const resolvedToId = toPersonId
      ? String(toPersonId)
      : String(existingRelationship.toPersonId);

    // 4. Prevent self-relationship
    if (resolvedFromId === resolvedToId) {
      return res.status(400).json({
        success: false,
        message: "A person cannot have a relationship with themselves",
      });
    }

    // 5. If either person is changing, check whether the new pair
    //    already has a relationship (excluding the current record)
    const personsChanged =
      fromPersonId || toPersonId; // either ID is being updated

    if (personsChanged) {
      const conflictingRelationship = await findExistingRelationshipBetween(
        resolvedFromId,
        resolvedToId,
        id // exclude current relationship from the duplicate check
      );

      if (conflictingRelationship) {
        return res.status(409).json({
          success: false,
          message:
            "A relationship already exists between these two persons. " +
            "Multiple relationships between the same pair are not allowed.",
          existingRelationship: {
            id: conflictingRelationship._id,
            type: conflictingRelationship.relationshipType,
            direction: `${conflictingRelationship.fromPersonId?.firstName} → ${conflictingRelationship.toPersonId?.firstName}`,
          },
        });
      }
    }

    // 6. Perform the update
    const updated = await Relationship.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("fromPersonId", "firstName lastName aliasName generationNo gender")
      .populate("toPersonId", "firstName lastName aliasName generationNo gender");

    res.status(200).json({
      success: true,
      message: "Relationship updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("updateRelationship error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update relationship",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// DELETE relationship
// ─────────────────────────────────────────────
export const deleteRelationship = async (req, res) => {
  try {
    const relationship = await Relationship.findByIdAndDelete(req.params.id);

    if (!relationship) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    res.status(200).json({ message: "Relationship deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete relationship",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// GET relationships by person
// ─────────────────────────────────────────────
export const getRelationshipsByPerson = async (req, res) => {
  try {
    const { personId } = req.params;

    const relationships = await Relationship.find({
      $or: [{ fromPersonId: personId }, { toPersonId: personId }],
    })
      .populate("fromPersonId", "firstName lastName aliasName generationNo gender")
      .populate("toPersonId", "firstName lastName aliasName generationNo gender");

    res.status(200).json(relationships);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch person relationships",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// GET relationships by family group
// ─────────────────────────────────────────────
export const getRelationshipsByFamilyGroup = async (req, res) => {
  try {
    const { familyGroupCode } = req.params;

    const relationships = await Relationship.find({
      familyGroupCode: familyGroupCode.toUpperCase(),
    })
      .populate("fromPersonId", "firstName lastName aliasName generationNo gender")
      .populate("toPersonId", "firstName lastName aliasName generationNo gender");

    res.status(200).json(relationships);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch family group relationships",
      error: error.message,
    });
  }
};