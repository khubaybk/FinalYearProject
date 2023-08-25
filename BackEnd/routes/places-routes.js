const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../Controllers/places-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/getAllPosts", placesControllers.getAllPlaces);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.get("/test", (req, res, next) => {
    return res.json({ name: "test" });
});

router.get("/:pid", placesControllers.getPlaceById);

router.use(checkAuth);

router.post(
    "/",
    fileUpload.single("image"),
    [
        check("title").not().isEmpty(),
        check("description").isLength({ min: 5 }),
        check("address").not().isEmpty(),
    ],
    placesControllers.createPlace
);

router.patch(
    "/:pid",
    [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
    placesControllers.updatePlaceById
);

router.delete("/:pid", placesControllers.deletePlace);

router.post("/:pid/like", placesControllers.likePlace);

router.post("/:pid/unlike", placesControllers.unlikePlace);

module.exports = router;

