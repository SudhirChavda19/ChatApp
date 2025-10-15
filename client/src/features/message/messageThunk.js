import { createAsyncThunk } from "@reduxjs/toolkit";
import { MessageApi } from "../../services/messageService";

export const loadMessages = createAsyncThunk(
  "messages/loadMessages",
  async ({roomId, page = 1, limit=20}, { rejectWithValue }) => {
  console.log('roomId thunk:', roomId);
    try {
      const response = await MessageApi.GetRoomMessages(roomId, page, limit);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Failed to fetch messages');
    }
  }
);