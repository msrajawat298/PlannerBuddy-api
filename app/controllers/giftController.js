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
