const express = require('express');
const Joi = require('joi');
const mysql = require('mysql2/promise');
const DB_CONFIG = require('../../config');

const router = express.Router();

const updateSchema = Joi.object({
  eventsId: Joi.string(),
  name: Joi.string(),
  email: Joi.string(),
  birthDate: Joi.string(),
});

// const registerSchema = Joi.object({
//   eventsId: Joi.string().required(),
//   name: Joi.string().required(),
//   email: Joi.string()
//     .email({
//       minDomainSegments: 3,
//       tlds: { allow: ['com', 'net', 'lt'] },
//     })
//     .required(),
//   birthDate: Joi.string().required(),
// });

router.get('/guests', async (req, res) => {
  try {
    const con = await mysql.createConnection(DB_CONFIG);
    const [rows] = await con.query(
      'SELECT * from baig_darbas.events JOIN baig_darbas.guests ON baig_darbas.events.id = baig_darbas.guests.eventsId',
    );
    await con.end();
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
    });
  }
});

router.get('/guest/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const con = await mysql.createConnection(DB_CONFIG);
    const [[rows]] = await con.query(
      `SELECT * from baig_darbas.guests WHERE id=${Number(id)}`,
    );
    await con.end();
    return res.json(rows || {});
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
    });
  }
});

router.delete('/guest/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const con = await mysql.createConnection(DB_CONFIG);
    const [resp] = await con.query(
      `DELETE FROM baig_darbas.guests WHERE id="${Number(id)}"`,
    );
    await con.end();
    return res.json(resp);
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
    });
  }
});

router.patch('/guest/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, birthDate } = req.body;
  try {
    try {
      await updateSchema.validateAsync({
        name,
        email,
        birthDate,
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        err,
      });
    }

    const userData = {};
    if (name) userData.name = name;
    if (email) userData.email = email;
    if (birthDate) userData.birthDate = birthDate;
    const con = await mysql.createConnection(DB_CONFIG);
    const [resp] = await con.query(
      `UPDATE baig_darbas.guests SET ? WHERE id="${Number(id)}"`,
      userData,
    );
    await con.end();
    return res.json(resp);
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
    });
  }
});

router.post('/add', async (req, res) => {
  const { eventsId, name, email, birthDate } = req.body;
  try {
    // try {
    //   await registerSchema.validateAsync({ eventsId, name, email, birthDate });
    // } catch (err) {
    //   return res.status(400).json({
    //     status: 400,
    //     err,
    //   });
    // }
    const con = await mysql.createConnection(DB_CONFIG);
    const [rows] = await con.query(
      `SELECT email from baig_darbas.guests WHERE email="${email}"`,
    );
    if (rows.length > 0) {
      return res
        .status(400)
        .json({ status: 400, err: 'Email already exists!' });
    }
    const [resp] = await con.query('INSERT INTO baig_darbas.guests SET ?', {
      eventsId,
      name,
      email,
      birthDate,
    });
    await con.end();
    return res.json(resp);
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
    });
  }
});

module.exports = router;
