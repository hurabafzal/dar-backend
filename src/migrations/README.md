# Database Migrations

This directory contains migration scripts for the DAR backend database.

## Texture ID Migration

### Purpose
This migration adds unique `_id` fields to all existing textures in the material categories collection. This enables ID-based operations on textures instead of name-based operations.

### Running the Migration

1. **Ensure your `.env` file is properly configured** with the `MONGODB_URI` connection string.

2. **Run the migration script:**
   ```bash
   npx ts-node src/migrations/add-texture-ids.migration.ts
   ```

   Or if you have tsx installed:
   ```bash
   npx tsx src/migrations/add-texture-ids.migration.ts
   ```

3. **Verify the migration:**
   - Check the console output for the number of categories and textures updated
   - The script will report any errors encountered

### What the Migration Does

- Connects to your MongoDB database
- Finds all material categories that have textures
- For each texture without an `_id`, generates a new MongoDB ObjectId
- Updates the material category documents with the new texture IDs
- Provides a summary of the migration

### Safety

- The migration is **idempotent** - it can be run multiple times safely
- It only adds IDs to textures that don't already have one
- Existing texture IDs are preserved
- No data is deleted or modified except for adding the `_id` field

### After Migration

Once the migration is complete, all texture-related API endpoints will use the texture ID instead of texture name:

- `GET /material-category/texture/:categoryId/:textureId` - Get a single texture
- `PATCH /material-category/update-texture` - Update a texture (requires `textureId` in body)
- `DELETE /material-category/delete-texture` - Delete a texture (requires `textureId` in body)

### Rollback

If you need to rollback, you would need to:
1. Remove the `_id` field from all textures
2. Revert the code changes to use texture names instead of IDs

However, it's recommended to keep the ID-based system as it's more robust and scalable.
