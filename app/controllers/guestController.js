import { Op } from 'sequelize'; 
import db from '../models/index.js';

const { guests: Guest } = db;

// Method to add new guests
export const addGuest = (req, res) => Guest.create({ ...req.body, userId: req.userId }).then(savedGuest => 
// Respond with the saved guest object
  res.status(200).send({ error: false, message: 'Guest added successfully', data: {guestId: savedGuest.guestId} })
).catch(err => {
  console.error('Error saving guest:', err);
  return res.status(500).send('Error saving guest.');
});

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
      res.status(400).send({ message: 'Invalid filter format' });
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
    res.status(500).send({ message: 'Error getting guests' });
  }
};

export const getGuestByid = (req, res) => {
  const { userId } = req;
  const { guestId } = req.params;
  Guest.findOne({ where: { userId, guestId } }).then((guest) => {
    if (guest) {
      res.send({ data: guest });
    } else {
      res.send({ message: 'Guest not found!' });
    }
  }).catch((err) => {
    console.error('Error getting guest:', err);
    res.status(500).send({ message: 'Error getting guest' });
  });
};
