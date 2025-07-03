import dotenv from 'dotenv';
import { isCloudinaryConfigured } from '../services/cloudinaryService.js';

// Load environment variables
dotenv.config();

/**
 * Test script to verify Cloudinary configuration
 */
async function testCloudinaryConfiguration() {
  console.log('🔍 Testing Cloudinary Configuration...\n');

  // Check environment variables
  console.log('Environment Variables:');
  console.log(`CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing'}`);
  console.log(`CLOUDINARY_API_KEY: ${process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`CLOUDINARY_API_SECRET: ${process.env.CLOUDINARY_API_SECRET ? '✅ Set (hidden)' : '❌ Missing'}`);
  console.log();

  // Test configuration
  const isConfigured = isCloudinaryConfigured();
  console.log(`Cloudinary Configuration: ${isConfigured ? '✅ Valid' : '❌ Invalid'}`);

  if (!isConfigured) {
    console.log('\n❌ Cloudinary is not properly configured!');
    console.log('Please ensure the following environment variables are set:');
    console.log('- CLOUDINARY_CLOUD_NAME');
    console.log('- CLOUDINARY_API_KEY');
    console.log('- CLOUDINARY_API_SECRET');
    console.log('\nYou can get these values from your Cloudinary dashboard.');
    process.exit(1);
  }

  console.log('\n✅ Cloudinary configuration is valid!');
  console.log('You can now upload images to Cloudinary.');
}

// Run the test
testCloudinaryConfiguration().catch(console.error);
