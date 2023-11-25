import crypto from 'crypto';
import ClientInfo from './clientInfo';
import User from './users';

class BasicAuthBank {
  static authorizationHeader(request) {
    if (request === null) {
      return null;
    }
    if (!Object.prototype.hasOwnProperty.call(request.headers, 'authorization')) {
      return null;
    }
    return request.headers.authorization;
  }

  static extractBase64AuthorizationHeader(authorizationHeader) {
    if (
      authorizationHeader === null
      || typeof authorizationHeader !== 'string'
    ) {
      return null;
    }

    if (!authorizationHeader.startsWith('Basic ')) {
      return null;
    }

    return authorizationHeader.slice(6);
  }

  static decodeBase64AuthorizationHeader(base64AuthorizationHeader) {
    if (
      base64AuthorizationHeader === null
      || typeof base64AuthorizationHeader !== 'string'
    ) {
      return null;
    }

    try {
      const decoded = Buffer.from(base64AuthorizationHeader, 'base64').toString('utf-8');
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static async extractUserCredentials(decodedBase64AuthorizationHeader) {
    if (
      decodedBase64AuthorizationHeader === null
      || typeof decodedBase64AuthorizationHeader !== 'string'
    ) {
      return [null, null];
    }

    if (!decodedBase64AuthorizationHeader.includes(':')) {
      return [null, null];
    }

    const [custId, custPwd] = decodedBase64AuthorizationHeader.split(
      ':',
      2,
    );

    return [custId, custPwd];
  }

  static async userFromCredentials(Phone, userPwd) {
    if (
      Phone === null
      || typeof Phone !== 'string'
      || userPwd === null
      || typeof userPwd !== 'string'
    ) {
      return false;
    }

    const userPwds = crypto.createHash('SHA1').update(userPwd).digest('hex')
      .toLowerCase();
    const us = new ClientInfo();
    const user = await us.findUserByPhone(Phone);

    if (user !== null) {
      const cust = new User();
      const user1 = await cust.findUserByUserID(user._id, userPwds);
      return user1;
    }

    return false;
  }

  static async onRegister(request, userType) {
    const authHeader = BasicAuthBank.authorizationHeader(request);
    const eBase64 = BasicAuthBank.extractBase64AuthorizationHeader(authHeader);
    const dBase64 = BasicAuthBank.decodeBase64AuthorizationHeader(eBase64);
    const [clientId, userPwd] = await BasicAuthBank.extractUserCredentials(dBase64);
    if (
      clientId === null
      || typeof clientId !== 'string'
      || userPwd === null
      || typeof userPwd !== 'string'
    ) {
      return false;
    }
    const user = new User();
    const userId = await user.createUser(clientId, userPwd, userType);
    return userId;
  }

  static async onLogin(request) {
    const authHeader = BasicAuthBank.authorizationHeader(request);
    const eBase64 = BasicAuthBank.extractBase64AuthorizationHeader(authHeader);
    const dBase64 = BasicAuthBank.decodeBase64AuthorizationHeader(eBase64);
    const [Phone, userPwd] = await BasicAuthBank.extractUserCredentials(dBase64);
    const user = await BasicAuthBank.userFromCredentials(Phone, userPwd);
    return user;
  }

  static async onLoginStaff(request) {
    const authHeader = BasicAuthBank.authorizationHeader(request);
    const eBase64 = BasicAuthBank.extractBase64AuthorizationHeader(authHeader);
    const dBase64 = BasicAuthBank.decodeBase64AuthorizationHeader(eBase64);
    const [Phone, userPwd] = await BasicAuthBank.extractUserCredentials(dBase64);
    const userPwds = crypto.createHash('SHA1').update(userPwd).digest('hex')
      .toLowerCase();
    const cust = new User();
    const user1 = await cust.findUserByPhone(Phone, userPwds);
    return user1;
  }
}

export default BasicAuthBank;
