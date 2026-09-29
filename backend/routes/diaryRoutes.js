/* const express = require("express");
const upload = require("../middleware/upload");
const diaryController = require("../controllers/diaryController");

const router = express.Router();

router.post("/", upload.single("image"), diaryController.createDiary);
router.get("/", diaryController.getDiaries);
router.put("/:id", upload.single("image"), diaryController.updateDiary);
router.delete("/:id", diaryController.deleteDiary);

module.exports = router;
 */
const express = require("express");
const upload = require("../middleware/upload");
const diaryController = require("../controllers/diaryController");
const auth = require("../middleware/auth"); // IMPORT AUTH MIDDLEWARE

const router = express.Router();

// ALL DIARY ROUTES REQUIRE AUTHENTICATION
router.use(auth); // Add this line - protects all routes below

router.post("/", upload.single("image"), diaryController.createDiary);
router.get("/", diaryController.getDiaries);
router.put("/:id", upload.single("image"), diaryController.updateDiary);
router.delete("/:id", diaryController.deleteDiary);

module.exports = router;