import { MongoClient } from 'mongodb';

const DATABASE_NAME = 'reviewerv1';
const clientOptions = {
  appName: 'engineering-math-field-guide',
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 8000,
};

let clientPromise;
let indexesPromise;

async function ensureIndexes(database) {
  await Promise.all([
    database.collection('progress').createIndex(
      { clientId: 1, problemId: 1 },
      { unique: true, name: 'client_problem_unique' },
    ),
    database.collection('progress').createIndex(
      { clientId: 1, updatedAt: -1 },
      { name: 'client_progress_recent' },
    ),
    database.collection('bookmarks').createIndex(
      { clientId: 1, formulaId: 1 },
      { unique: true, name: 'client_formula_unique' },
    ),
    database.collection('bookmarks').createIndex(
      { clientId: 1, createdAt: -1 },
      { name: 'client_bookmarks_recent' },
    ),
    database.collection('feedback').createIndex(
      { createdAt: -1 },
      { name: 'feedback_recent' },
    ),
    database.collection('rateLimits').createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: 'rate_limits_expiry' },
    ),
  ]);
}

export async function getDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const error = new Error('MONGODB_URI is not configured.');
    error.name = 'ConfigurationError';
    throw error;
  }

  if (!clientPromise) {
    const client = new MongoClient(uri, clientOptions);
    clientPromise = client.connect().then(
      () => client,
      (error) => {
        clientPromise = undefined;
        throw error;
      },
    );
  }

  const client = await clientPromise;
  const database = client.db(DATABASE_NAME);

  if (!indexesPromise) {
    indexesPromise = ensureIndexes(database).catch((error) => {
      indexesPromise = undefined;
      throw error;
    });
  }

  await indexesPromise;
  return database;
}
