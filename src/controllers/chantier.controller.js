export const getAllChantiers = (req, res) => {
  res.json([
    { id: 1, name: "Chantier Alpha" }
  ]);
};

export const getChantierById = (req, res) => {
  const { id } = req.params;
  res.json({ id, name: "Chantier Alpha" });
};

export const createChantier = (req, res) => {
  res.status(201).json({ message: "Chantier created" });
};

export const updateChantier = (req, res) => {
  res.json({ message: "Chantier updated" });
};

