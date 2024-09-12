import mongoose from "mongoose";
import app from "./index.js";

// Destructure environment variables with default port
const { MONGO_URI, PORT = 3000 } = process.env;

// Validate MONGO_URI
if (!MONGO_URI) {
  console.error("MONGO_URI is not defined");
  process.exit(1);
}

// Connect to MongoDB and start the server
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Database connection successful. Use your API on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });
