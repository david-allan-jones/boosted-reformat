/**
 * Takes object and returns an array where values are sorted based on an index in order object (matching keys)
 * @param {Object} values 
 * @param {Object} order 
 */
const orderObjectArray = (values, order, defaultValue) => {
    const ordered = new Array(Object.keys(order).length);
    for (let i = 0; i < ordered.length; i++) {
        ordered[i] = defaultValue
    }

    Object.keys(values).forEach(key => {
        ordered[order[key]] = values[key]
    })
    return ordered
}

module.exports = orderObjectArray