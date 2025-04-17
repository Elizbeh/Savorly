import db from '../config/db.js'; // Adjust this import to match your DB setup

export const getAllUsersFromDB = async (role) => {
    let query = 'SELECT * FROM users';
    const params = [];

    if (role) {
        query += ' WHERE role = ?';
        params.push(role);
    }

    const [users] = await db.query(query, params);
    return users;
};

export const deleteUserFromDB = async (id) => {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
};
