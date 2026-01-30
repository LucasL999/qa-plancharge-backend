export const getAllCalendarEvents = (req, res) => {
  res.json([
    { id: 1, name: "Calendar Event Alpha" }
  ]);
};

export const getCalendarEventById = (req, res) => {
  const { id } = req.params;
  res.json({ id, name: "Calendar Event Alpha" });
};

export const createCalendarEvent = (req, res) => {
  res.status(201).json({ message: "Calendar Event created" });
};

export const updateCalendarEvent = (req, res) => {
  res.json({ message: "Calendar Event updated" });
};

