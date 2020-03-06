ifEquals = function(arg, options) {
    const compare = arg.split(" ");
    if (compare[0] === compare[1]) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
};

module.exports = ifEquals;