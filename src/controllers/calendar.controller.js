import { getAllCalendarEvents, createCalendarEvent, updateCalendarEvent, getCalendarEventById } from '../services/calendar.service.js';

export const getAllCalendarEvents = (req, res) => {
  res.json(getAllCalendarEvents());
};

export const getCalendarEventById = (req, res) => {
  const { id } = req.params;
  res.json(getCalendarEventById(id));
};

export const createCalendarEvent = (req, res) => {
  res.status(201).json({ message: "Calendar Event created" });
};

export const updateCalendarEvent = (req, res) => {
  res.json({ message: "Calendar Event updated" });
};

