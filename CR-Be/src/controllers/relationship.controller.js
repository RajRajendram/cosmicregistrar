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

export const getRelationshipById = async (req, res) => {
  try {
    const relationship = await Relationship.findById(req.params.id)
      .populate("fromPersonId", "firstName lastName aliasName generationNo gender")
      .populate("toPersonId", "firstName lastName aliasName generationNo gender");

    if (!relationship) {
      return res.status(404).json({
        message: "Relationship not found",
      });
    }

    res.status(200).json(relationship);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch relationship",
      error: error.message,
    });
  }
};

export const createRelationship = async (req, res) => {
  try {
    const {
      fromPersonId,
      toPersonId,
      relationshipType,
    } = req.body;

    // Prevent self relationship
    if (fromPersonId === toPersonId) {
      return res.status(400).json({
        success: false,
        message: "A person cannot have relationship with themselves",
      });
    }

    // Validate relationship type using utility
    const validation = validateRelationshipType(relationshipType);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const fromPerson = await Person.findById(fromPersonId);
    const toPerson = await Person.findById(toPersonId);

    if (!fromPerson || !toPerson) {
      return res.status(404).json({
        success: false,
        message: "Person not found",
      });
    }

    // Check direct duplicate
    const directRelationship = await Relationship.findOne({
      fromPersonId,
      toPersonId,
      relationshipType,
    });

    if (directRelationship) {
      await sendDuplicateRelationshipEmail({
        fromPerson,
        toPerson,
        newRelationshipType: relationshipType,
        existingRelationshipType: directRelationship.relationshipType,
      });

      return res.status(409).json({
        success: false,
        message: "Duplicate relationship already exists",
      });
    }

    // Check reverse duplicate
    const reverseType =
      getReverseRelationshipType(relationshipType);

    const reverseRelationship = await Relationship.findOne({
      fromPersonId: toPersonId,
      toPersonId: fromPersonId,
      relationshipType: reverseType,
    });

    if (reverseRelationship) {
      await sendDuplicateRelationshipEmail({
        fromPerson,
        toPerson,
        newRelationshipType: relationshipType,
        existingRelationshipType:
          reverseRelationship.relationshipType,
      });

      return res.status(409).json({
        success: false,
        message:
          "Reverse relationship already exists between these persons",
      });
    }

    const relationship = await Relationship.create(req.body);

    res.status(201).json({
      success: true,
      message: "Relationship created successfully",
      data: relationship,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create relationship",
      error: error.message,
    });
  }
};

export const updateRelationship = async (req, res) => {
  try {
    if (req.body.relationshipType) {
      const validation = validateRelationshipType(
        req.body.relationshipType
      );

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
        });
      }
    }

    const relationship = await Relationship.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!relationship) {
      return res.status(404).json({
        message: "Relationship not found",
      });
    }

    res.status(200).json(relationship);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update relationship",
      error: error.message,
    });
  }
};

export const deleteRelationship = async (req, res) => {
  try {
    const relationship =
      await Relationship.findByIdAndDelete(req.params.id);

    if (!relationship) {
      return res.status(404).json({
        message: "Relationship not found",
      });
    }

    res.status(200).json({
      message: "Relationship deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete relationship",
      error: error.message,
    });
  }
};

export const getRelationshipsByPerson = async (req, res) => {
  try {
    const { personId } = req.params;

    const relationships = await Relationship.find({
      $or: [
        { fromPersonId: personId },
        { toPersonId: personId },
      ],
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

export const getRelationshipsByFamilyGroup = async (
  req,
  res
) => {
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