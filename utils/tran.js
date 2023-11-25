import { ObjectId } from 'mongodb';
import dbClient from './db';

class Transaction {
  constructor() {
    this.dbs = dbClient.mongoClient.db(dbClient.database);
    this.dbTrans = this.dbs.collection('transactions');
  }

  async saveTransaction(userId, amount, description, via, balance, to = null) {
    const query = {
      userId: ObjectId(userId),
      amount,
      description,
      via,
      balance,
      to,
      createdAt: new Date(),
    };
    const result = await this.dbTrans.insertOne(query);
    return result;
  }

  async getTransactions(userId, page = 1, limit = 10) {
    const query = { userId: ObjectId(userId) };
    const sort = { createdAt: -1 };
    const skip = (page - 1) * limit;
    const result = await this.dbTrans.find(query,
      { sort }).skip(skip).limit(limit).toArray();
    return result;
  }

  async withdraw(userId, amount, description, via) {
    const balance = await this.getBalance(userId);
    if (!balance) {
      const result = await this.saveTransaction(userId, amount, description, via, -amount);
      return result;
    }
    if (balance.balance == 0) {
      return false;
    }
    const newBalance = balance.balance - amount;
    const result = await this.saveTransaction(userId, amount, description, via, newBalance);
    return result;
  }

  /**
   * deposit money to a user account
   * @param {string} userId
   * @param {number} amount
   * @param {string} description
   * @param {string} via
   */
  async deposit(userId, amount, description, via) {
    const balance = await this.getBalance(userId);
    if (!balance) {
      const result = await this.saveTransaction(userId, amount, description, via, amount);
      return result;
    }
    const newBalance = balance.balance + amount;
    const result = await this.saveTransaction(userId, amount, description, via, newBalance);
    return result;
  }

  /**
   * transfer money from one user to another
   * @param {string} userId
   * @param {number} amount
   * @param {string} description
   * @param {string} via
   * @param {string} to
   * @returns
   */
  async transfer(userId, amount, description, via, to) {
    const balance1 = await this.getBalance(userId);
    const balance2 = await this.getBalance(to);
    const newBalance = balance1.balance - amount;
    if (!balance2) {
      await this.saveTransaction(to, amount, description, via, amount, to);
      const result = await this.saveTransaction(userId, amount, description, via, newBalance, to);
      return result;
    }
    else {
      const newBalance2 = balance2.balance + amount;
      const result = await this.saveTransaction(userId, amount, description, via, newBalance, to);
      await this.saveTransaction(to, amount, description, via, newBalance2, userId);
      return result;
    }
  }

  /**
   * fetch the balance of a user from last transaction
   * @param {string} userId
   */
  async getBalance(userId) {
    const query = { userId: ObjectId(userId) };
    const sort = { createdAt: -1 };
    const result = await this.dbTrans.findOne(query, { sort });
    return result;
  }

  /**
   * check if a transaction is valid
   * @param {string} userId
   * @param {number} amount
   * @returns
   */
  async isVaildTransaction(userId, amount) {
    const balance = await this.getBalance(userId);
    if (balance.balance < amount) {
      return false;
    }

    return true;
  }
}

export default Transaction;
