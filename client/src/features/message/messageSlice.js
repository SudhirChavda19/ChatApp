import { createSlice } from "@reduxjs/toolkit";
import { loadMessages } from "./messageThunk";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messagesByRoom: {}, // { [roomId]: { messages: [], pages: {1: hasNextPage }, totalPages } }
    loading: false,
    error: null,
  },
  reducers: {
    addNewMessage: (state, action) => {
      const { roomId, newMessage } = action.payload;
      const room = state.messagesByRoom[roomId];
      if (room) {
        room.messages.push(newMessage);
        // Sort if needed
        // room.messages.sort(
        //   (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        // );
      }
    },

    clearMessages: (state, action) => {
      const { roomId } = action.payload;
      delete state.messagesByRoom[roomId];
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
            messages: [],
            pages: {},
            totalPages: totalPages || 0,
          };
        }

        const room = state.messagesByRoom[roomId];

        // Prepend older messages if not the first page
        if (page === 1) {
          room.messages = messages;
        } else if (page > 1) {
          room.messages = [...messages, ...room.messages];
        }

        // Update pagination metadata
        room.pages[page] = {
          hasNextPage,
        };
        room.totalPages = totalPages;
        state.loading = false;
      })
      .addCase(loadMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addNewMessage,
  clearMessages,
} = messageSlice.actions;

export default messageSlice.reducer;
