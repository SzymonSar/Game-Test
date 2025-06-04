const express = require("express");
const cors = require("cors")
const app = express();
const port = process.env.PORT || 10000;

const corsoptions = {

}

app.use(cors(corsoptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//wyslanie html do klienta
app.get("/", (req, res) => res.type('html').send(html));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

//pobieranie html z pliku
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'app.html'), 'utf-8');

const { Pool } = require('pg');

// Połączenie z bazą
const pool = new Pool({
  connectionString: process.env.LINKINT,
  ssl: {
    rejectUnauthorized: false
  }
});


app.get('/get-db', async (req, res) => {
  try {
    const { owner } = req.query; 
    let result;
    if(owner){
      result = await pool.query('SELECT * from game_all where owner != $1', [owner]);
    }else{
      result = await pool.query('SELECT * from game_all');
  }
    res.send(result.rows);
  } catch (err) {
    console.log('Tablica nie istnieje, tworze tablice')
    try{
      const result = await pool.query(`CREATE TABLE game_all (
          id SERIAL PRIMARY KEY,
          owner TEXT NOT NULL,
          px INTEGER NOT NULL,
          py INTEGER NOT NULL,
          color TEXT NOT NULL
         );`)
      res.status(200).send("Tabela zostala stworzona");
    }catch(err){
    console.error('Błąd zapytania:', err);
    res.status(500).send('Błąd połączenia z bazą danych');
    }
  }
});

app.post('/add-db', async (req, res) => {
  const { owner, px, py, color }  = req.body;
  if (!owner || !tytul || !zawartosc) {
    return res.status(400).send('Brakuje danych: owner, px, py lub color');
  }

  try {
    const existing = await pool.query('SELECT * FROM game_all WHERE owner = $1', [owner]);
    if (existing.rows.length > 0) {
      await pool.query(
        'UPDATE game_all SET px = $1, py = $2, color = $3 WHERE owner = $4',
        [px, py, color, owner]
      );
      res.status(200).send('Wpis zaktualizowany');
    } else {
      await pool.query(
        'INSERT INTO game_all (owner, px, py, color) VALUES ($1, $2, $3, $4)',
        [owner, px, py, color]
      );
      res.status(200).send('Nowy wpis dodany');
    }
  } catch (err) {
    console.error('Błąd zapytania:', err);
    res.status(500).send('Błąd połączenia z bazą danych');
  }
});