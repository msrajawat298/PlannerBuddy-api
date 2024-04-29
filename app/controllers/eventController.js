import db from '../models/index.js';

const { events: Event, event_guests: EventGuests } = db;

export const addEvent = (req, res) => {
  try {
    const event = new Event({ ...req.body, userId: req.userId, eventStatus: 11 });
    event.save();
    res.status(200).send({ error: false, message: 'Event added successfully' });
  } catch (err) {
    res.status(500).send({ error: true, message: err.message });
  }
};

export const getEvent = async (req, res) => {
  try {
    const { userId } = req;
    const { page = 1, limit = 10 } = req.query; // default page 1 & default limit 10

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    const offset = (parsedPage - 1) * parsedLimit;

    const events = await Event.findAndCountAll({ where: { userId }, limit: parsedLimit, offset });

    const totalPages = Math.ceil(events.count / parsedLimit);
    if (parsedPage > totalPages) {
      res.status(400).send({ error: true, message: 'No data found' });
      return;
    }
    res.status(200).send({
      error: false,
      message: 'Request completed',
      events: events.rows,
      currentPage: parsedPage,
      totalPages,
      totalData: events.count
    });
  } catch (err) {
    res.status(500).send({ error: true, message: err.message });
  }
};

export const getEventByid = async (req, res) => {
  try {
    const { userId } = req;
    const { eventId } = req.query;
    // Check if userId and eventId are provided
    if (!eventId) {
      res.status(422).send({ error: true, message: 'eventId is required' });
    }

    const events = await Event.findOne({ where: { userId, eventId } });

    if (!events || userId !== events.userId) {
      res.status(404).send({ error: true, message: 'Data not found' });
    }

    res.status(200).send({ error: false, message: 'Request completed', event: events });
  } catch (err) {
    res.status(500).send({ error: true, message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { userId } = req;
    const { eventId, eventName, eventDate, eventTime, eventLocation, eventStatus } = req.body;

    if (!eventId) {
      res.status(422).send({ error: true, message: 'eventId is required' });
    }
    const eventUpdated = await Event.update(
      { eventName, eventDate, eventTime, eventLocation, eventStatus },
      { where: { userId, eventId } }
    );

    if (!eventUpdated) {
      res.status(404).send({ error: true, message: 'Not found' });
    }

    res.status(200).send({ error: false, message: 'Request completed' });
  } catch (err) {
    res.status(500).send({ error: true, message: err.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { userId } = req;
    const { eventId } = req.query;
    // Check if userId and eventId are provided
    if (!eventId) {
      res.status(422).send({ error: true, message: 'eventId is required' });
    }
    const events = await Event.destroy({ where: { userId, eventId } });

    if (!events) {
      res.status(404).send({ error: true, message: 'Data not found' });
    }

    res.status(200).send({ error: false, message: 'Request completed' });
  } catch (err) {
    res.status(500).send({ error: true, message: err.message });
  }
};

export const addGuestToEvent = async (req, res) => {
  try {
    const { guests } = req.body;
    await EventGuests.bulkCreate(guests);
    res.status(200).send({ error: false, message: 'Guest added completed' });
  } catch (err) {
    res.status(500).send({ error: true, message: err.message });
  }
};
