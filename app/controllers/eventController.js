import db from '../models/index.js';

const { events: Event, event_guests: EventGuests } = db;

export const addEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      userId: req.userId,
      eventStatus: 11
    });
    res.status(200).send({ error: false, message: 'Event added successfully', eventId: event.eventId});
  } catch (err) {
    res.status(500).send({ error: true, message: err.message });
  }
};

export const getEvent = async (req, res) => {
  try {
    const { userId } = req;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'DESC', filter = '{}' } = req.query; // default page 1, default limit 10, default sort by createdAt, default order DESC, default filter {}

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    const offset = (parsedPage - 1) * parsedLimit;

    let parsedFilter = {};
    try {
      parsedFilter = JSON.parse(filter); // Try to parse filter
    } catch (err) {
      console.error('Error parsing filter:', err);
      res.status(400).send({ message: 'Invalid filter format' });
      return;
    }

    const whereClause = { userId, ...parsedFilter }; // Add filtering

    const events = await Event.findAndCountAll({ 
      where: whereClause, 
      limit: parsedLimit, 
      offset, 
      order: [[sort, order]] // Add sorting
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
