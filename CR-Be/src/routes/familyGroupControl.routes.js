import express from "express";

import {
  createFamilyGroup,
  getAllFamilyGroups,
  getFamilyGroupByCode,
  updateFamilyGroup,
  deleteFamilyGroup,
} from "../controllers/familyGroupControl.controller.js";

const router = express.Router();

router.post("/", createFamilyGroup);
router.get("/", getAllFamilyGroups);
router.get("/:familyGPCode", getFamilyGroupByCode);
router.put("/:familyGPCode", updateFamilyGroup);
router.delete("/:familyGPCode", deleteFamilyGroup);

export default router;