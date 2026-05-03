import express from "express";

import {
  getRelationships,
  getRelationshipById,
  createRelationship,
  updateRelationship,
  deleteRelationship,
  getRelationshipsByPerson,
  getRelationshipsByFamilyGroup,
} from "../controllers/relationship.controller.js";

const router = express.Router();

router.get("/", getRelationships);
router.get("/person/:personId/all", getRelationshipsByPerson);
router.get("/family-group/:familyGroupCode/all", getRelationshipsByFamilyGroup);
router.get("/:id", getRelationshipById);
router.post("/", createRelationship);
router.put("/:id", updateRelationship);
router.delete("/:id", deleteRelationship);

export default router;