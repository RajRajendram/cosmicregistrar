import FamilyRootTransfer from "../models/FamilyRootTransfer.js";

export const createRootTransfer = async (req, res) => {
  try {
    const rootTransfer = await FamilyRootTransfer.create(req.body);

    res.status(201).json({
      success: true,
      message: "Root transfer request created successfully",
      data: rootTransfer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create root transfer request",
      error: error.message,
    });
  }
};

export const getAllRootTransfers = async (req, res) => {
  try {
    const rootTransfers = await FamilyRootTransfer.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: rootTransfers.length,
      data: rootTransfers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch root transfer records",
      error: error.message,
    });
  }
};

export const getRootTransferById = async (req, res) => {
  try {
    const rootTransfer = await FamilyRootTransfer.findById(req.params.id);

    if (!rootTransfer) {
      return res.status(404).json({
        success: false,
        message: "Root transfer record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rootTransfer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch root transfer record",
      error: error.message,
    });
  }
};

export const updateRootTransfer = async (req, res) => {
  try {
    const rootTransfer = await FamilyRootTransfer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!rootTransfer) {
      return res.status(404).json({
        success: false,
        message: "Root transfer record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Root transfer record updated successfully",
      data: rootTransfer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update root transfer record",
      error: error.message,
    });
  }
};

export const deleteRootTransfer = async (req, res) => {
  try {
    const rootTransfer = await FamilyRootTransfer.findByIdAndDelete(
      req.params.id
    );

    if (!rootTransfer) {
      return res.status(404).json({
        success: false,
        message: "Root transfer record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Root transfer record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete root transfer record",
      error: error.message,
    });
  }
};