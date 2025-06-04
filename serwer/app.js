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
    const result = await pool.query('SELECT * from blog');
    res.send(result.rows);
  } catch (err) {
    console.log('Tablica nie istnieje, tworze tablice')
    try{
      const result = await pool.query(`CREATE TABLE blog (
         id SERIAL PRIMARY KEY,
         owner TEXT NOT NULL,
         tytul TEXT NOT NULL,
         zawartosc TEXT NOT NULL
         );`)
      res.status(200).send("Tabela zostala stworzona");
    }catch(err){
    console.error('Błąd zapytania:', err);
    res.status(500).send('Błąd połączenia z bazą danych');
    }
  }
});

app.post('/add-db', async (req, res) => {
  const { owner, tytul, zawartosc } = req.body;
  if (!owner || !tytul || !zawartosc) {
    return res.status(400).send('Brakuje danych: owner, tytul lub zawartosc');
  }
    try{
      const result = await pool.query('INSERT INTO blog (owner, tytul, zawartosc) VALUES ($1, $2, $3)',
      [owner, tytul, zawartosc])
      res.status(200).send("przedmiot zostal dodany");
    }catch(err){
    console.error('Błąd zapytania:', err);
    res.status(500).send('Błąd połączenia z bazą danych');
    }
});