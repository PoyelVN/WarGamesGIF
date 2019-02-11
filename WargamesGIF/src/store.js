import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loaging: false,
    user: null,
    gifs: [],
    snackbar: { active: false, color: "", mode: "", timeout: 0, text: "" },

  },
  mutations: {
    setUser(state, val) {
      state.user = val
    },
    setLoading(state, val) {
      state.loading = val
    },
    setGifs(state, val) {
      state.gifs = val
    },
    setSnackbar(state, val) {
      state.snackbar = Object.assign({}, val, { active: true })
  }},
  actions: {

  }
})
