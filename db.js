const mysql = require('mysql2/promise');
const fs = require('fs');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'rootuser',
    database: 'ridesharing_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const createTables = async () => {
    try {
        // Read the SQL file with the schema
        const schemaSQL = fs.readFileSync('./tables_schema/user_table.sql', 'utf-8');
        const schemaSQL2 = fs.readFileSync('./tables_schema/rider_table.sql', 'utf-8');
        const schemaSQL3 = fs.readFileSync('./tables_schema/user_rides.sql', 'utf-8');
        const schemaSQL4 = fs.readFileSync('./tables_schema/booking.sql', 'utf-8');
        const schemaSQL5 = fs.readFileSync('./tables_schema/transaction_table.sql', 'utf-8');

        // Execute the SQL to create the tables
        const connection = await pool.getConnection();
        await connection.query(schemaSQL);
        await connection.query(schemaSQL2);
        await connection.query(schemaSQL3);
        await connection.query(schemaSQL4);
        await connection.query(schemaSQL5);
        connection.release();

        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};


module.exports = {
    pool: pool,
    createTables: createTables
};
