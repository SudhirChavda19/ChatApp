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
  const request = db.transaction(userTable).objectStore(userTable).openCursor();

  const result = [];
  request.onsuccess = () => {
    const cursor = request.result;
    if (cursor) {
      // Exclude based on id
      if (!userId.includes(cursor.value.id)) {
        result.push(cursor.value);
      }
      cursor.continue();
    } else {
      return result;
    }
  };
  request.onerror = (error) => {
    console.log("error :", error);
    throw new Error("Error while get users: ", error);
  };
};

export const getRequestedUsers = async (db) => {
  const request = db.transaction(userTable).objectStore(userTable).openCursor();

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
      return result;
    }
  };
  request.onerror = (error) => {
    console.log("error :", error);
    throw new Error("Error while get users: ", error);
  };
};

export const getConfiremedUsers = async (db) => {
  const request = db.transaction(userTable).objectStore(userTable).openCursor();

  const result = [];
  request.onsuccess = () => {
    const cursor = request.result;
    if (cursor) {
      // Exclude based on id
      if (!cursor.value.requested) {
        result.push(cursor.value);
      }
      cursor.continue();
    } else {
      return result;
    }
  };
  request.onerror = (error) => {
    console.log("error :", error);
    throw new Error("Error while get users: ", error);
  };
};

export const updateRequestStatus = async (id, status, db) => {
  const request = db.transaction(userTable).objectStore(userTable);

  const newRequest = request.get(id);
  newRequest.onsuccess = () => {
    const user = newRequest.result;
    if (user) {
      user.requested = status;
    }

    const updateRequest = request.update(user);
    updateRequest.onsuccess = () => {
      console.log(`User updated: ${updateRequest.result}`);
    };
    updateRequest.onerror = (error) => {
      console.log("error :", error);
      throw new Error("Error while Update User: ", error);
    };
  };
  newRequest.onerror = (error) => {
    console.log("error :", error);
    throw new Error("Error while update operation: ", error);
  };
};
