const prisma = require('../../config/db');

/**
 * List all contractors with filter by specialty and availability
 */
const list = async (userId, { specialty, available }) => {
  const where = { userId };
  if (specialty) where.specialty = specialty;
  if (available !== undefined) where.available = (available === 'true');
  
  return await prisma.contractor.findMany({
    where,
    orderBy: { rating: 'desc' },
  });
};

/**
 * Add contractor
 */
const create = async (userId, payload) => {
  return await prisma.contractor.create({
    data: {
      userId,
      name: payload.name,
      specialty: payload.specialty,
      rating: payload.rating || 0,
      contact: payload.contact,
      available: payload.available !== undefined ? payload.available : true,
    },
  });
};

/**
 * Update contractor
 */
const update = async (id, userId, payload) => {
  return await prisma.contractor.update({
    where: { id, userId },
    data: payload,
  });
};

/**
 * Delete contractor
 */
const remove = async (id, userId) => {
  return await prisma.contractor.delete({ where: { id, userId } });
};

/**
 * Suggest contractors by specialty (available=true)
 */
const suggestBySpecialty = async (specialty) => {
  return await prisma.contractor.findMany({
    where: { 
      specialty: { contains: specialty, mode: 'insensitive' }, 
      available: true 
    },
    orderBy: { rating: 'desc' },
    take: 5,
  });
};

module.exports = { list, create, update, remove, suggestBySpecialty };
