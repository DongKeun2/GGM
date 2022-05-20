import api from '@/api/index.js'
import axios from 'axios'
import router from '@/router'
import _ from 'lodash'
import Swal from 'sweetalert2'

export default {
  state: {
    reviews: [],
    review: {},
  },
  getters: {
    reviews: state => state.reviews,
    review: state => state.review,
    isAuthor: (state, getters) => {
      return state.review.user?.username === getters.currentUser.username
    },
    isReview: state => !_.isEmpty(state.review),
  },
  mutations: {
    SET_REVIEWS: (state, reviews) => state.reviews = reviews,
    SET_REVIEW: (state, review) => state.review = review,
  },
  actions: {
    fetchReviews({ commit, getters }) {
      axios({
        url: api.reviews.reviews(),
        method: 'get',
        headers: getters.authHeader,
      })
        .then(res => commit('SET_REVIEWS', res.data))
        .catch(err => console.error(err.response))
    },
    createReview({ commit, getters }, review) {
      axios({
        url: api.reviews.reviews(),
        method: 'post',
        data: review,
        headers: getters.authHeader,
      })
        .then(res => {
          commit('SET_REVIEW', res.data)
          router.push({
            name: 'reviewDetail',
            params: { reviewPk: getters.review.pk }
          })
        })
    },
    fetchReview({ commit, getters }, reviewPk) {
      axios({
        url: api.reviews.review(reviewPk),
        method: 'get',
        headers: getters.authHeader,
      })
      .then(res => commit('SET_REVIEW', res.data))
      .catch(err => {
        console.error(err.response)
        if (err.response.status === 404) {
          router.push({ name: 'NotFound404' })
        }
      })
    },
    updateReview({ commit, getters }, review, reviewPk) {
      axios({
        url: api.reviews.review(reviewPk),
        method: 'patch',
        data: review,
        headers: getters.authHeader,
      })
        .then(res => {
          commit('SET_REVIEW', res.data)
          router.push({
            name: 'reviewDetail',
            params: { reviewPk: getters.review.pk }
          })
        })
    },
    deleteReview({ commit, getters }, reviewPk) {
      Swal.fire({
        title: '리뷰 삭제하실?',
        text: "삭제버튼을 클릭하면 해당 리뷰는 영구삭제 됩니다.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      })
        .then((result) => {
          if (result.value) {
            axios({
              url: api.reviews.review(reviewPk),
              method: 'delete',
              headers: getters.authHeader,
            })
              .then(() => {
                commit('SET_REVIEW', {})
                router.push({ name: 'community' })
              })
              .catch(err => console.error(err.response))
          }
        })
    },
  },
}