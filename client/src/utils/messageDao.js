const userTable = "messages";

export const storeMessages = async (data, db) => {
  const tx = db.transaction(userTable, "readwrite");
  const store = tx.objectStore(userTable);

  store.add(data);

  tx.oncomplete = (res) => {
    console.log("Message Stored: ", res);
  };
  tx.onerror = (error) => {
    console.log("Error while store message: ", error);
    throw new Error("Error while store message: ", error);
  };
};