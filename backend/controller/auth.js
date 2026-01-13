const express = require("express");
const sequelize = require("sequelize");
const db = require("../models");
const users = db.users;
const user_profiles = db.user_profiles;
const todos = db.todos;
const helper = require("../utils/helper");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

users.hasOne(user_profiles, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

user_profiles.belongsTo(users, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

module.exports = {
  // ---------- user ----------

  signUp: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await users.findOne({
        where: { email },
      });

      if (existingUser) {
        return helper.error(res, "Email already exist", {}, 400);
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const user = await users.create({
        email,
        password: hashPassword,
      });

      await user_profiles.create({
        userId: user.id,
        name,
        profilePhoto: null,
      });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET
      );

      return helper.success(res, "user created successfully", { token }, 201);
    } catch (error) {
      console.error(error);
      return helper.error(res, "something went wrong!", error);
    }
  },

  logIn: async (req, res) => {
    try {
      const { email, password } = req.body;

      const emailcheck = await users.findOne({ where: { email } });
      if (!emailcheck) {
        return helper.error(res, "invalid credentials!", {}, 401);
      }

      const isMatch = await bcrypt.compare(password, emailcheck.password);
      if (!isMatch) {
        return helper.error(res, "invalid credentials!", {}, 401);
      }

      const token = jwt.sign(
        { id: emailcheck.id, email: emailcheck.email },
        process.env.JWT_SECRET
      );

      return helper.success(res, "logged in successfully.", { token }, 200);
    } catch (error) {
      console.log(error);
      return helper.error(res, "something went wrong!", {});
    }
  },

  myProfile: async (req, res) => {
    try {
      const id = req.user.id;
      const email = req.user.email;

      const userProfile = await users.findOne({
        where: { id },
        attributes: ["id", "email", "createdAt"],
        include: [
          {
            model: user_profiles,
            attributes: ["name", "profilePhoto", "createdAt", "updatedAt"],
          },
        ],
      });

      if (!userProfile) {
        return helper.error(res, "user not found!", {}, 404);
      }

      return helper.success(res, "user profile fetched.", userProfile, 200);
    } catch (error) {
      console.log(error);
      return helper.error(res, "something went wrong!", {});
    }
  },

  // ---------- todos ----------

  createTodo: async (req, res) => {
    try {
      const { title, description, isComplete } = req.body;
      const userId = req.user.id;

      if (!title) {
        return helper.error(res, "title is required", {}, 400);
      }

      const todo = await todos.create({
        userId: userId,
        title,
        description,
        isComplete: Boolean(isComplete),
      });

      return helper.success(res, "todo created", todo, 201);
    } catch (error) {
      console.log(error);
      return helper.error(res, "something went wrong", {});
    }
  },

  getTodo: async (req, res) => {
    try {
      const userId = req.user.id;

      const todoList = await todos.findAll({
        where: { userId: userId },
        order: [["createdAt", "DESC"]],
      });

      return helper.success(res, "Todos fetched", todoList, 200);
    } catch (error) {
      console.log(error);
      return helper.error(res, "Something went wrong", {}, 400);
    }
  },

  updateTodo: async (req, res) => {
    try {
      const { id } = req.params; // todo id
      const userId = req.user.id;

      const { title, description, isComplete } = req.body;

      const todo = await todos.findOne({
        where: {
          id,
          userId,
        },
      });

      if (!todo) {
        return helper.error(res, "Todo not found", {}, 404);
      }

      await todo.update(
        {
          title: title ?? todo.title,
          description: description ?? todo.description,
          isComplete:
            isComplete !== undefined ? Boolean(isComplete) : todo.isComplete,
        },
        {
          where: { userId },
        }
      );

      return helper.success(res, "Todo updated", todo, 200);
    } catch (error) {
      console.log(error);
      return helper.error(res, "Something went wrong", {}, 500);
    }
  },

  deleteTodo: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const todo = await todos.findOne({
        where: {
          id,
          userId,
        },
      });

      if (!todo) {
        return helper.error(res, "Todo not found", {}, 404);
      }

      await todo.destroy();

      return helper.success(res, "Todo deleted successfully", {}, 200);
    } catch (error) {
      console.log(error);
      return helper.error(res, "Something went wrong", {}, 500);
    }
  },
};
