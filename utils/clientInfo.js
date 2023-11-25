import { ObjectId } from 'mongodb';
import dbClient from './db';
import VaildChecker from './vaildChecker';

class ClientInfo {
  constructor() {
    this.ClientInfo = dbClient.mongoClient.db(dbClient.database).collection('ClientInfo');
  }

  /**
     * Create a new user
     * @param {*} body
     * @returns
     * @memberof ClientInfo
     */
  async createNewUser(body) {
    const {
      email,
      Phone,
      Address,
      accountType,
      employment,
      firstName,
      lastName,
      DOB,
      gender,
    } = body;
    const PhoneValid = VaildChecker.validatePhone(Phone);
    if (PhoneValid.error) {
      return { error: PhoneValid.error };
    }

    const emailValid = VaildChecker.validateEmail(email);
    if (emailValid.error) {
      return { error: emailValid.error };
    }

    const customer = await this.ClientInfo.findOne({ email });
    if (customer) {
      return { error: 'Already Registred using this email' };
    }

    const customer2 = await this.ClientInfo.findOne({ Phone });
    if (customer2) {
      return { error: 'Already Registred using this Phone Number' };
    }

    const lastNameValid = VaildChecker.validateName(lastName);
    if (lastNameValid.error) {
      return { error: lastNameValid.error };
    }

    const firstNameValid = VaildChecker.validateName(firstName);
    if (firstNameValid.error) {
      return { error: firstNameValid.error };
    }

    const dateValid = VaildChecker.validateDateOfBirth(DOB);
    if (dateValid.error) {
      return { error: dateValid.error };
    }

    const result = await this.ClientInfo.insertOne({
      Phone,
      Address,
      email,
      firstName,
      lastName,
      DOB,
      status: 'waiting',
      gender,
      created_at: new Date(),
      accountType,
      employment,
    });

    return { id: result.insertedId };
  }

  async findById(id) {
    try {
      const objectId = new ObjectId(id);
      const query = { _id: objectId };
      const customer = await this.ClientInfo.findOne(query);
      return customer;
    } catch (error) {
      console.log(`Error find: ${error}`);
      return false;
    }
  }

  /**
   *
   * @param {*} uemail
   * @param {*} upassword
   * @returns
   */
  async createUser(clientID, upassword) {
    try {
      const query = { _id: ObjectId(clientID) };
      const customer = await this.ClientInfo.findOneAndUpdate(query, { $set: { password: upassword } }, { returnDocument: 'after' });
      return customer.value._id;
    } catch (error) {
      console.log(`Error Creation: ${error}`);
      return false;
    }
  }

  /**
   *
   * @param {*} uemail
   * @param {*} upassword
   * @returns
   */
  async findUserByPhone(Phone) {
    try {
      const PhoneValid = VaildChecker.validatePhone(Phone);
      if (PhoneValid.error) {
        return { error: PhoneValid.error };
      }
      const query = { Phone };
      const user = await this.ClientInfo.findOne(query);
      return user;
    } catch (error) {
      console.log(`Error Phone Found: ${error}`);
      return false;
    }
  }

  /**
   * find using id all user info
   * @param {string} id
   * @returns json
   */
  async getUsetInfo(id) {
    try {
      const objectId = new ObjectId(id);
      const query = { _id: objectId };
      const user = await this.ClientInfo.findOne(query);
      return user;
    } catch (error) {
      console.log(`Error find: ${error}`);
      return false;
    }
  }

  async getAllUsers(page = 0, limit = 10) {
    try {
      const skip = page * limit;
      const query = {};
      const users = await this.ClientInfo.find(query).skip(skip).limit(limit).toArray();
      return users;
    } catch (error) {
      console.log(`Error find: ${error}`);
      return false;
    }
  }
}

export default ClientInfo;
