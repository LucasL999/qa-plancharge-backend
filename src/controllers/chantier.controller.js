import { getAllChantiers, createChantier, updateChantier, getChantierById } from '../services/chantier.service.js';

export const getAllChantiers = (req, res) => {
  res.json(getAllChantiers());
};

export const getChantierById = (req, res) => {
  const { id } = req.params;
  res.json(getChantierById(id));
};

export const createChantier = (req, res) => {
  const chantierData = req.body;
  const newChantier = createChantier(chantierData);
  res.status(201).json(newChantier);
};

export const updateChantier = (req, res) => {
  const { id } = req.params;
  const chantierData = req.body;
  const updatedChantier = updateChantier(id, chantierData);
  res.json(updatedChantier);
};

