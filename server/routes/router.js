const express = require("express");
const route = express.Router();
const controller = require("../controller/controller");
const auth = require('../middleware/authMiddleware');

route.get("/:id",controller.findUser );

route.put("/:id", controller.updateUser);

route.put("/updateUser/:id", controller.updatePageUser);

route.put("/changePassword/:id", controller.changePassword);

route.post("/reset-password",controller.resetPassword)

route.post('/new-password',controller.newPassword)

module.exports = route;