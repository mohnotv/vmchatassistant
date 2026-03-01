require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('Fetching available models...\n');
    const models = await genAI.listModels();
    
    console.log('Available models:');
    console.log('==================\n');
    
    for await (const model of models) {
      console.log(`Name: ${model.name}`);
      console.log(`  Display Name: ${model.displayName || 'N/A'}`);
      console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      console.log(`  Description: ${model.description || 'N/A'}`);
      console.log('');
    }
  } catch (err) {
    console.error('Error listing models:', err.message);
    console.error('\nTrying alternative method...\n');
    
    // Try direct API call
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.REACT_APP_GEMINI_API_KEY);
      const data = await response.json();
      if (data.models) {
        console.log('Available models:');
        data.models.forEach(model => {
          console.log(`  - ${model.name}`);
          if (model.supportedGenerationMethods) {
            console.log(`    Methods: ${model.supportedGenerationMethods.join(', ')}`);
          }
        });
      } else {
        console.error('Response:', data);
      }
    } catch (err2) {
      console.error('Alternative method also failed:', err2.message);
    }
  }
}

listModels();
