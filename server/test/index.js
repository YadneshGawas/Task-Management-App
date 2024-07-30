import mongoose from 'mongoose';
import User from './../schemas/user';
import Project from './../schemas/projects';
import Task from './../schemas/tasks';
import Notif from './../schemas/notifications';


// MongoDB connection URI
const url = 'mongodb://localhost:27017/'; // Use your test database URI

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

const runTests = async () => {
  await connectDB();

  // Test User Schema
  console.log('Testing User Schema...');
  const user = new User({
    name: 'Alice',
    title: 'Developer',
    email: 'alice@example.com',
    role: 'user',
    password: 'password123',
    isAdmin: false,
    isActive: true,
  });

  await user.save();
  console.log('User created:', user);

  const foundUser = await User.findOne({ email: 'alice@example.com' });
  console.log('Found User:', foundUser);

  const isMatch = await user.matchPassword('password123');
  console.log('Password match:', isMatch);

  // Test Project Schema
  console.log('Testing Project Schema...');
  const project = new Project({
    title: 'Project A',
    priority: 'high',
    stage: 'todo',
  });

  await project.save();
  console.log('Project created:', project);

  // Test Task Schema
  console.log('Testing Task Schema...');
  const task = new Task({
    pid: project._id,
    title: 'Task 1',
    desc: 'Description of Task 1',
    priority: 'medium',
    stage: 'in progress',
    by: user._id,
    team: [user._id],
  });

  await task.save();
  console.log('Task created:', task);

  // Test Notification Schema
  console.log('Testing Notification Schema...');
  const notification = new Notif({
    team: [user._id],
    text: 'New task assigned',
    task: task._id,
  });

  await notification.save();
  console.log('Notification created:', notification);

  // Cleanup: Close the database connection
  await mongoose.connection.close();
  console.log('Database connection closed');
};

// Run the tests
runTests();
