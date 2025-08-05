import passengerModel from '../models/PassengerModel.js';

const getPassengers = (req, res) => {
    const passengers = passengerModel.getAllPassengers();

    res.json({
        success: true,
        count: passengers.length,
        data: passengers
    });
};

export {
    getPassengers
};