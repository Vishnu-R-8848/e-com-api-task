import app from './src/app.js';
import "dotenv/config";
import connectDB from './src/config/db.js';

connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});