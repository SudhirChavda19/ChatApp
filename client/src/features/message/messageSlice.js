import { createSlice } from "@reduxjs/toolkit";
import { loadMessages } from "./messageThunk";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messagesByRoom: {}, // { [roomId]: { messages: [], page: 1, totalPages: 0, hasNextPage: false } }
    loading: false,
    error: null,
  },
  reducers:{
    addNewMessage: (state, action) => {
      const {roomId, newMessage} = action.payload;
      state.messagesByRoom[roomId].messages.push(newMessage);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        const { roomId, messages, page, totalPages, hasNextPage } =
          action.payload;
        if (!state.messagesByRoom[roomId]) {
          // initialize new room entry
          state.messagesByRoom[roomId] = {
            messages: [],
            page: 1,
            totalPages: 0,
            hasNextPage: false,
          };
        }

        const roomData = state.messagesByRoom[roomId];

        // Append or replace messages depending on page
        if (page === 1) {
          // first page → replace
          roomData.messages = messages;
        } else {
          // next page → prepend older messages (assuming pagination goes older)
          roomData.messages = [...messages, ...roomData.messages];
        }

        roomData.page = page;
        roomData.totalPages = totalPages;
        roomData.hasNextPage = hasNextPage;

        state.loading = false;
      })
      .addCase(loadMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addNewMessage } =
  messageSlice.actions;
export default messageSlice.reducer;
