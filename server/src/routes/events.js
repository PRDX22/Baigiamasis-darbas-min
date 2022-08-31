const express = require('express');
const mysql = require('mysql2/promise');
const DB_CONFIG = require('../../config');

const router = express.Router();

router.get('/events', async (req, res) => {
  try {
    const con = await mysql.createConnection(DB_CONFIG);
    const [rows] = await con.query('SELECT * from baig_darbas.events');
    await con.end();
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
    });
  }
});

router.get('/event/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const con = await mysql.createConnection(DB_CONFIG);
    const [[rows]] = await con.query(
      `SELECT * from baig_darbas.events WHERE id=${Number(id)}`,
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

module.exports = router;
