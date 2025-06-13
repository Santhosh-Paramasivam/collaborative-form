module.exports = (value, list) => {
    console.log(value, list)
    for (let entry of list) {
        if (value == entry) return true
    }
    return false
}