const QATestTheory = require('./schemas/QATestTheory');

const getAll = async () => {
  try {
    const results = await QATestTheory.find();
    return results;
  } catch (error) {
    return { error };
  }
};

const create = async body => {
  try {
    const results = await QATestTheory.create(body);
    return results;
  } catch (error) {
    return { error };
  }
};

module.exports = {
  getAll,
  create,
};
