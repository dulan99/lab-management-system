const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Patient = require('../models/patientModel');
const Technician = require('../models/technicianModel');
const Doctor = require('../models/doctorModel');
const Admin = require('../models/adminModel');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user in the appropriate collection based on the decoded ID
        const user =
            (await Patient.findById(decoded.id)) ||
            (await Technician.findById(decoded.id)) ||
            (await Doctor.findById(decoded.id)) ||
            (await Admin.findById(decoded.id));

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, user not found',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
        });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};