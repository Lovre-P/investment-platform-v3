# Cloudinary Integration Setup

This document explains how to set up Cloudinary for image uploads in the Mega Invest platform.

## Why Cloudinary?

Railway (and most cloud platforms) use ephemeral file systems, meaning uploaded files are lost when the container restarts. Cloudinary provides:

- ✅ Persistent cloud storage
- ✅ Global CDN for fast image delivery
- ✅ Automatic image optimization
- ✅ Built-in transformations and resizing
- ✅ Secure image URLs

## Setup Instructions

### 1. Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Navigate to your Dashboard

### 2. Get API Credentials

From your Cloudinary Dashboard, copy:
- **Cloud Name** (e.g., `dkia372g1`)
- **API Key** (e.g., `296881875847266`)
- **API Secret** (click "View API Keys" to reveal)

### 3. Configure Environment Variables

#### For Local Development:
Create/update `backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

#### For Railway Deployment:
Add environment variables in Railway dashboard:
1. Go to your Railway project
2. Select your backend service
3. Go to "Variables" tab
4. Add the three Cloudinary variables

### 4. Test Configuration

Run the test script to verify setup:
```bash
npm run test:cloudinary
```

You should see:
```
✅ Cloudinary configuration is valid!
You can now upload images to Cloudinary.
```

## How It Works

### Image Upload Flow:
1. User selects images in frontend
2. Images are sent to backend as multipart/form-data
3. Multer stores images in memory (not disk)
4. Backend uploads images to Cloudinary
5. Cloudinary returns secure URLs
6. URLs are stored in database
7. Frontend displays images from Cloudinary CDN

### File Structure:
- Images are organized in folders: `mega-invest/investments/`
- Each image gets a unique public_id
- URLs are optimized for web delivery

## API Changes

### Before (Local Storage):
```javascript
// Images stored locally
images: [
  "http://localhost:3001/uploads/1234567890-image1.jpg",
  "http://localhost:3001/uploads/1234567890-image2.jpg"
]
```

### After (Cloudinary):
```javascript
// Images served from Cloudinary CDN
images: [
  "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/mega-invest/investments/investment_1234567890_abc123.jpg",
  "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/mega-invest/investments/investment_1234567890_def456.jpg"
]
```

## Benefits

1. **Reliability**: Images persist across deployments
2. **Performance**: Global CDN ensures fast loading
3. **Optimization**: Automatic format conversion and compression
4. **Scalability**: No storage limits on your server
5. **Security**: Secure HTTPS URLs with access controls

## Troubleshooting

### "Cloudinary is not properly configured"
- Check that all three environment variables are set
- Verify there are no extra spaces in the values
- Ensure API secret is correct (it's sensitive to copy/paste errors)

### "Failed to upload images"
- Check your Cloudinary account limits (free tier has monthly limits)
- Verify your API credentials are correct
- Check network connectivity

### Images not displaying
- Verify the URLs in the database are valid Cloudinary URLs
- Check browser console for CORS or loading errors
- Ensure images were uploaded successfully (check Cloudinary dashboard)

## Free Tier Limits

Cloudinary free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 1,000 transformations per month

This should be sufficient for development and small production deployments.
