
let request;
let db;
let version = 1;

export const User = {
  id: String,
  name: String,
  email: String,
  phone: Number,
}

export const ChatModel = {
  id: String,
  participants: [],
  lastMessage: String,
  timeStamp: Number
};

export const Stores = {
  Users : 'users',
  Messages: 'messages'
}

export const initDB = async () => {
  return new Promise((resolve) => {
    // open the connection
    request = indexedDB.open('myDB');

    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.Users)) {
        db.createObjectStore(Stores.Users, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(Stores.Messages)) {
        db.createObjectStore(Stores.Messages, { keyPath: 'id' });
      }
      // no need to resolve here
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      console.log('request.onsuccess - initDB', version);
      resolve(db);
    };

    request.onerror = (error) => {
      resolve(error);
    };
  });
};