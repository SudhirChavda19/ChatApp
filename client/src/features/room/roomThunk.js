import { createAsyncThunk } from "@reduxjs/toolkit";
import { RoomApi } from "../../services/roomService";

export const loadRooms = createAsyncThunk(
  "rooms/loadRooms",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await RoomApi.GetRooms(roomId);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Failed to fetch rooms');
    }
  }
);