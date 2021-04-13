const usersModel = require('../model/users');
const { createResponse } = require('../utils/createResponse');
const { HTTP_CODE, ROLE } = require('../utils/constants');

const getCurrentUser = async (req, res) => {
  const userId = req.user._id;
  const { data, error } = await usersModel.findUserById(userId);

  const code = data ? HTTP_CODE.OK : HTTP_CODE.NOT_FOUND;
  const user = data
    ? {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      }
    : undefined;

  return createResponse(res, user, error, code);
};

const getAll = async (req, res, next) => {
  try {
    const { role } = req.params;
    if (role !== ROLE.ADMIN && role !== ROLE.STUDENT) {
      return res.status(HTTP_CODE.BAD_CONTENT).json({
        status: 'error',
        code: HTTP_CODE.BAD_CONTENT,
        data: { message: 'Bad content' },
      });
    }

    const { data } = await usersModel.getAllUsers();

    const allUsersList = data
      .filter(user => user.role === role.toLowerCase())
      .map(
        ({
          name,
          email,
          subscription,
          role,
          verify,
          onlyGoogleRegister,
          avatar,
          createdAt,
          updatedAt,
        }) => {
          return {
            name,
            email,
            subscription,
            role,
            verify,
            onlyGoogleRegister,
            avatar,
            createdAt,
            updatedAt,
          };
        },
      );

    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      data: allUsersList,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { data } = await usersModel.findUserByEmail(req.params.email);

    if (!data) {
      return res.status(HTTP_CODE.NOT_FOUND).json({
        status: 'error',
        code: HTTP_CODE.NOT_FOUND,
        data: { message: "Cann't found user with such email" },
      });
    }

    const { body } = req;
    const response = await usersModel.updateUserById(data._id, body);

    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      data: {
        name: response.data.name,
        email: response.data.email,
        subscription: response.data.subscription,
        role: response.data.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { data } = await findUserByEmail(req.params.email);

    if (!data) {
      return res.status(HTTP_CODE.NOT_FOUND).json({
        status: 'error',
        code: HTTP_CODE.NOT_FOUND,
        data: { message: "Cann't found user with such email" },
      });
    }

    if (req.user._id === data._id) {
      return res.status(HTTP_CODE.BAD_CONTENT).json({
        status: 'error',
        code: HTTP_CODE.BAD_CONTENT,
        data: { message: "You cann't delete yourself" },
      });
    }

    await usersModel.removeUser(data._id);

    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      message: 'user deleted',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentUser,
  getAll,
  updateUser,
  deleteUser,
};
