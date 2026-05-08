import express from "express";

import {
  createRootTransfer,
  getAllRootTransfers,
  getRootTransferById,
  updateRootTransfer,
  deleteRootTransfer,
} from "../controllers/familyRootTransfer.controller.js";

const router = express.Router();

router.post("/", createRootTransfer);
router.get("/", getAllRootTransfers);
router.get("/:id", getRootTransferById);
router.put("/:id", updateRootTransfer);
router.delete("/:id", deleteRootTransfer);

export default router;