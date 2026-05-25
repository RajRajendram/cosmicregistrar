import Relationship from "../models/Relationship.js";

export const getRelationships = async (req, res) => {
  try {
    const relationships = await Relationship.find()
      .populate("fromPersonId", "firstName lastName aliasName generationNo")
      .populate("toPersonId", "firstName lastName aliasName generationNo");

    res.status(200).json(relationships);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch relationships", error: error.message });
  }
};


export const getRelationshipById = async (req, res) => {
  try {
    const relationship = await Relationship.findById(req.params.id)
      .populate("fromPersonId", "firstName lastName aliasName generationNo")
      .populate("toPersonId", "firstName lastName aliasName generationNo");

    if (!relationship) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    res.status(200).json(relationship); 
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch relationship", error: error.message });
  }
};

export const createRelationship = async (req, res) => {
  try {
    const relationship = await Relationship.create(req.body);
    res.status(201).json(relationship);
  } catch (error) {
    res.status(400).json({ message: "Failed to create relationship", error: error.message });
  }
};

export const updateRelationship = async (req, res) => {
  try {
    const relationship = await Relationship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!relationship) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    res.status(200).json(relationship);
  } catch (error) {
    res.status(400).json({ message: "Failed to update relationship", error: error.message });
  }
};

export const deleteRelationship = async (req, res) => {
  try {
    const relationship = await Relationship.findByIdAndDelete(req.params.id);

    if (!relationship) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    res.status(200).json({ message: "Relationship deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete relationship", error: error.message });
  }
};

export const getRelationshipsByPerson = async (req, res) => {
  try {
    const { personId } = req.params;

    const relationships = await Relationship.find({
      $or: [{ fromPersonId: personId }, { toPersonId: personId }],
    })
      .populate("fromPersonId", "firstName lastName aliasName generationNo")
      .populate("toPersonId", "firstName lastName aliasName generationNo");

    res.status(200).json(relationships);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch person relationships", error: error.message });
  }
};

export const getRelationshipsByFamilyGroup = async (req, res) => {
  try {
    const { familyGroupCode } = req.params;

    const relationships = await Relationship.find({
      familyGroupCode: familyGroupCode.toUpperCase(),
    })
      .populate("fromPersonId", "firstName lastName aliasName generationNo")
      .populate("toPersonId", "firstName lastName aliasName generationNo");

    res.status(200).json(relationships);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch family group relationships", error: error.message });
  }
};