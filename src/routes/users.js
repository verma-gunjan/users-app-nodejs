const express = require('express');
const userRouter = express.Router();
const { users, roles, groups } = require("../dummy_data/data");
const validateUserData = require("../validators/userValidator");
const checkPermission = require("../middleware/permissions");

let userList = [...users];

// GET /users
userRouter.get("/",checkPermission("VIEW"), (req, res) => {
  try {
    res.json(userList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /users/managed/:id
userRouter.get('/managed/:id',checkPermission("VIEW"), (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = userList.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.roles.includes('ADMIN')) return res.json([]);

    const managedUsers = userList.filter(u => u.id !== id && u.groups.some(g => user.groups.includes(g)));
    res.json(managedUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users
userRouter.post("/",checkPermission("CREATE"), (req, res) => {
  try {
    const { name, roles: userRoles, groups: userGroups } = req.body;

    if (!validateUserData(req.body)) {
      return res.status(400).json({ error: "Invalid profile data" });
    }

    const newId = Math.max(0, ...userList.map(u => u.id)) + 1;
    const newUser = { id: newId, name, roles: userRoles, groups: userGroups };
    userList.push(newUser);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /users/:id
userRouter.patch('/:id',checkPermission("EDIT"), (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = userList.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!validateUserData(req.body, true)) {
      return res.status(400).json({ error: "Invalid profile data" });
    }

    const { name, roles: userRoles, groups: userGroups } = req.body;

    if (name) user.name = name;
    if (userRoles && Array.isArray(userRoles)) user.roles = userRoles.filter(r => roles.includes(r));
    if (userGroups && Array.isArray(userGroups)) user.groups = userGroups.filter(g => groups.includes(g));

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /users/:id
userRouter.delete('/:id',checkPermission("DELETE"), (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = userList.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });

    const removedUser = userList.splice(index, 1)[0];
    res.json(removedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = userRouter;
