import { connect, connection, Types } from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Migration script to add _id field to existing textures
 * Run this script once to migrate existing data
 */
async function migrateTextureIds() {
  try {
    console.log('Connecting to MongoDB...');
    await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dar');
    console.log('Connected successfully!');

    const db = connection.db;
    const materialCategoriesCollection = db.collection('materialcategories');

    // Find all material categories with textures
    const categories = await materialCategoriesCollection
      .find({ textures: { $exists: true, $ne: [] } })
      .toArray();

    console.log(`Found ${categories.length} categories with textures`);

    let updatedCount = 0;
    let textureCount = 0;

    for (const category of categories) {
      let needsUpdate = false;
      const updatedTextures = category.textures.map((texture: any) => {
        // Check if texture already has an _id
        if (!texture._id) {
          needsUpdate = true;
          textureCount++;
          return {
            ...texture,
            _id: new Types.ObjectId(), // Generate new ObjectId
          };
        }
        return texture;
      });

      if (needsUpdate) {
        await materialCategoriesCollection.updateOne(
          { _id: category._id },
          { $set: { textures: updatedTextures } }
        );
        updatedCount++;
        console.log(`Updated category: ${category.name} with ${updatedTextures.length} textures`);
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Categories updated: ${updatedCount}`);
    console.log(`Textures given IDs: ${textureCount}`);
    console.log('Migration completed successfully!');

    await connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await connection.close();
    process.exit(1);
  }
}

// Run migration
migrateTextureIds();
