const { randomBytes } = require('node:crypto');

module.exports = function generate_random_string(length) {
    if (length % 2 !== 0) {
        length++;
    }
    return randomBytes(length / 2).toString('hex');
}
