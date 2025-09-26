import axiosWithCredentials from "./axiosWithCredentials";

export const RoomApi = {
  CreateNewRequest: async (data) => {
    await axiosWithCredentials.post(`/room/createRoom`, data);
  },
  GetRooms: async (id) => {
  console.log('id :', id);
    return await axiosWithCredentials.get(`/room/getRoomUsers/${id}`);
  },
};
