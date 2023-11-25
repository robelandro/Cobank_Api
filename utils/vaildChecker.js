const COUNTRYCODES = ['+251'];
/**
 * Check if the input is valid
 */
class VaildChecker {
  /**
   * extract phone number by removing 0 at the beginning
   * and country code
   * @param {string} phone
   * @returns {string} - return the phone number
   */
  static extractPhoneNumber(phoneNumber) {
    const escapedCountryCodes = COUNTRYCODES.map((code) => code.replace('+', '\\+'));
    const regex = new RegExp(`(${escapedCountryCodes.join('|')})?(\\d{9})`);
    const matches = phoneNumber.match(regex);
    if (!matches) {
      return { number: null, isValid: false };
    }
    const extractedNumber = matches[2];
    const isValid = /^\d{9}$/.test(extractedNumber);
    return { number: extractedNumber, isValid };
  }

  /**
     * Check if the phone number is valid or not
     * check if the phone number is 10 digits
     * @param {number} phone
     * @returns {JSON} - return true if the phone number is valid
     * else return error message
     */
  static validatePhone(phone) {
    if (this.extractPhoneNumber(phone).isValid === null) {
      return { error: 'Phone number is not valid' };
    }

    return phone;
  }

  /**
     * check if the email is valid or not
     * @param {string} email
     * @returns {JSON} - return true if the email is valid
     * else return error message
     */
  static validateEmail(email) {
    const reg = /\S+@\S+\.\S+/;
    if (!reg.test(email)) {
      return { error: 'Email is not valid' };
    }
    return email;
  }

  /**
     * check if the name is valid or not
     * check if the name is a not include number
     * @param {string} name
     * @returns {JSON} - return true if the name is valid
     * else return error message
     */
  static validateName(name) {
    const reg = /\d/;
    if (reg.test(name)) {
      return { error: 'Name must not include number' };
    }
    return name;
  }

  /**
     * chcek if the given date is valid or not
     * check if the age is greater than 18
     * date format: YYYY-MM-DD
     * @param {string} dateOfBirth
     * @returns {JSON} - return true if the date is valid
     */
  static validateDateOfBirth(dateOfBirth) {
    const date = new Date(dateOfBirth);
    const now = new Date();
    const diff = now - date;
    const age = Math.floor(diff / 31557600000);
    if (age < 18) {
      return { error: 'Age must be greater than 18' };
    }
    return dateOfBirth;
  }
}

export default VaildChecker;
