// Load environment variables FIRST
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as fs from 'fs';
import * as schema from './src/db/schema';

// Use Node.js client for seed (not web version)
const client = createClient({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

async function seed() {
	console.log('Seed started...');
	console.log('DB URL:', process.env.TURSO_DATABASE_URL ? '✓ Set' : '✗ NOT SET');
	const data = JSON.parse(fs.readFileSync('items.json', 'utf8'));

	for (const item of data) {
		try {
			await db.insert(schema.items).values({
				externalId: item.id,
				description: item.description,
				unit: item.unit,
				isActive: true,
			});
			console.log(`Inserted: ${item.description}`);
		} catch (e) {
			console.error(`Error inserting ${item.description}:`, e);
		}
	}

	console.log('Seed finished!');
}

seed();
