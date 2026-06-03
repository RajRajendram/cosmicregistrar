import {
  relationshipRules,
  isValidRelationshipType,
  getRelationshipRule,
} from "../config/relationshipRules.js";

export const validateRelationshipType = (relationshipType) => {
  if (!isValidRelationshipType(relationshipType)) {
    return {
      valid: false,
      message: `Invalid relationship type: ${relationshipType}`,
    };
  }

  return {
    valid: true,
    message: "Relationship type is valid",
  };
};

export const getReverseRelationshipType = (relationshipType) => {
  const rule = getRelationshipRule(relationshipType);
  return rule ? rule.reverse : null;
};

export const getGenerationMove = (relationshipType) => {
  const rule = getRelationshipRule(relationshipType);
  return rule ? rule.generationMove : null;
};

export const getRelationshipCategory = (relationshipType) => {
  const rule = getRelationshipRule(relationshipType);
  return rule ? rule.category : null;
};

export const getAllRelationshipOptions = () => {
  return Object.entries(relationshipRules).map(([key, rule]) => ({
    value: key,
    label: rule.label,
    reverse: rule.reverse,
    generationMove: rule.generationMove,
    category: rule.category,
  }));
};
