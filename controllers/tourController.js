const db = require("../config/db");

exports.getAllTours = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id as city_id, c.name as city, t.id as tour_id, t.image, t.title, t.price
      FROM cities c
      LEFT JOIN tours t ON c.id = t.city_id
    `);

    const grouped = rows.reduce((acc, row) => {
      const city = row.city;
      if (!acc[city]) acc[city] = [];
      if (row.tour_id) {
        acc[city].push({
          id: row.tour_id,
          image: row.image,
          title: row.title,
          price: row.price,
        });
      }
      return acc;
    }, {});

    const output = Object.keys(grouped).map((city) => ({
      city,
      city_id: rows.find((r) => r.city === city)?.city_id || null,
      tours: grouped[city],
    }));

    res.json(output);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Add new city
exports.addCity = (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO cities (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, name });
  });
};

// Add new tour to city
exports.addTour = (req, res) => {
  const { city_id, image, title, price } = req.body;
  const sql = "INSERT INTO tours (city_id, image, title, price) VALUES (?, ?, ?, ?)";
  db.query(sql, [city_id, image, title, price], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
};

// Update tour
exports.updateTour = (req, res) => {
  const { id } = req.params;
  const { image, title, price } = req.body;
  const sql = "UPDATE tours SET image = ?, title = ?, price = ? WHERE id = ?";
  db.query(sql, [image, title, price, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Tour updated successfully" });
  });
};

// Delete tour
exports.deleteTour = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tours WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Tour deleted successfully" });
  });
};
