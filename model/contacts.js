const Contact = require('./schemas/Contact')
const { SUBSCRIPTIONS_TYPE } = require('../utils/constants')

const listContacts = async (userId, query) => {
  const { sortBy, sortByDesc, sub, select, limit = 5, page = 1 } = query
  try {
    const { docs: contacts, totalDocs: total, limit: newLimit, page: newPage } =
      await Contact
        .paginate(
          {
            owner: userId,
            subscription: sub || [...Object.values(SUBSCRIPTIONS_TYPE)],
          },
          {
            limit,
            page,
            sort: {
              ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
              ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
            },
            select: select ? select.split('|').join(' ') : '',
            populate: {
              path: 'owner',
              select: 'email -_id',
            }
          })

    return { data: { contacts, total, limit: newLimit, page: newPage } }
  } catch (error) {
    return { error }
  }
}

const getContactById = async (contactId, userId) => {
  try {
    return {
      data: await Contact.findOne({ _id: contactId, owner: userId }).populate({
        path: 'owner',
        select: 'email -_id',
      })
    }
  } catch (error) {
    return { error }
  }
}

const addContact = async (body, userId) => {
  try {
    return {
      data: await Contact.create({ ...body, owner: userId })
    }
  } catch (error) {
    return { error }
  }
}

const removeContact = async (contactId, userId) => {
  try {
    return {
      data: await Contact.findOneAndDelete({ _id: contactId, owner: userId })
    }
  } catch (error) {
    return { error }
  }
}

const updateContact = async (contactId, body, userId) => {
  try {
    return {
      data: await Contact.findOneAndUpdate({ _id: contactId, owner: userId }, body, { new: true })
    }
  } catch (error) {
    return { error }
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
