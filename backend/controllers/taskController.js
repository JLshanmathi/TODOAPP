const Task = require('../models/Task');

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = { user: req.user._id };

        // Filter by status
        if (status && ['pending', 'completed'].includes(status)) {
            query.status = status;
        }

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: error.message || 'Server error' 
        });
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({ 
                message: 'Task not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(error);
        
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ 
                message: 'Task not found' 
            });
        }
        
        res.status(500).json({ 
            message: error.message || 'Server error' 
        });
    }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        const task = await Task.create({
            title,
            description: description || '',
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: error.message || 'Server error' 
        });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        let task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({ 
                message: 'Task not found' 
            });
        }

        // Update fields
        const { title, description, status } = req.body;
        
        if (title) task.title = title;
        if (description !== undefined) task.description = description;
        if (status) task.status = status;
        
        task.updatedAt = Date.now();
        await task.save();

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(error);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ 
                message: 'Task not found' 
            });
        }
        
        res.status(500).json({ 
            message: error.message || 'Server error' 
        });
    }
};
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email'
            });
        }

        // Generate reset token (simple method - in production use crypto)
        const resetToken = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);
        
        // Save token to user (expires in 1 hour)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
        await user.save();

        // In production, you would send an email here
        // For testing, we'll return the token (remove in production!)
        res.status(200).json({
            success: true,
            message: 'Password reset email sent',
            resetToken // Remove this in production!
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Find user by email and check if token exists and not expired
        const user = await User.findOne({ 
            email,
            resetPasswordToken: { $exists: true },
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({ 
                message: 'Task not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
            data: {}
        });
    } catch (error) {
        console.error(error);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ 
                message: 'Task not found' 
            });
        }
        
        res.status(500).json({ 
            message: error.message || 'Server error' 
        });
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};