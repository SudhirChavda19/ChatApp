import axiosWithCredentials from "./axiosWithCredentials";

export const RoomApi = {
  CreateNewRequest: async (data) => {
    await axiosWithCredentials.post(`/room/createRoom`, data);
  },
  GetRooms: async (id) => {
    console.log("id :", id);
    return await axiosWithCredentials.get(`/room/getRoomUsers/${id}`);
  },
  RequestStatusUpdate: async ({ isAccepted, roomId, senderId }) => {
    console.log("senderId :", senderId);

    const id = roomId;
    const status = isAccepted;
    return await axiosWithCredentials.patch(`/room/updateRoomStatus/${id}`, {
      status,
      senderId,
    });
  },
};
