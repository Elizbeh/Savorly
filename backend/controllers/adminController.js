import { getAllUsersFromDB, deleteUserFromDB } from '../models/admin.js';

export const getAllUsers = async (req, res) => {
    console.log(req.user);

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const users = await getAllUsersFromDB('admin');
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const deleteUser = async (req, res) => {
    try {
        await deleteUserFromDB(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
