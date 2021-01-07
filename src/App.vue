<template>
  <div id="app">
    <header>
      <a href="/" class="logo">
        <img src="@/assets/img/icons/logo.svg" alt=""/>
      </a>
      <slide-up-down :active="active" :duration="500" class="progressbar">
        <v-select
            class="item"
            :options="[{text: 'Zip code'}]"
            :value="{text: 'Zip code'}"
        ></v-select>
        <v-select
            class="item"
            label="abridgment"
            label-option="text"
            v-for="(select, i) in selects.premises"
            :key="i"
            :options="select.items"
            v-model="data.selected.premises[select.name]"
            v-if="select.items.length"
        ></v-select>
        <v-select
            class="item"
            :options="[{text: data.date.month + '-' + data.date.day + '-' + data.date.year, type: 'date'}]"
            :value="{text: data.date.month + '-' + data.date.day + '-' + data.date.year}"
        ></v-select>
        <v-select
            class="item time"
            label="text"
            label-option="text"
            :options="times"
            v-model="data.date.time"
        ></v-select>
        <v-select
            class="item"
            label="text"
            label-option="text"
            :options="frequents"
            v-model="data.frequent"
        ></v-select>
        <v-select
            class="item"
            :options="[{text: 'Addons', type: 'addons'}]"
            :value="{text: 'Addons', type: 'addons'}"
            v-if="data.frequent.text !== 'One time'"
            :reverse="reverse"
        ></v-select>
      </slide-up-down>
      <div
          @click="active = !active"
          :class="{up: active}"
          class="mobileTrigger"
      >
        <img src="@/assets/img/icons/arrowDown.svg" alt=""/>
      </div>
      <p class="fullCost">
        <animated-number
            class="number"
            :value="subtotal"
            :formatValue="formatToPrice"
            :duration="500"
            v-if="data.selected.industry.industry_dependence"
        />
        <span class="sub">TOTAL</span>
      </p>
    </header>
    <router-view class="main" :time="dependenciesTime"/>
  </div>
</template>

<script>

import VSelect from '@/components/VSelect'
import AnimatedNumber from "animated-number-vue"
import SlideUpDown from 'vue-slide-up-down'

import Vue from 'vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import moment from 'moment'
import * as VueGoogleMaps from 'vue2-google-maps'
import {mask} from "vue-the-mask";
import $moment from "moment";

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB4xzybV9g7EGUUWVNREfVxt5yCBvoNiIQ',
    region: 'US',
    language: 'us',
    libraries: ['places', 'geometry']
  }
})

Vue.prototype.$moment = moment

Vue.config.productionTip = false
Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});

export default {
  store,
  router,
  moment,
  directives: {
    mask
  },

  components: {

    VSelect,
    AnimatedNumber,
    SlideUpDown
  },
  data() {
    return {
      active: true,
      dependenciesTime: 0
    }
  },
  computed: {
    subtotal() {
      let timeSale = this.data.date.time.sale ? this.data.date.time.sale : 0
      let frequentSale = (100 - this.data.frequent.sale) / 100

      let dependenciesPrice = 0;
      this.dependenciesTime = 0;
      this.data.selected.typecleaning.typecleaning_dependencies && this.data.selected.typecleaning.typecleaning_dependencies.forEach(item => {
        dependenciesPrice += +item.price * (this.data.selected.premises[item.label].index + 1)
      })

      let total = (+this.data.selected.typecleaning.price + this.addonsPrice - timeSale + dependenciesPrice + (
              this.data.frequent.text === 'One time' &&
              (
                  this.data.qHours > 2 ? ((this.data.qHours - 2) * 50) : 0)
          )
      ) * frequentSale

      return this.data.frequent.text === 'One time' ? total * this.data.qCleaners : total
    },
    data() {
      return this.$store.state.dataToSend;
    },
    selects() {
      return this.$store.state.selects;
    },
    addonsPrice() {
      return this.data.addons.length > 0 ? this.data.addons.map(addon => !addon.addons_included.includes(this.data.selected.typecleaning.text) && +addon.price).reduce((a, b) => a + b) : 0
    },
    times() {
      return this.$store.state.times;
    },
    frequents() {
      return this.$store.state.frequents;
    }
  },
  methods: {
    formatToPrice(value) {
      return '$' + value.toFixed(0);
    },
    reverse() {
      return window.innerWidth < 1023
    }
  },
  created() {
    this.$store.dispatch('getCache')
    this.$store.dispatch('getData')
    console.log(this.$route);
    if (window.innerWidth < 1023) {
      this.active = false
    }
  },
  updated() {
    console.log(1);
    this.$store.dispatch('setCache')
  }
}
</script>

<style lang="scss">
@import "~@/scss/fonts";

@media screen and (min-width: $mobileOn) {
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: none;
  }

  ::-webkit-scrollbar-track {
    background: none;
  }

  ::-webkit-scrollbar-thumb,
  ::-webkit-scrollbar-thumb:window-inactive {
    background: $secondary;
  }
}

body {
  margin: 0;
  color: $color;
}

body,
body * {
  scrollbar-color: $secondary $primary;
  scrollbar-width: 10px;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Gilroy', sans-serif;
  font-weight: 500;
  font-size: vwD(16);
  outline: none;
  text-decoration: none;
}

h2 {
  font-weight: 800;
  font-size: vwD(35);
  width: 100%;
  text-align: center;
}

h3 {
  font-size: vwD(25);
  font-weight: 600;
  opacity: .8;
}

h4 {
  font-size: vwD(18);
  font-weight: 600;
  opacity: .6;
  width: 100%;
  text-align: center;
}

h5 {
  font-weight: 600;
  font-size: vwD(13);
  margin-bottom: vwD(15);
}

.button {
  height: vwD(55);
  border: 1px solid $primary;
  border-color: $primary !important;
  border-radius: vwD(16);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: none;

  &:hover {
    background: transparentize($primary, .85);
  }

  &.active {
    background: $primary;
    color: #ffffff;
  }

  &.disabled {
    border-color: #E5E5E5;
    opacity: .6;
    box-shadow: inset 0 vwD(2) vwD(2) rgba(0, 0, 0, 0.1);
    pointer-events: none;
  }
}

#app {
  header {
    height: vwD(87);
    padding: 0 vwD(300);
    display: flex;
    background: #FBFBFB;

    .mobileTrigger {
      display: none;
    }

    .logo {
      padding-right: vwD(40);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #F0F0F0;

      img {
        width: vwD(120);
      }
    }
    label {
      font-size: vwD(20);
      text-decoration: none;
      color: $color;
    }

    .progressbar {
      display: flex;
      flex-grow: 1;
      &>.item {
        padding: 0 vwD(20) 0 vwD(25);
        border: 0;
        border-bottom: 10px solid $primary;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        background: none;
        flex-grow: 1;

        &:not(:last-of-type) {
          &:before {
            content: '';
            width: 1px;
            background: #F0F0F0;
            height: 100%;
            right: 0;
            top: 0;
            position: absolute;
          }
        }

        .sf {
          height: 100%;
          border: none;
          background: none;
          //font-weight: 700;
          font-size: vwD(20);
          width: vwD(70);
        }

        &.link {
          padding: 0 vwD(36);
        }

        .subText {
          font-size: vwD(13);
          font-weight: 600;
          position: absolute;
          bottom: vwD(8);
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          span {
            font-size: vwD(12);
            font-weight: 600;
            margin-left: vwD(3);
          }
        }

        &.time {
          .text {
            .title {
              p {
                max-width: vwD(85);
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
    }

    nav {
      display: flex;

      .item {
        //font-weight: 700;
        font-size: vwD(20);
        text-decoration: none;
        color: $color;
      }
    }

    .fullCost {
      color: $primary;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-left: vwD(40);
      margin-left: auto;
      font-weight: 700;
      font-size: vwD(40);
      border-left: 1px solid #F0F0F0;
      width: vwD(105);

      .number {
        font-weight: 700;
        font-size: vwD(40);
      }

      .sub {
        text-transform: uppercase;
        font-size: vwD(10);
        font-weight: 600;
        color: $color;
        text-align: center;
      }
    }
  }

  .main {
    padding: vwD(55) vwD(300);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-flow: row wrap;
    overflow: auto;
  }

  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: vwD(5);
    .back {
      margin-right: vwD(35);
      color: $color;
      cursor: pointer;
    }
    .button {
      width: vwD(110);
      &[disabled] {
        background: #9CE1E0;
        color: $color;
      }
    }
  }
}

@media screen and (max-width: $mobileOn) {
  body {

  }
  body,
  body * {
    font-size: vwM(16);
  }
  h2 {
    font-size: vwM(26);
    text-align: left;
    margin: vwM(20) 0;
  }
  h5 {
    font-size: vwM(13);
    margin-bottom: vwM(12);
  }

  .button {
    height: vwM(56);
    border-radius: vwM(16);
    padding: 0 vwM(35);
    border-width: vwM(1);
  }

  #app {
    header {
      height: auto;
      padding: 0 vwM(16);
      align-items: center;
      filter: drop-shadow(0 vwM(5) vwM(10) rgba(0, 0, 0, 0.1));
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 100;
      border-bottom: vwM(1) solid rgba(0, 0, 0, 0.1);
      flex-flow: row wrap;

      .mobileTrigger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: vwM(32);
        height: vwM(32);
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin: auto;
        border-radius: vwM(8);
        transform: translate(0, -50%);
        transition: all .5s;
        background: $primary;
        padding-bottom: vwM(5);

        &:before {
          content: "";
          border-right: vwM(3) solid $color;
          border-bottom: vwM(3) solid $color;
          width: vwM(8);
          height: vwM(8);
          transform: rotate(45deg);
        }

        img {
          width: 40%;
          display: none;
        }

        &.up {
          padding-bottom: 0;
          padding-top: vwM(5);
          &:before {
            transform: rotate(225deg);
          }
          img {
            transform: rotate(180deg);
          }
        }
      }

      .logo {
        width: auto;
        border-right: 0;
        padding: vwM(10) 0;

        img {
          width: vwM(100);
        }
      }

      .item {
        border-width: vwM(1);

        &:before {
          display: none;
        }
      }

      .progressbar {
        display: block;
        width: 100%;
        background: inherit;
        transition: all 0.5s;
        order: 2;
        position: relative;
        &:before {
          content: '';
          position: absolute;
          bottom: 100%;
          left: -vwM(16);
          width: calc(100% + #{vwM(32)});
          height: vwM(1);
          background: rgba(0,0,0,0.1);
        }

        &>.item:first-of-type {
          margin-top: vwM(16);
        }

        .item {
          height: vwM(44) !important;
          margin-bottom: vwM(10);
          font-weight: bold;
          border: vwM(1) solid $primary;

          p {
            font-weight: bold !important;
          }
          &.time .text .title p {
            max-width: none;
            font-size: vwM(16);
          }
        }
      }

      nav {
        flex-direction: column;
        padding-bottom: vwM(16);

        .item {
          font-size: vwM(16);
          border-radius: vwM(16);
          border: vwM(1) solid $primary;
          flex-direction: row;
          justify-content: space-between;
          padding: 0 vwM(25) !important;
          color: transparentize($color, .3);

          .subText {
            position: static;
            font-size: vwM(14);
          }
        }
      }

      .fullCost {
        width: auto;
        padding: 0 0 0 vwM(15);
        border-left: 0;

        .number {
          font-size: vwM(26);
        }

        .sub {
          font-size: vwM(10);
          display: none;
        }
      }
    }

    .main {
      width: 100%;
      height: auto !important;
      padding: 0 vwM(16) !important;
      padding-top: vwM(60) !important;
    }

    .buttons {
      margin-top: vwM(30);
      padding-bottom: vwM(50);
      .button {
        width: auto;
      }
      .back {
        margin-right: vwM(15);
      }
    }
  }
}
</style>
