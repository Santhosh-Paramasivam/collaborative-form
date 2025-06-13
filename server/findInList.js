module.exports = (value, list) => {
    for (let entry of list) {
        if (value == entry) return true
    }
    return false
}