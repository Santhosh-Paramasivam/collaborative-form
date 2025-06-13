const crypto = require('crypto')

module.export = (input) => {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
}