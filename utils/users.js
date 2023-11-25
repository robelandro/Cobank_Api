import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import dbClient from './db';
import redisClient from './redis';

class User {
  constructor() {
    this.dbs = dbClient.mongoClient.db(dbClient.database);
    this.users = this.dbs.collection('users');
  }

  /**
   *
   * @param {*} userID
   * @param {*} upassword
   * @returns
   */
  async findUserByUserID(userID, upassword) {
    try {
      if (arguments.length === 1) {
        const query = { userID };
        const user = await this.users.findOne(query);
        return user;
      } if (arguments.length === 2) {
        const query = { userID: ObjectId(userID), password: upassword };
        const user = await this.users.findOne(query);
        return user;
      }
      throw new Error('Invalid number of arguments');
    } catch (error) {
      console.log(`Error Email Found: ${error}`);
      return false;
    }
  }

  /**
   *
   * @param {*} userID
   * @param {*} upassword
   * @returns
   */
  async findUserByPhone(userID, upassword) {
    try {
      if (arguments.length === 1) {
        const query = { userID };
        const user = await this.users.findOne(query);
        return user;
      } if (arguments.length === 2) {
        const query = { Phone: userID, password: upassword };
        const user = await this.users.findOne(query);
        return user;
      }
      throw new Error('Invalid number of arguments');
    } catch (error) {
      console.log(`Error Email Found: ${error}`);
      return false;
    }
  }

  /**
   *
   * @param {*} uemail
   * @param {*} upassword
   * @returns
   */
  async createUser(userID, upassword, userType) {
    try {
      const hashedPassword = crypto.createHash('sha1').update(upassword).digest('hex');
      let query = { Phone: userID, password: hashedPassword, userType };
      if (userType !== 'staff') {
        query = { userID: ObjectId(userID), password: hashedPassword, userType };
      }
      const user = await this.users.insertOne(query);
      return user.insertedId;
    } catch (error) {
      console.log(`Error Creation: ${error}`);
      return false;
    }
  }

  /**
   *
   * @param {string} uemail
   * @param {string} upassword
   */
  async findById(id) {
    try {
      const objectId = new ObjectId(id);
      const query = { _id: objectId };
      const user = await this.users.findOne(query);
      return user;
    } catch (error) {
      console.log(`Error find: ${error}`);
      return false;
    }
  }

  /**
   * Find By Token
   * @param {string} token
   * @returns
   */
  async findByToken(token) {
    const userId = await redisClient.get(`auth_${token}`);
    const user = await this.findById(userId);
    return user;
  }

  /**
   *
   * @param {string} id
   * @returns
   */
  async removeStaff(id) {
    try {
      const objectId = new ObjectId(id);
      const query = { _id: objectId };
      await this.users.deleteOne(query);
      return true;
    } catch (error) {
      console.log(`Error remove: ${error}`);
      return false;
    }
  }

  async getAllStaff(page = 0, limit = 10) {
    try {
      const query = { userType: 'staff' };
      const cursor = await this.users.find(query);
      const data = await cursor.skip(page * limit).limit(limit).toArray();
      return data;
    } catch (error) {
      console.log(`Error getAll: ${error}`);
      return false;
    }
  }
}

export default User;
