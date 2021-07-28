import { MongoClient } from 'mongodb';

const connectionString = process.env.customKey;

export const getMongoConnection = async () => {
    const client = await MongoClient.connect(connectionString);
    const db = client.db();

    const meetupsCollection = db.collection('meetupsCollection');
    return { client, meetupsCollection };
};

export const insertMeetup = async (collection, meetup) => {
    await collection.insertOne(meetup);
};