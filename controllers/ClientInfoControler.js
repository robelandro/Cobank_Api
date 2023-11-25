import ClientInfo from '../utils/clientInfo';
import User from '../utils/users';
/**
 * The AppController for retrieving the status and statistics of a
 */
class ClientInfoControler {
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

  /**
   * The function retrieves the post of users
   * @param {*} req
   * @param {*} res
   */
  static async accountCreate(req, res) {
    const clientInfo = new ClientInfo();
    const result = await clientInfo.createNewUser(req.body);
    if (result.error) {
      res.status(400).send({ error: result.error });
    } else {
      res.status(201).send(result);
    }
  }

  static async getMecustomer(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      const clientInfo = new User();
      const user = await clientInfo.findByToken(token);
      if (!user) {
        res.status(401).send({ error: 'Unauthorized' });
      } else {
        const cust = new ClientInfo();
        console.log(user);
        const userInfo = await cust.getUsetInfo(user.userID);
        if (!userInfo) {
          res.status(401).send({ error: 'Customer Not found' });
        } else {
          res.status(200).send(userInfo);
        }
      }
    }
  }

  /**
   * all the customer info
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async getClient(req, res) {
    const user = await ClientInfoControler.validateToken(req, res);
    if (!user) {
      return;
    }
    else {
      const { page, limit } = req.query;
      const cust = new ClientInfo();
      const userInfo = await cust.getAllUsers(page, limit);
      if (!userInfo) {
        return res.status(401).send({ error: 'Customer Not found' });
      } else {
        return res.status(200).send(userInfo);
      }
    }
  }
}
export default ClientInfoControler;
