import axiosWithCredentials from "./axiosWithCredentials";

export const RoomApi = {
  CreateNewRequest: async (data) => {
    return await axiosWithCredentials.post(`/room/createRoom`, data);
  },
  GetRooms: async (id) => {
    return await axiosWithCredentials.get(`/room/getRoomUsers/${id}`);
  },
  RequestStatusUpdate: async ({ isAccepted, roomId, senderId }) => {
    const id = roomId;
    const status = isAccepted;
    return await axiosWithCredentials.patch(`/room/updateRoomStatus/${id}`, {
      status,
      senderId,
    });
  },
  RemoveRoom: async (id) => {
    return await axiosWithCredentials.delete(`/room/removeRoom/${id}`);
  },
};
