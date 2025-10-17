import { createSlice } from "@reduxjs/toolkit";
import { loadRooms } from "./roomThunk";

const roomSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    unreadCounts: {}, // { roomId: count }
    loading: false,
    error: null,
  },
  reducers: {
    updateUnreadCount: (state, action) => {
      const { roomId, unreadCounts } = action.payload;
      state.unreadCounts[roomId] = +unreadCounts[roomId] || 0;
    },
    clearUnread: (state, action) => {
      delete state.unreadCounts[action.payload];
    },
    updateRoom: (state, action) => {
      const updatedRoom = action.payload;
      // 1️⃣ Remove old room entry
      const room = state.rooms.filter((r) => r._id === updatedRoom._id)[0];
      state.rooms = state.rooms.filter((r) => r._id !== updatedRoom._id);
      room.updatedAt = updatedRoom.updatedAt;
      // 2️⃣ Insert updated room at the top
      state.rooms.unshift(room);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRooms.fulfilled, (state, action) => {
        const { rooms, unreadCounts } = action.payload;
        state.rooms = rooms;
        state.unreadCounts = unreadCounts || {};
        state.loading = false;
      })
      .addCase(loadRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateUnreadCount, clearUnread, updateRoom } = roomSlice.actions;
export default roomSlice.reducer;
