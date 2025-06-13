const find_in_list = require('./find_in_list')

module.exports = (required_fields, body, res) => {
    for (let field of required_fields) {
        if (!find_in_list(field, Object.keys(body))) {
            res.status(400).send({ 'missing-field': `${field} field is missing` })
            return true
        }
    }

    return false
}