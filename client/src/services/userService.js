import axiosWithCredentials from "./axiosWithCredentials";

export const AuthApi = {
  SearchUserService: (query) => axiosWithCredentials.get(`/user/search`, {params: query}),

};