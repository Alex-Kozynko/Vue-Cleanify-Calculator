import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import $moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    addons: [],
    pets: [],
    date: [],
    times: [],
    entrances: [],
    frequents: [],
    location: {},
    selects: {},
    dataToSend: {
      selected: {
        industry: {},
        typecleaning: {},
        premises: {}
      },
      addons: [],
      pet: {item: 'No pets'},
      entrance: {item: 'How do we get in ?'},
      frequent: {text: 'One time', sale: 0},
      date: {
        day: $moment().add(1, 'days').format('DD'),
        month: $moment().add(1, 'days').format('MM'),
        year: $moment().add(1, 'days').format('YYYY'),
        time: {
          text: "Please select time",
          sale: 0,
          hidden: true
        }
      },
      address: '',
      zip: '',
      message: '',
      sf: 123,
      qCleaners: 1,
      qHours: 1,
      email: ''
    }
  },
  mutations: {
    data(state, payload) {
      state.addons = payload['extra-addons']
      state.pets = payload['extra-pets']
      state.date = payload['booking-date']
      state.times = payload['booking-time']
      state.entrances = payload['entrance']
      state.frequents = payload['frequent']
      state.location = payload['location']
      state.selects = payload['stepone']
      state.dataToSend.frequent = state.frequents[0]
      if (!localStorage.getItem('state')) {
        state.dataToSend.selected.industry = state.selects.industry[0]
        state.dataToSend.selected.typecleaning = state.selects.typecleaning[0]
        state.selects.premises.forEach((item, i) => {
          item.items[0].index = 0
          Vue.set(state.dataToSend.selected.premises, item.name, item.items[0])
        })
      }
    },
    cache(state, payload) {
      for (let key in payload) {
        state[key] = payload[key]
      }
    },
    dataToSend(state, {key, payload}) {
      state.dataToSend[key] = payload
    }
  },
  actions: {
    getData({state, commit}) {
      axios({
        method: 'get',
        url: 'https://test2.niklex.net/wp-json/api/v1/data'
      })
      .then((response) => {
        console.log(response);
        if (response.data['extra-addons']) {
          commit('data', response.data)
        }
      })
      .catch((error) => console.error(error))
    },
    getCache({state, commit}) {
      if (localStorage.getItem('state')) {
        commit('cache', JSON.parse(localStorage.getItem('state')))
      }
    },
    setCache({state}) {
      localStorage.setItem('state', JSON.stringify(state))
    }
  },
  modules: {
  }
})
