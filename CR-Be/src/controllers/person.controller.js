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
    const newPerson = await Person.create(req.body);

    res.status(201).json({
      success: true,
      message: "Person created successfully",
      data: newPerson,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create person",
    });
  }
};

export const updatePerson = async (req, res) => {
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPerson) {
      return res.status(404).json({
        success: false,
        message: "Person not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Person updated successfully",
      data: updatedPerson,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update person",
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