import 'dotenv/config'; // Load environment variables
import app from './app.js'; // Import the app setup

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
