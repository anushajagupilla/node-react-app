'use strict';

const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const { uuid } = require('uuidv4');
const NodeCache = require("node-cache");
const DATABASE = new NodeCache();
DATABASE.set('employee', []);

const createSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3).required(),
  lastName: Joi.string().alphanum().min(3).required(),
  hireDate: Joi.date().max('now').required(),
  role: Joi.string().valid("CEO", "VP", "MANAGER", "LACKEY").required(),
  favJoke: Joi.string(),
})

const updateSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3),
  lastName: Joi.string().alphanum().min(3),
  hireDate: Joi.date().max('now'),
  role: Joi.string().valid("CEO", "VP", "MANAGER", "LACKEY"),
  favJoke: Joi.string(),
  // id: Joi.string(),
})

const success = (data, msg = '') => {
  const resp = {
    status: 'success',
    data
  }
  if (msg) {
    delete resp.data;
    resp.message = msg
  }
  return resp;
}

const error = (message) => {
  return {
    status: 'error',
    message
  }
}

const createEmployee = async (req, res) => {
  const { body } = req;
  if (body) {
    try {
      const value = await createSchema.validateAsync(body);
      if (value) {
        const userData = {
          id: uuid(),
          ...value
        }
        const db = DATABASE.get('employee');
        db.push(userData);
        DATABASE.set('employee', db);
        res.status(201).json(success(userData))
      } else {
        res.status(400).json(error("Invalid data"))
      }
    }
    catch (err) {
      res.status(400).json(error(err.message))
    }
  } else {
    res.status(400).json(error("Invalid data"))
  }
}

const getEmployee = async (req, res) => {
  const { params: { id = '' } } = req;
  if (id) {
    const user = DATABASE.get('employee').find(emp => emp.id === id);
    if (user) {
      return res.json(success(user));
    } else {
      return res.json(success({}));
    }
  } else {
    res.status(400).json(error("Invalid data"))
  }
}

const updateEmployee = async (req, res) => {
  const { params: { id = '' }, body } = req;
  if (id) {
    let db = DATABASE.get('employee');
    const userIndex = db.findIndex(emp => emp.id === id);
    if (userIndex > -1) {
      try {
        const value = await updateSchema.validateAsync(body);
        if (value) {
          const userData = {
            ...db[userIndex],
            ...value
          }
          db[userIndex] = userData;
          DATABASE.set('employee', db);
          return res.json(success(userData));
        } else {
          return res.status(400).json(error("Invalid data"));
        }
      } catch (e) {
        res.status(400).json(error(e.message))
      }
    } else {
      return res.status(400).json(error("Invalid data"));
    }
  } else {
    res.status(400).json(error("Invalid data"))
  }
}

const deleteEmployee = async (req, res) => {
  const { params: { id = '' } } = req;
  let db = DATABASE.get('employee');
  if (id) {
    const userIndex = db.findIndex(emp => emp.id === id);
    if (userIndex > -1) {
      db.splice(userIndex, 1);
      DATABASE.set('employee', db);
      return res.json(success("", "Deleted successfully"));
    } else {
      return res.status(400).json(error("Invalid data"));
    }
  } else {
    res.status(400).json(error("Invalid data"))
  }
}

/* GET employees listing. */
router.get('/', function (req, res) {
  return res.json(success(DATABASE.get('employee')));
});
router.post('/', createEmployee);
router.get('/:id', getEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
