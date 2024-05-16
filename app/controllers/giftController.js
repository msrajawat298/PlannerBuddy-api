import { Op } from 'sequelize'; 
import db from '../models/index.js';

const { event_gift: EventGift, guests: Guest, event_guests: EventGuest } = db;

// eslint-disable-next-line import/prefer-default-export
export const createEventGift = async (req, res) => {
  try {
    // Check if the guest exists or create a new guest
    const eventData = req.body;
    const { userId } = req;
    let guestId;

    if (!eventData.guestId) {
      // Create the guest
      const guest = await Guest.create({
        userId,
        name: eventData.guestInfo.name,
        email: eventData.guestInfo.email,
        phoneNumber: eventData.guestInfo.phoneNumber,
        address: eventData.guestInfo.address
      });

      // Assign the guestId for creating EventGift
      guestId = guest.dataValues.guestId;
      // Create association between event and guest
      await EventGuest.create({
        eventId: eventData.eventid,
        guestId
      });
    } else {
      // Use the provided guestID
      guestId = eventData.guestId;
    }

    // Create the event gift
    const eventGift = await EventGift.create({
      userId,
      eventId: eventData.eventid,
      guestId,
      amount: eventData.amount,
      note: eventData.note
    });

    return res.status(200).send({ error: false, message: 'Gift added', eventGift }); // Return the created event gift for confirmation
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

export const getEventGifts = async (req, res) => {
  try {
    const { userId } = req;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'DESC', filter = '{}' } = req.query;

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

    if (parsedFilter.name) {
      parsedFilter.name = { [Op.like]: `%${parsedFilter.name}%` };
    }

    const whereClause = { userId, ...parsedFilter };

    const eventGifts = await EventGift.findAndCountAll({
      where: whereClause,
      limit: parsedLimit,
      offset,
      order: [[sort, order]]
    });

    const totalPages = Math.ceil(eventGifts.count / parsedLimit);
    if (parsedPage > totalPages) {
      res.status(400).send({ error: true, message: 'No data found' });
      return;
    }

    res.status(200).send({
      error: false,
      message: 'Request completed',
      eventGifts: eventGifts.rows,
      currentPage: parsedPage,
      totalPages,
      totalData: eventGifts.count
    });
  } catch (err) {
    console.error('Error getting event gifts:', err);
    res.status(500).send({ message: 'Error getting event gifts' });
  }
};