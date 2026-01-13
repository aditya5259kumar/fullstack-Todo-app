var DataTypes = require("sequelize").DataTypes;
var _todos = require("./todos");
var _user_profiles = require("./user_profiles");
var _users = require("./users");

function initModels(sequelize) {
  var todos = _todos(sequelize, DataTypes);
  var user_profiles = _user_profiles(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  todos.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(todos, { as: "todos", foreignKey: "userId"});
  user_profiles.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasOne(user_profiles, { as: "user_profile", foreignKey: "userId"});

  return {
    todos,
    user_profiles,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
