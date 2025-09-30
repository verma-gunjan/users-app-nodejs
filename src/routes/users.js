const express = require('express');
const userRouter = express.Router();
const { users, roles, groups } = require("../dummy_data/data")
const permissionGuard = require("../middleware/permissions")

let userList = [...users];
userRouter.get("/", async (req, res)=>{
})

userRouter.post("/", async (req, res)=>{
})

userRouter.patch('/:id', async (req, res)=>{
})

userRouter.delete('/:id', async (req, res)=>{
})

module.exports = userRouter;
