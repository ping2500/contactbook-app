// db.config.js

const dbConfig = {
    host: 'localhost',      // Your MySQL host
    user: 'root',           // Your MySQL username
    password: 'root', 
    database: 'contactbook', // We will create this database next
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

module.exports = dbConfig;