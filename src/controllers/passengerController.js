const passengerModel = require('../models/PassengerModel');

const getPassengers = (req, res) => {
    const passengers = passengerModel.getAllPassengers();

    res.json({
        success: true,
        count: passengers.length,
        data: passengers
    });
};

module.exports = {
    getPassengers
};