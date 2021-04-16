const QATestTech = require('./schemas/QATestTech');

const getAll = async () => {
  try {
    const results = await QATestTech.find();
    return results;
  } catch (error) {
    return { error };
  }
};

const create = async body => {
  try {
    const results = await QATestTech.create(body);
    return results;
  } catch (error) {
    return { error };
  }
};

module.exports = {
  getAll,
  create,
};
