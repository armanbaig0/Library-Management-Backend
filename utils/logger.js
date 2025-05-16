const winston = require('winston')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}] : ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Console par logs show honge
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Sirf error logs file mein
        new winston.transports.File({ filename: 'logs/combined.log' }), // Sab logs file mein
    ],
});

module.exports = logger;
