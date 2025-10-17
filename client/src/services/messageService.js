import axiosWithCredentials from "./axiosWithCredentials";

export const MessageApi = {
  SendMessage: async (data) => {
    return await axiosWithCredentials.post(`/message/sendMessage`, data);
  },
  GetRoomMessages: async (id, pageParam, limit) => {
    const response = await axiosWithCredentials.get(`/message/getMessages/${id}`, {params: { page: pageParam, limit },});
    return response;
  },
};
