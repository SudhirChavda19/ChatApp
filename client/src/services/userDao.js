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
    throw new Error("Error while create user: ", error);
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
      console.error('err :', err);
      reject(new Error("Error while get users"));
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
        reject(new Error("Error while get requested users", error));
      };
    } catch (error) {
      console.error("Error while getting requested users: ", error);
      reject(new Error("Error while getting requested users: ", error));
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
        reject(new Error("Error while getting confiremed users: ", error));
      };
    } catch (error) {
      console.error("Error while getting confiremed users: ", error);
      reject(new Error("Error while getting confiremed users: ", error));
    }
  });
};

export const updateRequestStatus = async (id, { requested, createdAt }, db) => {
  const objectStore = db.transaction(userTable, "readwrite").objectStore(userTable);

  const request = objectStore.get(id);
  request.onsuccess = () => {
    const user = request.result;
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
      throw new Error("Error while update user: ", error);
    };
  };
  request.onerror = (error) => {
    console.log("error :", error);
    throw new Error("Error while update operation: ", error);
  };
};

export const getUserByKey = async (key, db) => {
  return new Promise((resolve , reject) => {
    try {
      const request = db.transaction(userTable)
                   .objectStore(userTable)
                   .get(key);

      request.onsuccess = () => {
        const user = request.result;
        resolve(user)
      }
      request.onerror = (error) => {
        reject(new Error("Error while getting user: ", error));
      }
    } catch (error) {
      console.error("Error while getting user: ", error);
      reject(new Error("Error while getting user: ", error));
    }
  })
}
