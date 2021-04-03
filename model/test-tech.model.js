const QATest = require('./schemas/QATest');

const getAll = async () => {
  try {
    const results = await QATest.find();
    return results;
  } catch (error) {
    return { error };
  }
};

const create = async body => {
  try {
    const results = await QATest.create(body);
    return results;
  } catch (error) {
    return { error };
  }
};

module.exports = {
  getAll,
  create,
};
