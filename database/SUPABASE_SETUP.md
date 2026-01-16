# Supabase Storage Setup Instructions

## Prerequisites
- Supabase account with project created
- Environment variables already configured in `.env`

## Step 1: Run SQL Setup

1. Open your Supabase Dashboard: https://app.supabase.com
2. Navigate to your project: `adzhregkxsxmtblgvhxo`
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `supabase_setup.sql`
6. Click **Run** to execute the SQL

This will:
- Create the `user-images` storage bucket
- Set up Row Level Security (RLS) policies for authenticated users
- Optionally create a `user_images` table for metadata tracking

## Step 2: Verify Setup

After running the SQL, verify everything is set up correctly:

### Check Storage Bucket
1. Go to **Storage** in the left sidebar
2. You should see a bucket named `user-images`
3. Click on it to verify it's created

### Check Policies
1. In Storage, click on `user-images` bucket
2. Click **Policies** tab
3. You should see 4 policies:
   - Users can upload their own images
   - Users can read their own images
   - Users can update their own images
   - Users can delete their own images

## Step 3: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Sign in to your app (authentication required)

3. Navigate to the Future Room and try uploading an image to the Vision Board

4. Navigate to the Memory Corner and try uploading an image to a journal entry

5. Verify images persist after page refresh

## Troubleshooting

### "Not authenticated" error
- Make sure you're signed in to the app
- Check that your Supabase credentials in `.env` are correct

### Upload fails
- Check browser console for detailed error messages
- Verify storage policies are set up correctly
- Ensure you're signed in with a valid user account

### Images don't load
- Check Network tab in browser DevTools
- Verify the storage bucket is public or policies allow access
- Check that image URLs are being saved correctly in the database

## Migration from localStorage

Existing images stored as base64 in localStorage will continue to work (backward compatibility is built in). New images will be uploaded to Supabase Storage.

To migrate existing images:
1. Users should re-upload their images while signed in
2. Old base64 images will be automatically replaced with Supabase Storage URLs

## Storage Structure

Images are organized by user and type:
```
user-images/
  ├── {user_id}/
  │   ├── vision-board/
  │   │   └── current.jpg
  │   └── journal/
  │       ├── 2026-01-16-{timestamp}.jpg
  │       └── 2026-01-17-{timestamp}.jpg
```

## Next Steps

- Monitor storage usage in Supabase Dashboard
- Consider implementing image compression before upload
- Add image size limits if needed
- Implement cleanup for deleted journal entries
