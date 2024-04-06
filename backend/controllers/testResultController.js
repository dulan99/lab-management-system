const TestResult = require('../models/testResultModel');
const Appointment = require('../models/appointmentModel');
const sendEmail = require('../utils/emailUtils');

// Record a test result
exports.recordTestResult = async (req, res) => {
    const { appointmentId, technicianId, result } = req.body;

    try {
        // Check if the appointment exists
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        // Create a new test result
        const newTestResult = await TestResult.create({
            appointment: appointmentId,
            technician: technicianId,
            result,
        });

        // Update the appointment status to 'completed'
        appointment.status = 'completed';
        await appointment.save();

        // Populate the patient and test details
        const populatedAppointment = await Appointment.findById(appointmentId)
            .populate('patient', 'name email')
            .populate('test', 'name')
            .exec();

        const patient = populatedAppointment.patient;
        const test = populatedAppointment.test;

        const emailSubject = `Test Result for ${test.name}`;
        const emailBody = `Dear ${patient.name},\n\nHere is the result for the ${test.name} test:\n\n${result}`;

        // sendEmail(patient.email, emailSubject, emailBody);

        res.status(201).json({
            success: true,
            message: 'Test result recorded successfully',
            data: newTestResult,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to record test result',
        });
    }
};


// Get test results for an appointment
exports.getTestResultsByAppointment = async (req, res) => {
    const appointmentId = req.params.appointmentId;

    try {
        const testResults = await TestResult.find({ appointment: appointmentId })
            .populate('technician', 'name email')
            .populate('appointment', 'patient doctor test');

        res.status(200).json({
            success: true,
            data: testResults,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch test results',
        });
    }
};

// Other test result-related controllers (update, delete, etc.)