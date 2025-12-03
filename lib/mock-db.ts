import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'mock_db.json');

export interface MintedItem {
    id: string; // Token ID
    title: string;
    description: string;
    enhancedDescription: string;
    tags: string[];
    fileType: string;
    fileUrl: string; // IPFS URL
    owner: string;
    price: string;
    vector: number[];
    createdAt: string;
}

interface Database {
    items: MintedItem[];
}

function readDb(): Database {
    if (!fs.existsSync(DB_PATH)) {
        return { items: [] };
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return { items: [] };
    }
}

function writeDb(db: Database) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export const mockDb = {
    addItem: (item: MintedItem) => {
        const db = readDb();
        db.items.push(item);
        writeDb(db);
    },
    getItems: () => {
        const db = readDb();
        return db.items;
    },
    searchItems: (queryVector: number[]) => {
        const db = readDb();
        // In a real app, we would do cosine similarity here.
        // For this mock, we'll just return all items or filter by simple tag matching if we had the query text.
        // But since we are mocking the "Search" endpoint too, we can handle the logic there.
        return db.items;
    }
};
