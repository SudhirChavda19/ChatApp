import axiosWithCredentials from "./axiosWithCredentials";

export const UserApi = {
  SearchUserService: async (username, pageParam) => {
    const response = await axiosWithCredentials.get(`/user/search`, {
      params: { username, page: pageParam, limit: 10 },
    });
    console.log('response :', response);
    return response.data;
  },
};
