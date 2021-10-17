// Generates a 8 character long alpha numeric string
const uniqueGenerator = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4().toUpperCase() + s4().toUpperCase();
}

module.exports = uniqueGenerator