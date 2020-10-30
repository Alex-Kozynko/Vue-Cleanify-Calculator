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
    selects: {
      /*industry: [
        {
          text: 'Corporate Offices',
          abridgment: 'Corp. Offices',
        },
        {
          text: 'Residential Facilities',
          abridgment: 'Residential Facilities',
        },
        {
          text: 'Religious Facility',
          abridgment: 'Religious Facility',
        },
        {
          text: 'Fitness Locations',
          abridgment: 'Fitness Locations',
        },
        {
          text: 'Educational Facilities',
          abridgment: 'Educational Facilities',
        },
        {
          text: 'Medical Facilities',
          abridgment: 'Medical Facilities',
        },
        {
          text: 'Retail Storefronts',
          abridgment: 'Retail Storefronts',
        },
        {
          text: 'Hospitality',
          abridgment: 'Hospitality',
        }
      ],
      bedroom: [
        {
          text: 'Studio',
          abridgment: 'Studio'
        },
        {
          text: '1 Bedroom',
          abridgment: '1 Bed'
        },
        {
          text: '2 Bedrooms',
          abridgment: '2 Bed'
        },
        {
          text: '3 Bedrooms',
          abridgment: '3 Bed'
        },
        {
          text: '6 and Up Bedrooms',
          abridgment: '6+ Bed'
        },
      ],
      bathroom: [
        {
          text: '1 Bathroom',
          abridgment: '1 Bath'
        },
        {
          text: '2 Bathroom',
          abridgment: '2 Bath'
        },
        {
          text: '3 Bathroom',
          abridgment: '3 Bath'
        },
        {
          text: '4 Bathroom',
          abridgment: '4 Bath'
        },
        {
          text: '5 Bathroom',
          abridgment: '5 Bath'
        },
        {
          text: '6 and Up Bathroom',
          abridgment: '6+ Bath'
        },
      ],
      typecleaning: [
        {
          text: 'Standard',
          abridgment: 'Standard',
          duration: 2
        },
        {
          text: 'Deep Clean',
          abridgment: 'Deep Clean',
          duration: 4
        },
      ],
      dependencies: {
        standard: {
          bathroom: 20,
          bedroom: 7
        },
        deep: {
          bathroom: 60,
          bedroom: 20
        }
      }*/
    },
    dataToSend: {
      selected: {
       industry: {
          text: 'Corporate Offices',
          abridgment: 'Corp. Offices',
          data: {
            bathroom: [
              {
                text: '1 bathroom',
                abridgment: '1 bath',
                price: 10 // $
              }
            ]
          }
        },
       bedroom: {
          text: 'Studio',
          abridgment: 'Studio'
        },
       bathroom: {
          text: '1 Bathroom',
          abridgment: '1 Bath'
        },
       typecleaning: {
         abridgment: "Standard",
         dependencies: {
           bathroom: "20",
           bedroom: "7"
         },
         duration: "2",
         text: "Standard",
         price: '72'
        },
      },
      addons: [],
      pet: {item: 'No pets'},
      entrance: {item: 'How do we get in ?'},
      frequent: {text: 'One time', sale: 0},
      date: {
        day: $moment().add(1, 'days').format('DD'),
        month: $moment().add(1, 'days').format('MM'),
        year:  $moment().add(1, 'days').format('YYYY'),
        time: {
          text: "Please select time",
          sale: 0
        }
      },
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
      state.selects = payload['stepone']
    },
    subtotal(state, payload) {
      state.subtotal = payload
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
