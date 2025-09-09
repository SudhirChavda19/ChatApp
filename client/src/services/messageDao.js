const messageTable = "messages";

export const storeMessages = async (data, db) => {
  const tx = db.transaction(messageTable, "readwrite");
  const store = tx.objectStore(messageTable);

  store.add(data);

  tx.oncomplete = (res) => {
    console.log("Message Stored: ", res);
  };
  tx.onerror = (error) => {
    console.log("Error while store message: ", error);
    throw new Error("Error while store message: ", error);
  };
};

export const getRoomMessages = async (roomid, db, beforeTimestamp) => {
  return new Promise((resolve, reject) => {
    try {
      const request = db
        .transaction(messageTable)
        .objectStore(messageTable)
        .index("timestamp")
        .openCursor(beforeTimestamp ? IDBKeyRange.upperBound(beforeTimestamp, true) : null, "prev");

      const messages = [];
      let count = 0;
      const limit = 10;
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor && count < limit) {
          if (cursor.value.roomid === roomid) {
            messages.push(cursor.value);
            count++;
          }
          cursor.continue();
        } else {
          resolve(messages.reverse());
        }
      };
      request.onerror = (error) => {
        console.log("error :", error);
        reject(new Error("Error while get requested users", error));
      };
    } catch (error) {
      console.error("Error while getting requested users: ", error);
      reject(new Error("Error while getting requested users: ", error));
    }
  });
}


