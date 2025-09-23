import axiosWithCredentials from "./axiosWithCredentials";

export const UserApi = {
  SearchUserService: async (username, pageParam) => {
    console.log("pageParam :", pageParam);
    const response = await axiosWithCredentials.get(`/user/search`, {
      params: { username, page: pageParam, limit: 10 },
    });
    return response.data;
  },
};
