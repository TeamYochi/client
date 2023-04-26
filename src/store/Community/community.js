import axios from "../../plugins/axios";
import { useCookies } from "vue3-cookies";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  getters: {},
  actions: {
    async fetchPosts() {
      // 게시판 목록
      try {
        const response = await axios.get("http://localhost/api/community");
        return response.data;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    async createPost({ commit }, postData) {
      // 게시판 글 create
      try {
        console.log("파일확인", postData);
        const rs = await axios.post(
          "http://localhost/api/community/store",
          postData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(rs);
        // 게시글 생성이 성공하면 필요한 작업을 수행합니다.
        return rs.data.msg;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    async getPost({ commit }, postId) {
      //게시판 글 조회 READ
      try {
        const rs = await axios.get(`http://localhost/api/community/${postId}`);
        console.log(rs.data);
        // 조회한 게시글 정보를 처리합니다.
        return rs.data;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    async updatePost({ commit }, { postId, postData }) {
      // 게시판 글 수정 UPDATE
      try {
        const rs = await axios.post(
          `http://localhost/api/community/${postId}`,
          postData
        );
        console.log(rs);
        // 게시글 수정이 성공하면 필요한 작업을 수행합니다.
        return rs.data.msg;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    async deletePost({ commit }, postId) {
      // 게시판 글 삭제 DELETE
      try {
        const rs = await axios.delete(
          `http://localhost/api/community/${postId}`
        );
        console.log(rs);
        // 게시글 삭제가 성공하면 필요한 작업을 수행합니다.
        return rs.data.msg;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },

    async postComment({ commit }, commentData) {
      // 댓글 작성
      try {
        const rs = await axios.post(
          `http://localhost/api/comments/store`,
          commentData
        );
        console.log(rs);
        // 댓글 작성이 성공하면 필요한 작업을 수행합니다.
        return rs.data.msg;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },

    async deleteComment({ commit }, commentId) {
      // 댓글 삭제
      try {
        const rs = await axios.delete(
          `http://localhost/api/comments/${commentId}`
        );
        console.log(rs);
        // 댓글 삭제가 성공하면 필요한 작업을 수행합니다.
        return rs.data.msg;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
};
