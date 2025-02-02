// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'], // Changed from 'in progress' to 'in-progress'
    default: 'pending' 
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;


