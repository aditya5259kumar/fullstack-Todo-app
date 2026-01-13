const express = require("express");
const router = express.Router();

const passport = require("../passport/index").authenticateUser;

const Auth = require("../controller/auth");

const {
  signUpValidator,
  loginValidator,
  validate,
} = require("../utils/authvalidator");

// ------ user -------
router.post("/auth/signup", signUpValidator, validate, Auth.signUp);
router.post("/auth/login", loginValidator, validate, Auth.logIn);

router.get("/auth/me", passport, Auth.myProfile);

// ------ todo -------
router.post("/auth/create-todo", passport, Auth.createTodo);
router.get("/auth/get-todo", passport, Auth.getTodo);
router.patch("/auth/update-todo/:id", passport, Auth.updateTodo);
router.delete("/auth/delete-todo/:id", passport, Auth.deleteTodo);

module.exports = router;
