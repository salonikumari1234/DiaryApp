/* // controllers/diaryController.js
const Diary = require("../models/Diary");

// CREATE diary with image
exports.createDiary = async (req, res) => {
  try {
    const diary = new Diary({
      title: req.body.title,
      content: req.body.content,
      mood: req.body.mood,
      image: req.file ? req.file.path : null,
    });
    const savedDiary = await diary.save();
    res.status(201).json(savedDiary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all diary entries
exports.getDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find().sort({ createdAt: -1 });
    res.json(diaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE diary entry
// UPDATE diary with optional image replacement
exports.updateDiary = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      content: req.body.content,
      mood: req.body.mood,
    };

    // If user uploads a new image, replace it
    if (req.file) {
      updateData.image = req.file.path; // 🔥 This is the new line added
    }

    const updatedDiary = await Diary.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedDiary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// DELETE diary entry
exports.deleteDiary = async (req, res) => {
  try {
    await Diary.findByIdAndDelete(req.params.id);
    res.json({ message: "Diary deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
 */
const Diary = require("../models/Diary");
const fs = require("fs");
const path = require("path");

// CREATE diary with image - PROTECTED
exports.createDiary = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const diary = new Diary({
      title: req.body.title,
      content: req.body.content,
      mood: req.body.mood,
      image: req.file ? `uploads/${req.file.filename}` : null,
      user: req.user.userId // Link diary to user
    });
    
    const savedDiary = await diary.save();
    res.status(201).json(savedDiary);
  } catch (err) {
    console.error("Create diary error:", err);
    res.status(400).json({ error: err.message });
  }
};

// GET all diary entries - PROTECTED (only user's diaries)
exports.getDiaries = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Only get diaries belonging to the logged-in user
    const diaries = await Diary.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(diaries);
  } catch (err) {
    console.error("Get diaries error:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE diary entry - PROTECTED
exports.updateDiary = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Find the diary first
    const diary = await Diary.findById(req.params.id);
    
    if (!diary) {
      return res.status(404).json({ error: "Diary not found" });
    }

    // Check if diary belongs to user
    if (diary.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to update this diary" });
    }

    const updateData = {
      title: req.body.title,
      content: req.body.content,
      mood: req.body.mood,
    };

    // If user uploads a new image
    if (req.file) {
      // Delete old image if exists
      if (diary.image) {
        const oldImagePath = path.join(__dirname, '..', diary.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `uploads/${req.file.filename}`;
    }

    const updatedDiary = await Diary.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedDiary);
  } catch (err) {
    console.error("Update diary error:", err);
    res.status(400).json({ error: err.message });
  }
};

// DELETE diary entry - PROTECTED
exports.deleteDiary = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Find the diary first
    const diary = await Diary.findById(req.params.id);
    
    if (!diary) {
      return res.status(404).json({ error: "Diary not found" });
    }

    // Check if diary belongs to user
    if (diary.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to delete this diary" });
    }

    // Delete image if exists
    if (diary.image) {
      const imagePath = path.join(__dirname, '..', diary.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Diary.findByIdAndDelete(req.params.id);
    res.json({ message: "Diary deleted" });
  } catch (err) {
    console.error("Delete diary error:", err);
    res.status(400).json({ error: err.message });
  }
};