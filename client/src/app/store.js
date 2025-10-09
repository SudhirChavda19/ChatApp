import { configureStore } from '@reduxjs/toolkit';
import roomReducer from '../features/room/roomSlice';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    rooms: roomReducer,
    // users: userReducer,
  },
});
