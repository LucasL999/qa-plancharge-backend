import { getAllCalendarEvents, createCalendarEvent, updateCalendarEvent, getCalendarEventById } from '../services/calendar.service.js';

export const getAll = (req, res) => {
  res.json(getAllCalendarEvents());
};

export const getById = (req, res) => {
  const { id } = req.params;
  res.json(getCalendarEventById(id));
};

export const create = (req, res) => {
  const calendarEventData = req.body;
  const newCalendarEvent = createCalendarEvent(calendarEventData);
  res.status(201).json(newCalendarEvent);
};

export const update = (req, res) => {
  const { id } = req.params;
  const calendarEventData = req.body;
  const updatedCalendarEvent = updateCalendarEvent(id, calendarEventData);
  res.json(updatedCalendarEvent);
};

