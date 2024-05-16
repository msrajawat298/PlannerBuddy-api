import { Op } from 'sequelize'; 
import db from '../models/index.js';

const { events: Event, event_guests: EventGuests, guests: Guest } = db;

export const addEvent = async (req, res) => {
  try {
    const { isYourEvent } = req.body;
    const event = await Event.create({
      ...req.body,
      userId: req.userId,
      eventStatus: 11
    });
    if ( isYourEvent === 'no' ) {
      await EventGuests.create({
        eventId: event.eventId,
        guestId: req.body.guestId
      });
    } 
    res
      .status(200)
      .send({ error: false, message: 'Event added successfully', eventId: event.eventId });
  } catch (err) {
    res.status(500).send({ error: true, message: err.message });
  }
};

export const getEvent = async (req, res) => {
  try {
    const { userId } = req;
    const { page = 1, limit = 10, sort = 'eventDate', order = 'DESC', filter = '{}' } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    const offset = (parsedPage - 1) * parsedLimit;

    let parsedFilter = {};
    try {
      parsedFilter = JSON.parse(filter);
    } catch (err) {
      console.error('Error parsing filter:', err);
      res.status(400).send({ message: 'Invalid filter format' });
      return;
    }
    if (parsedFilter.eventName) {
      parsedFilter.eventName = { [Op.like]: `%${parsedFilter.eventName}%` };
    }
    const whereClause = { userId, ...parsedFilter }; // Add filtering

    const events = await Event.findAndCountAll({
      where: whereClause,
      limit: parsedLimit,
      offset,
      order: [[sort, order]],
      attributes: ['eventId', 'eventName', 'eventDate', 'eventLocation', 'isYourEvent'],
      include: [{
        model: EventGuests,
        attributes: ['guestId'],
        include: [{
          model: Guest,
          attributes: ['guestId', 'name', ['phoneNumber', 'phone']]
        }]
      }]
    });

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
    const { eventId } = req.params;
    // Check if userId and eventId are provided
    if (!eventId) {
      res.status(422).send({ error: true, message: 'eventId is required' });
    }

    const events = await Event.findOne({ where: { userId, eventId },
      include: [{
        model: EventGuests,
        attributes: ['guestId'],
        include: [{
          model: Guest,
          attributes: ['guestId', 'name', ['phoneNumber', 'phone']]
        }]
      }] });

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
    const { eventId } = req.params;
    // Check if userId and eventId are provided
    if (!eventId) {
      return res.status(422).send({ error: true, message: 'eventId is required' });
    }
    const events = await Event.destroy({ where: { userId, eventId } });
    if (!events) {
      return res.status(404).send({ error: true, message: 'Data not found' });
    }

    return res.status(200).send({ error: false, message: 'Request completed' });
  } catch (err) {
    return res.status(500).send({ error: true, message: err.message });
  }
};

export const addGuestToEvent = async (req, res) => {
  try {
    const { eventId, guestId } = req.body;
    // Filter out duplicate guestIds
    const uniqueGuestIds = [...new Set(guestId)];

    // Prepare the data to be inserted
    const eventData = uniqueGuestIds.map((id) => ({ eventId, guestId: id }));
    // Perform bulk create operation, ignoring duplicates
    await EventGuests.bulkCreate(eventData, { ignoreDuplicates: true });
    res.status(200).send({ error: false, message: 'Guests added successfully' });
  } catch (err) {
    res.status(500).send({ error: true, message: err.message });
  }
};

export const getEventGuests = async (req, res) => {
  try {
    const eventGuests = await EventGuests.findAll({ where: { eventId: req.query.eventId } });
    if (!eventGuests) {
      return res.status(404).send({ error: true, message: 'Data not found' });
    }
    const eventGuestsData = {
      eventId: eventGuests[0].eventId, // Assuming eventId is common
      guestId: eventGuests.map((eventGuest) => eventGuest.guestId)
    };
    return res.status(200).send({ error: false, message: 'Request completed', eventGuestsData });
  } catch (err) {
    return res.status(500).send({ error: true, message: err.message });
  }
};
