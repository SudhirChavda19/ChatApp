import axiosWithCredentials from "./axiosWithCredentials";

export const UserApi = {
  SearchUserService: async (username, pageParam) => {
    const response = await axiosWithCredentials.get(`/user/search`, {
      params: { username, page: pageParam, limit: 10 },
    });
    return response.data;
  },
  GetUser: async (id) => {
    return await axiosWithCredentials.get(`/user/getUser/${id}`);
  },
  UpdateUser: async ({id, data}) => {
    return await axiosWithCredentials.patch(`/user/updateUser/${id}`, data);
  },
};
