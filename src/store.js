import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: () => ({
      clicks: 0
    }),

    mutations: {
      incrementClick (state, increment = 1) {
        state.clicks = state.clicks + increment
      }
    }
  })
}
