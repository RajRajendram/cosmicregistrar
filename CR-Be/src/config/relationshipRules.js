export const relationshipRules = {
  father_of: {
    label: "Father Of",
    reverse: "child_of",
    generationMove: 1,
    allowedFromGender: ["MALE"],
    category: "parent_child",
  },

  mother_of: {
    label: "Mother Of",
    reverse: "child_of",
    generationMove: 1,
    allowedFromGender: ["FEMALE"],
    category: "parent_child",
  },

  child_of: {
    label: "Child Of",
    reverse: "parent_of",
    generationMove: -1,
    allowedFromGender: ["MALE", "FEMALE", "OTHER"],
    category: "parent_child",
  },

  spouse_of: {
    label: "Spouse Of",
    reverse: "spouse_of",
    generationMove: 0,
    allowedFromGender: ["MALE", "FEMALE", "OTHER"],
    category: "spouse",
  },

  sibling_of: {
    label: "Sibling Of",
    reverse: "sibling_of",
    generationMove: 0,
    allowedFromGender: ["MALE", "FEMALE", "OTHER"],
    category: "sibling",
  },

  guardian_of: {
    label: "Guardian Of",
    reverse: "ward_of",
    generationMove: 1,
    allowedFromGender: ["MALE", "FEMALE", "OTHER"],
    category: "guardian",
  },

  ward_of: {
    label: "Ward Of",
    reverse: "guardian_of",
    generationMove: -1,
    allowedFromGender: ["MALE", "FEMALE", "OTHER"],
    category: "guardian",
  },
};

export const isValidRelationshipType = (relationshipType) => {
  return Object.prototype.hasOwnProperty.call(relationshipRules, relationshipType);
};

export const getRelationshipRule = (relationshipType) => {
  return relationshipRules[relationshipType] || null;
};
