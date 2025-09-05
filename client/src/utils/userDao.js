const userTable = "users";

export const createUser = async (data, db) => {
  const tx = db.transaction(userTable, "readwrite");
  const store = tx.objectStore(userTable);

  store.add(data);

  tx.oncomplete = (res) => {
    console.log("user created: ", res);
  };
  tx.onerror = (error) => {
    console.log("Error while create user: ", error);
    throw new Error("Error while get users: ", error);
  };
};

export const getUsers = async (userId, db) => {
  return new Promise((resolve, reject) => {
    const result = [];

    try {
      const transaction = db.transaction(userTable, "readonly");
      const store = transaction.objectStore(userTable);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (!userId.includes(cursor.value.id)) {
            result.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(result);
        }
      };

      request.onerror = (event) => {
        console.error("Error while get users:", event.target.error);
        reject(new Error("Error while get users"));
      };
    } catch (err) {
      reject(err);
    }
  });
};

export const getRequestedUsers = async (db) => {
  return new Promise((resolve, reject) => {
    try {
      const request = db
        .transaction(userTable)
        .objectStore(userTable)
        .openCursor();

      const result = [];
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          // Exclude based on id
          if (cursor.value.requested) {
            result.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(result);
        }
      };
      request.onerror = (error) => {
        console.log("error :", error);
        reject(new Error("Error while get users", error));
      };
    } catch (error) {
      console.error("Error while getting requested Data: ", error);
      reject(error);
    }
  });
};

export const getConfiremedUsers = async (db) => {
  return new Promise((resolve, reject) => {
    try {
      const request = db
        .transaction(userTable)
        .objectStore(userTable)
        .openCursor();

      const result = [];
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          // Exclude based on id
          if (cursor.value?.requested === false) {
            result.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(result);
        }
      };
      request.onerror = (error) => {
        console.log("error :", error);
        reject(new Error("Error while getting Confiremed Users: ", error));
      };
    } catch (error) {
      console.error("Error while getting Confiremed Users: ", error);
      reject(error);
    }
  });
};

export const updateRequestStatus = async (id, { requested, createdAt }, db) => {
  const objectStore = db.transaction(userTable, "readwrite").objectStore(userTable);

  const request = objectStore.get(id);
  request.onsuccess = () => {
    const user = request.result;
    console.log('user :', user)
    if (user) {
      user.requested = requested;
      user.createdAt = createdAt;
    }
    const updateRequest = objectStore.put(user);
    updateRequest.onsuccess = () => {
      console.log(`User updated: ${updateRequest.result}`);
    };
    updateRequest.onerror = (error) => {
      console.log("error :", error);
      throw new Error("Error while Update User: ", error);
    };
  };
  request.onerror = (error) => {
    console.log("error :", error);
    throw new Error("Error while update operation: ", error);
  };
};
