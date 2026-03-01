require('dotenv').config();
const { MongoClient } = require('mongodb');

const URI = process.env.REACT_APP_MONGODB_URI || process.env.MONGODB_URI || process.env.REACT_APP_MONGO_URI;

if (!URI) {
  console.error('❌ ERROR: MONGODB_URI is not set in .env file');
  console.log('\nPlease add your MongoDB connection string to the .env file:');
  console.log('MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/');
  process.exit(1);
}

console.log('🔍 Testing MongoDB connection...');
console.log('📍 Connection string:', URI.replace(/:[^:@]+@/, ':****@')); // Hide password

async function testConnection() {
  try {
    const client = await MongoClient.connect(URI);
    const db = client.db('chatapp');
    
    // Test a simple operation
    const collections = await db.listCollections().toArray();
    const usersCount = await db.collection('users').countDocuments();
    const sessionsCount = await db.collection('sessions').countDocuments();
    
    console.log('✅ MongoDB connection successful!');
    console.log(`📊 Database: chatapp`);
    console.log(`📁 Collections found: ${collections.length}`);
    console.log(`👥 Users: ${usersCount}`);
    console.log(`💬 Sessions: ${sessionsCount}`);
    
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB connection failed:');
    console.error('   Error:', err.message);
    
    if (err.message.includes('authentication failed')) {
      console.error('\n💡 Tip: Check your username and password in the connection string');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error('\n💡 Tip: Check your cluster hostname in the connection string');
    } else if (err.message.includes('timeout')) {
      console.error('\n💡 Tip: Check your network connection and MongoDB Atlas IP whitelist');
    }
    
    process.exit(1);
  }
}

testConnection();
