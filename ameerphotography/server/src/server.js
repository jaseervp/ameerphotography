require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  console.log("MONGO_URI =", process.env.MONGO_URI);
console.log("MONGODB_URI =", process.env.MONGODB_URI);
  
  const server = app.listen(PORT, () => {
    console.log(`\n  ➜  Backend: http://localhost:${PORT}/`);
    console.log(`  ➜  Frontend: http://localhost:5173/ (Dev)`);
  });


};

startServer();
