import { configureStore } from '@reduxjs/toolkit';
import roomReducer from '../features/room/roomSlice';
import messageReducer from '../features/message/messageSlice';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    rooms: roomReducer,
    messages: messageReducer,
  },
});
