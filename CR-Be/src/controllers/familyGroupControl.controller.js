import FamilyGroupControl from "../models/FamilyGroupControl.js";

export const createFamilyGroup = async (req, res) => {
  try {
    const familyGroup = await FamilyGroupControl.create(req.body);

    res.status(201).json({
      success: true,
      message: "Family group created successfully",
      data: familyGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create family group",
      error: error.message,
    });
  }
};

export const getAllFamilyGroups = async (req, res) => {
  try {
    const familyGroups = await FamilyGroupControl.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: familyGroups.length,
      data: familyGroups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch family groups",
      error: error.message,
    });
  }
};

export const getFamilyGroupByCode = async (req, res) => {
  try {
    const familyGroup = await FamilyGroupControl.findOne({
      familyGPCode: req.params.familyGPCode,
    });

    if (!familyGroup) {
      return res.status(404).json({
        success: false,
        message: "Family group not found",
      });
    }

    res.status(200).json({
      success: true,
      data: familyGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch family group",
      error: error.message,
    });
  }
};

export const updateFamilyGroup = async (req, res) => {
  try {
    const familyGroup = await FamilyGroupControl.findOneAndUpdate(
      { familyGPCode: req.params.familyGPCode },
      req.body,
      { new: true, runValidators: true }
    );

    if (!familyGroup) {
      return res.status(404).json({
        success: false,
        message: "Family group not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Family group updated successfully",
      data: familyGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update family group",
      error: error.message,
    });
  }
};

export const deleteFamilyGroup = async (req, res) => {
  try {
    const familyGroup = await FamilyGroupControl.findOneAndDelete({
      familyGPCode: req.params.familyGPCode,
    });

    if (!familyGroup) {
      return res.status(404).json({
        success: false,
        message: "Family group not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Family group deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete family group",
      error: error.message,
    });
  }
};