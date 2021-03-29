const { contacts } = require('./data')

const listContacts = jest.fn((userId, query) => {
  const { limit = 5, page = 1 } = query
  return { data: { contacts, total:contacts.length, limit, page } }
})

const getContactById = jest.fn((contactId, userId) => {
  const [contact] = contacts.filter(contact => String(contact._id) === String(contactId))
  return { data: contact }
})

const addContact = jest.fn((body, userId) => {
  contacts.push({ ...body, _id: '60469b1f318c1b3c906f9ff0' })
  return { data: { ...body, _id: '60469b1f318c1b3c906f9ff0' } }
})

const removeContact = jest.fn((contactId, userId) => {
  const index = contacts.findIndex(contact => String(contact._id) === String(contactId))
  if (index === -1) return null
  const [contact] = contacts.splice(index, 1)
  return { data: contact }


})

const updateContact = jest.fn((contactId, body, userId) => {
  let [contact] = contacts.filter(contact => String(contact._id) === String(contactId))
  if (contact) {
    contact = { ...contact, ...body }
  }
  return { data: contact }
})

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
