import { Op } from 'sequelize'; 
import db from '../models/index.js';

const { event_gift: EventGift, guests: Guest, event_guests: EventGuest, events: Event } = db;

// eslint-disable-next-line import/prefer-default-export
export const createEventGift = async (req, res) => {
  try {
    // Check if the guest exists or create a new guest
    const giftData = req.body;
    const { userId } = req;
    let guestId;
    if (!giftData.guestId) {
      // Create the guest
      const guest = await Guest.create({
        userId,
        name: giftData.guestInfo.name,
        email: giftData.guestInfo.email,
        phoneNumber: giftData.guestInfo.phoneNumber,
        address: giftData.guestInfo.address,
        isYourGift: giftData.isYourGift
      });

      // Assign the guestId for creating EventGift
      guestId = guest.dataValues.guestId;
      // Create association between event and guest
      await EventGuest.create({
        eventId: giftData.eventId,
        guestId
      });
    } else {
      // Use the provided guestID
      guestId = giftData.guestId;
    }
    console.log('eventData:', giftData.isYourGift);
    // Create the event gift
    const eventGift = await EventGift.create({
      userId,
      eventId: giftData.eventId,
      guestId,
      amount: giftData.amount,
      note: giftData.note,
      isYourGift: giftData.isYourGift
    });

    return res.status(200).send({ error: false, message: 'Gift added', data: {giftId: eventGift.giftId} }); // Return the created event gift for confirmation
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

export const getEventGifts = async (req, res) => {
  try {
    const { userId } = req;
    const { page = 1, limit = 10, sort = 'isYourGift', order = 'DESC', filter = '{}' } = req.query;

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

    if (parsedFilter.note) {
      parsedFilter.note = { [Op.like]: `%${parsedFilter.note}%` };
    }

    const whereClause = { userId, ...parsedFilter };

    const eventGifts = await EventGift.findAndCountAll({
      where: whereClause,
      limit: parsedLimit,
      offset,
      order: [[sort, order]],
      attributes: ['giftId', 'amount', 'note', 'isYourGift'],
      include: [
        {
          model: Guest,
          attributes: ['name']
        },
        {
          model: Event,
          attributes: ['eventName']
        }
      ]
    });
    const totalPages = Math.ceil(eventGifts.count / parsedLimit);
    if (parsedPage > totalPages) {
      res.status(400).send({ error: true, message: 'No data found' });
      return;
    }
    const mergedEventGifts = eventGifts.rows.map(gift => ({
      giftId: gift.giftId,
      amount: gift.amount,
      note: gift.note,
      isYourGift: gift.isYourGift,
      guestName: gift.guest.name,
      eventName: gift.event.eventName
    }));
    res.status(200).send({
      error: false,
      message: 'Request completed',
      eventGifts: mergedEventGifts,
      currentPage: parsedPage,
      totalPages,
      totalData: eventGifts.count
    });
  } catch (err) {
    console.error('Error getting event gifts:', err);
    res.status(500).send({ message: 'Error getting event gifts' });
  }
};

export const deleteGift = async (req, res) => {
  const { userId } = req;
  const { giftId } = req.params;
  EventGift.destroy({ where: { giftId, userId }}).then(num => {
    if (num === 1) {
      res.send({ message: 'Gift deleted successfully!' });
    } else {
      res.send({ message: 'Gift not found!' });
    }
  }).catch((error) => {
    console.error('Error deleting Gift:: ', error);
    res.status(500).send({ message: `Could not delete Gift with id=${giftId}`, error:true, data: error });
  });
};