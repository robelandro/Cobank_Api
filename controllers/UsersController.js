import { v4 as uuidv4 } from 'uuid';
import User from '../utils/users';
import BasicAuthBank from '../utils/basicAuthBank';
import Files from '../utils/files';
import redisClient from '../utils/redis';

/* The AppController for retrieving the status and statistics of a
dbs and Redis client. */
class UsersController {
  /**
     * The function add a new staff to database
     * sends the result as a response.
     * @param req - The request parameter is an object that contains
     * @param res - The `response` parameter is an object
 */
  static async postNew(req, res) {
    const userID = await BasicAuthBank.onRegister(req, 'staff');
    if (userID) {
      const token = uuidv4();
      await redisClient.set(`auth_${token}`, userID.toString(), 86400);
      res.status(200).send({ token });
    } else {
      res.status(401).send({ error: 'Unauthorized' });
    }
  }

  /**
   * The function retrieves the post of users
   * sends the result as a response.
   * @param request - The request parameter is an object that contains
   * @param response - The `response` parameter is an object
   * containing the status of the database and Redis client.
   */
  static async getMe(request, response) {
    const token = request.headers['x-token'];
    if (!token) {
      response.status(401).send({ error: 'Unauthorized' });
    } else {
      const us = new User();
      const user = await us.findByToken(token);
      if (!user) {
        response.status(401).send({ error: 'Unauthorized' });
      } else {
        response.status(200).send({ id: user._id, userID: user.userID, userType: user.userType });
      }
    }
  }

  static async validateToken(request, response) {
    const token = request.headers['x-token'];
    if (!token) {
      response.status(401).send({ error: 'Unauthorized' });
      return null;
    }
    const us = new User();
    const user = await us.findByToken(token);
    if (!user) {
      response.status(401).send({ error: 'Unauthorized' });
      return null;
    }
    return user;
  }

  static async postUpload(request, userId) {
    const file = new Files(
      request.body.name,
      request.body.type,
      request.body.data,
      request.body.parentId,
      request.body.isPublic,
    );
    const result = await file.save(userId);
    return result;
  }

  static async addtional(req, res) {
    const userID = await BasicAuthBank.onRegister(req, 'client');
    if (userID) {
      const filefound = await UsersController.postUpload(req, userID);
      if (filefound.error) {
        res.status(400).send({ filefound });
      } else {
        const token = uuidv4();
        await redisClient.set(`auth_${token}`, userID.toString(), 86400);
        res.status(200).send({ token });
      }
    } else {
      res.status(401).send({ error: 'Unauthorized' });
    }
  }

  static async getStaff(request, response) {
    const us = new User();
    const { page } = request.query;
    const { limit } = request.query;
    const users = await us.getAllStaff(page, limit);
    if (users) {
      response.status(200).send(users);
    } else {
      response.status(404).send({ error: 'Not found' });
    }
  }

  /**
   *
   * @param {*} request
   * @param {*} response
   */
  static async deleteStaff(request, response) {
    const us = new User();
    const user = await us.removeStaff(request.body.name);
    if (user) {
      response.status(204).send();
    } else {
      response.status(404).send({ error: 'Not found' });
    }
  }
}

export default UsersController;
