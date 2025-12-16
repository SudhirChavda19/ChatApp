import { createSlice } from "@reduxjs/toolkit";
import { loadMessages } from "./messageThunk";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messagesByRoom: {},
    loading: false,
    error: null,
  },
  //   {
  //   room123: {
  //     latestMessages: [/* newest ~50 messages (real-time visible) */],
  //     cachedPages: {
  //       2: { messages: [...], hasNextPage: true },
  //       3: { messages: [...], hasNextPage: true },
  //     },
  //   }
  // }
  reducers: {
    addNewMessage: (state, action) => {
      const { roomId, newMessage } = action.payload;
      const room = state.messagesByRoom[roomId];
      if (room) {
        room.latestMessages.push(newMessage);
        // Sort if needed
        // room.messages.sort(
        //   (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        // );
      }
    },

    clearMessages: (state) => {
      delete state.messagesByRoom;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        const { roomId, page, messages, hasNextPage, totalPages } =
          action.payload;

        if (!state.messagesByRoom[roomId]) {
          state.messagesByRoom[roomId] = {
            latestMessages: [],
            cachedPages: {},
            totalPages: totalPages || 0,
          };
        }

        const room = state.messagesByRoom[roomId];
        room.cachedPages[page] = { messages, hasNextPage };
        room.totalPages = totalPages;
        state.loading = false;
      })
      .addCase(loadMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addNewMessage, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;
