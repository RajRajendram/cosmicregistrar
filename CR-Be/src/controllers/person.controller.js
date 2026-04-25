import Person from "../models/Person.js";

export const getPersons = async (req, res) => {
  try {
    console.log("GET /api/persons reached");

    const persons = await Person.find({});

    console.log("Persons found:", persons.length);

    res.status(200).json(persons);
  } catch (error) {
    console.error("GET persons error:", error);

    res.status(500).json({
      message: "Failed to fetch persons",
      error: error.message,
    });
  }
};






export const getPersonById = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch person",
      error: error.message,
    });
  }
};

export const createPerson = async (req, res) => {
  try {
    const newPerson = await Person.create(req.body);

    res.status(201).json({
      message: "Person created successfully",
      person: newPerson,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create person",
      error: error.message,
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
      return res.status(404).json({ message: "Person not found" });
    }

    res.status(200).json({
      message: "Person updated successfully",
      person: updatedPerson,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update person",
      error: error.message,
    });
  }
};

export const deletePerson = async (req, res) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(req.params.id);

    if (!deletedPerson) {
      return res.status(404).json({ message: "Person not found" });
    }

    res.status(200).json({
      message: "Person deleted successfully",
      person: deletedPerson,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete person",
      error: error.message,
    });
  }
};