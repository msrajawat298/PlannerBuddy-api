import { Op } from 'sequelize'; 
import db from '../models/index.js';

const { guests: Guest } = db;

export const addGuest = (req, res) => {
  Guest.findOrCreate({
    where: { phoneNumber: req.body.phoneNumber },
    defaults: { ...req.body, userId: req.userId }
  }).then(([guest, created]) => {
    if (created) {
      // If a new guest was created, send a success response
      res.status(200).send({ error: false, message: 'Guest added successfully', data: { guestId: guest.guestId } });
    } else {
      // If a guest with the same mobile number already exists, send an error response
      res.status(400).send({ error: true, message: 'Guest with this mobile number already exists.' });
    }
  })
    .catch(err => {
      console.error('Error saving guest:', err);
      return res.status(500).send('Error saving guest.');
    });
};

// Method to delete a guest
export const deleteGuest = (req, res) => {
  const { guestId } = req.params;
  const { userId } = req;

  Guest.destroy({ where: { guestId, userId }}).then(num => {
    if (num === 1) {
      res.send({ message: 'Guest deleted successfully!' });
    } else {
      res.send({ message: 'Guest not found!' });
    }
  }).catch((error) => {
    console.error('Error deleting guest:: ', error);
    res.status(500).send({ message: `Could not delete Guest with id=${  guestId}`, error:true, data: error });
  });
};

// Method to update details of an existing guest
export const updateGuest = (req, res) => {
  const { userId } = req;
  const { guestId } = req.params;
  Guest.update(
    {...req.body, userId: req.userId},
    { where: { userId, guestId } }
  ).then(([affectedCount]) => {
    if (affectedCount > 0) {
      res.send({ message: 'Guest updated successfully!' });
    } else {
      res.send({ error: true, message: 'No Guest Found' });
    }
  }).catch((err) => {
    console.error('Error updating guest:', err);
    res.status(500).send({ message: `Error updating Guest with id=${  guestId}` });
  });
};

export const getGuests = async (req, res) => {
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
      res.status(400).send({ error: true, message: 'Invalid filter format' });
      return;
    }
    // If a name is provided in the filter, use the Op.like operator
    if (parsedFilter.name) {
      parsedFilter.name = { [Op.like]: `%${parsedFilter.name}%` };
    }

    const whereClause = { userId, ...parsedFilter }; // Add filtering

    const guests = await Guest.findAndCountAll({ 
      where: whereClause, 
      limit: parsedLimit, 
      offset, 
      order: [[sort, order]]
    });

    const totalPages = Math.ceil(guests.count / parsedLimit);
    if (parsedPage > totalPages) {
      res.status(400).send({ error: true, message: 'No data found' });
      return;
    }
    res.status(200).send({
      error: false,
      message: 'Request completed',
      guests: guests.rows,
      currentPage: parsedPage,
      totalPages,
      totalData: guests.count
    });
  } catch (err) {
    console.error('Error getting guests:', err);
    res.status(500).send({ error: true, message: 'Error getting guests' });
  }
};

export const getGuestByid = (req, res) => {
  const { userId } = req;
  const { guestId } = req.params;
  Guest.findOne({ where: { userId, guestId } }).then((guest) => {
    if (guest) {
      res.send({ data: guest });
    } else {
      res.send({ error: true, message: 'Guest not found!' });
    }
  }).catch((err) => {
    console.error('Error getting guest:', err);
    res.status(500).send({ error: true, message: 'Error getting guest' });
  });
};

export const syncGuest = async (req, res) => {
  const { userId } = req;
  const guests = req.body;
  
  // Check for duplicates within the request data
  const phoneNumberSet = new Set();
  const hasDuplicate = guests.some(guest => {
    if (phoneNumberSet.has(guest.phoneNumber)) return true;

    phoneNumberSet.add(guest.phoneNumber);
    return false;
  });

  if (hasDuplicate) {
    return res.status(400).send({
      error: true,
      message: 'Duplicate phone number found in request.'
    });
  }
  const phoneNumbers = Array.from(phoneNumberSet);

  try {
    // Check for duplicates in the database
    const existingGuests = await Guest.findAll({
      where: {
        phoneNumber: {
          [db.Sequelize.Op.in]: phoneNumbers
        }
      }
    });

    const existingPhoneNumbers = existingGuests.map(guest => guest.phoneNumber);

    if (existingPhoneNumbers.length > 0) {
      return res.status(400).send({ 
        error: true, 
        message: `Phone numbers already exist: ${existingPhoneNumbers.join(', ')}`
      });
    }

    // Add userId to each guest object
    const guestsWithUserId = guests.map(guest => ({ ...guest, userId }));

    // Start a transaction
    const transaction = await Guest.sequelize.transaction();

    try {
      // Bulk create guests
      const savedGuests = await Guest.bulkCreate(guestsWithUserId, { transaction, returning: true });

      // Commit the transaction
      await transaction.commit();

      // Extract guest IDs from the saved guests
      const guestIds = savedGuests.map(guest => guest.guestId);

      // Respond with the saved guest objects
      return res.status(200).send({ 
        error: false, 
        message: 'Guests added successfully', 
        data: guestIds 
      });
    } catch (err) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      console.error('Error saving guests:', err);
      return res.status(500).send({ error: true, message: 'Error saving guests.' });
    }
  } catch (err) {
    console.error('Error querying database:', err);
    return res.status(500).send({ error: true, message: 'Error checking for existing guests.' });
  }
};
