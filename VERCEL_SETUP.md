# Vercel Deployment Setup

This document provides instructions for setting up your Vercel deployment correctly.

## Required Environment Variables

Make sure to add the following environment variables in your Vercel project settings:

1. **MongoDB Connection**
   - `MONGODB_URI` - Your MongoDB connection string
   - `MONGODB_DB` - Your database name (default: "tech-ecommerce")

2. **File Storage**
   - `BLOB_READ_WRITE_TOKEN` - Token for Vercel Blob Storage

## Setting Up Vercel Blob Storage

To enable file uploads on Vercel:

1. Go to your Vercel dashboard
2. Navigate to Storage > Create a new Blob store
3. Follow the prompts to create your store
4. Copy the generated token
5. Add it as an environment variable named `BLOB_READ_WRITE_TOKEN`

## Local Development with Blob Storage

To test the Blob storage locally, you can run:

```bash
npx vercel env pull .env.local
```

This will pull the environment variables from your Vercel project to your local environment.

## Troubleshooting

If you encounter upload issues:

1. Check that `BLOB_READ_WRITE_TOKEN` is correctly set
2. Ensure your project has the `@vercel/blob` package installed
3. Check network requests in the browser's developer tools for detailed error messages
4. Verify that you're using the correct form field name (`image`) when uploading

For more information, visit [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob). 