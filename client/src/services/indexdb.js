let request;
let db;
let version = 2;

export const User = {
  id: String,
  name: String,
  email: String,
  phone: Number,
};

export const ChatModel = {
  id: String,
  timestamp: Number,
  roomid: String,
  message: String,
  receiverid: String,
  senderid: String, 
};

export const Stores = {
  Users: "users",
  Messages: "messages",
};

export const initDB = async () => {
  return new Promise((resolve) => {
    // open the connection
    request = indexedDB.open("myDB", version);

    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.Users)) {
        db.createObjectStore(Stores.Users, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(Stores.Messages)) {
        const store = db.createObjectStore(Stores.Messages, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp");
      }
      // no need to resolve here
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      resolve(db);
    };

    request.onerror = (error) => {
      resolve(error);
    };
  });
};
