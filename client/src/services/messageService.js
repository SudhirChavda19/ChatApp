import axiosWithCredentials from "./axiosWithCredentials";

export const MessageApi = {
  SendMessage: async (data) => {
    return await axiosWithCredentials.post(`/message/sendMessage`, data);
  },
  GetRoomMessages: async (id, pageParam, limit) => {
    const response = await axiosWithCredentials.get(`/message/getMessages/${id}`, {params: { page: pageParam, limit },});
    return response;
  },
//   RequestStatusUpdate: async ({ isAccepted, roomId, senderId }) => {
//     console.log("senderId :", senderId);
    
//     const id = roomId;
//     const status = isAccepted;
//     return await axiosWithCredentials.patch(`/room/updateRoomStatus/${id}`, {
//       status,
//       senderId,
//     });
//   },
//   RemoveRoom: async (id) => {
//     console.log("id :", id);
//     return await axiosWithCredentials.delete(`/room/removeRoom/${id}`);
//   },
};
