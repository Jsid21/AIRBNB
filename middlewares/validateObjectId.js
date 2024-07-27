const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
    const { id, reviewid } = req.params;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID format");
    }
    if (reviewid && !mongoose.Types.ObjectId.isValid(reviewid)) {
        return res.status(400).send("Invalid Review ID format");
    }
    next();
};

module.exports = validateObjectId;
