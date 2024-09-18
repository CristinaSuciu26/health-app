import app from "./index.js"; // Importing the express app
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Destructure environment variables with default port
const { PORT = 3000 } = process.env;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
