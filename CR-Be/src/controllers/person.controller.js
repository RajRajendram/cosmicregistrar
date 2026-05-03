import Person from "../models/Person.js";

export const getPersons = async (req, res) => {
  try {
    console.log("GET /api/persons reached");

    const persons = await Person.find({});

    console.log("Persons found:", persons.length);

    res.status(200).json({
      success: true,
      data: persons,
    });
  } catch (error) {
    console.error("GET persons error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch persons",
    });
  }
};


export const getPersonById = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);

    if (!person) {
      return res.status(404).json({
        success: false,
        message: "Person not found",
      });
    }

    res.status(200).json({
      success: true,
      data: person,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch person",
    });
  }
};

export const createPerson = async (req, res) => {
  try {
    const { phoneNo, emailId, familyGroupCode } = req.body;

    // Basic required check
    if (!familyGroupCode) {
      return res.status(400).json({
        success: false,
        message: "familyGroupCode is required",
      });
    }

    // Duplicate check (phone OR email inside same family group)
    const existingPerson = await Person.findOne({
      familyGroupCode,
      $or: [
        ...(phoneNo ? [{ phoneNo }] : []),
        ...(emailId ? [{ emailId }] : []),
      ],
    });

    if (existingPerson) {
      return res.status(400).json({
        success: false,
        message: "Duplicate person: phone or email already exists in this family",
      });
    }

    // Create person
    const newPerson = await Person.create(req.body);

    res.status(201).json({
      success: true,
      message: "Person created successfully",
      data: newPerson,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to create person",
    });
  }
};

export const updatePerson = async (req, res) => {
  try {
    const { phoneNo, emailId, familyGroupCode } = req.body;
    const personId = req.params.id;

    // Find current person
    const currentPerson = await Person.findById(personId);
    if (!currentPerson) {
      return res.status(404).json({
        success: false,
        message: "Person not found",
      });
    }

    // Use existing values if not provided in update
    const finalFamilyGroupCode =
      familyGroupCode || currentPerson.familyGroupCode;

    const finalPhone = phoneNo !== undefined ? phoneNo : currentPerson.phoneNo;
    const finalEmail = emailId !== undefined ? emailId : currentPerson.emailId;

    // Duplicate check (excluding current person)
    const duplicatePerson = await Person.findOne({
      _id: { $ne: personId },
      familyGroupCode: finalFamilyGroupCode,
      $or: [
        ...(finalPhone ? [{ phoneNo: finalPhone }] : []),
        ...(finalEmail ? [{ emailId: finalEmail }] : []),
      ],
    });

    if (duplicatePerson) {
      return res.status(400).json({
        success: false,
        message: "Duplicate person: phone or email already exists in this family",
      });
    }

    // Update
    const updatedPerson = await Person.findByIdAndUpdate(
      personId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Person updated successfully",
      data: updatedPerson,
    });
  } catch (error) {
    console.error(error);

    // Handle Mongo duplicate error (if index is applied)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry detected (phone/email already exists)",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || "Failed to update person",
    });
  }
};

export const deletePerson = async (req, res) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(req.params.id);

    if (!deletedPerson) {
      return res.status(404).json({
        success: false,
        message: "Person not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Person deleted successfully",
      data: deletedPerson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete person",
    });
  }
};