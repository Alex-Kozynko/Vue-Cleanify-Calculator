<template>
  <div id="app">
    <header>
      <a href="/" class="logo">
        <img src="@/assets/img/icons/logo.svg" alt=""/>
      </a>
      <slide-up-down :active="active" :duration="500" class="progressbar">
        <v-select
            class="item"
            label="abridgment"
            label-option="text"
            v-for="(select, key) in selects"
            :key="key"
            :details="key === 'typecleaning' ? '~ {duration} hour' : ''"
            :options="select"
            :value.sync="data.selected[key]"
        ></v-select>
        <nav>
          <router-link
              to="/"
              class="item link"
          >
            Extra
          </router-link>
          <router-link
              to="/booking"
              class="item link"
              v-if="$route.name !== 'Extra'"
          >
            {{ data.date.month + '-' + data.date.day + '-' + data.date.year }}
            <span class="subText" v-if="!data.date.time.hidden">{{ data.date.time.text.slice(0, 9) }} <span
                v-if="+data.date.time.sale">{{ '- $' + data.date.time.sale + '.00 off' }}</span></span>
          </router-link>
          <router-link
              to="/booking-2"
              class="item link"
              v-if="$route.name !== 'Booking' && $route.name !== 'Extra'"
          >
            {{ data.address || 'Location' }}
            <span class="subText">{{ data.frequent.text }} <span v-if="+data.frequent.sale">- {{data.frequent.sale +'% off'}}</span></span>
          </router-link>
        </nav>
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
        />
        <span class="sub">TOTAL</span>
      </p>
    </header>
    <router-view class="main"/>
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

  components: {

    VSelect,
    AnimatedNumber,
    SlideUpDown
  },
  data() {
    return {
      active: true
    }
  },
  computed: {
    subtotal() {
      let timeSale = this.data.date.time.sale ? this.data.date.time.sale : 0
      let frequentSale = (100 - this.data.frequent.sale) / 100
      let bedroomSelected = this.data.selected.bedroom
      let bathroomSelected = this.data.selected.bathroom
      let bedroomPrice = +this.data.selected.typecleaning.dependencies.bedroom * (this.selects.bedroom ? (this.selects.bedroom.map(item => item.text).indexOf(bedroomSelected.text) + 1) : 1)
      let bathroomPrice = +this.data.selected.typecleaning.dependencies.bathroom * (this.selects.bathroom ? (this.selects.bathroom.map(item => item.text).indexOf(bathroomSelected.text) + 1) : 1)
      console.log((+this.data.selected.typecleaning.price + this.addonsPrice - timeSale + bedroomPrice + bathroomPrice) * frequentSale);
      return (+this.data.selected.typecleaning.price + this.addonsPrice - timeSale + bedroomPrice + bathroomPrice) * frequentSale;
    },
    data() {
      return this.$store.state.dataToSend;
    },
    selects() {
      return this.$store.state.selects;
    },
    addonsPrice() {
      return this.data.addons.length > 0 ? this.data.addons.map(addon => +addon.price).reduce((a, b) => a + b) : 0
    }
  },
  methods: {
    formatToPrice(value) {
      return '$' + value.toFixed(0);
    },
    currentHeight(e) {

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
  font-size: $a16;
  outline: none;
  text-decoration: none;
}

h2 {
  font-weight: 800;
  font-size: $a35;
  width: 100%;
  text-align: center;
}

h3 {
  font-size: $a25;
  font-weight: 600;
  opacity: .8;
}

h4 {
  font-size: $a18;
  font-weight: 600;
  opacity: .6;
  width: 100%;
  text-align: center;
}

h5 {
  font-weight: 600;
  font-size: $a13;
  margin-bottom: $a15;
}

.button {
  height: $a55;
  border: 1px solid $primary;
  border-radius: $a16;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

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
    box-shadow: inset 0 $a2 $a2 rgba(0, 0, 0, 0.1);
    pointer-events: none;
  }
}

#app {
  header {
    height: $a87;
    display: flex;
    background: #FBFBFB;

    .mobileTrigger {
      display: none;
    }

    .logo {
      width: $a200;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #F0F0F0;

      img {
        width: $a120;
      }
    }

    .item {
      padding: 0 $a20 0 $a25;
      border-bottom: 10px solid $primary;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;

      &:before {
        content: '';
        width: 1px;
        background: #F0F0F0;
        height: 100%;
        right: 0;
        top: 0;
        position: absolute;
      }

      &.link {
        padding: 0 $a36;
      }

      .subText {
        font-size: $a12;
        font-weight: 600;
        position: absolute;
        bottom: $a10;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          font-size: $a12;
          font-weight: 600;
          margin-left: $a3;
        }
      }
    }

    .progressbar {
      display: flex;
    }

    nav {
      display: flex;

      .item {
        font-weight: 700;
        font-size: $a24;
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
      width: $a200;
      margin-left: auto;
      font-weight: 700;
      font-size: $a40;
      border-left: 1px solid #F0F0F0;

      .number {
        font-weight: 700;
        font-size: $a40;
      }

      .sub {
        text-transform: uppercase;
        font-size: $a10;
        font-weight: 600;
        color: $color;
        text-align: center;
      }
    }
  }

  .main {
    padding: $a55 $a300;
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
    margin-top: $a86;
    .back {
      margin-right: $a35;
      color: $color;
    }
    .button {
      width: $a110;
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
    font-size: $m16;
  }
  h2 {
    font-size: $m26;
    text-align: left;
    margin: $m20 0;
  }
  h5 {
    font-size: $m13;
    margin-bottom: $m12;
  }

  .button {
    height: $m56;
    border-radius: $m16;
    padding: 0 $m35;
    border-width: $m1;
  }

  #app {
    header {
      height: auto;
      padding: 0 $m16;
      align-items: center;
      filter: drop-shadow(0 $m5 $m10 rgba(0, 0, 0, 0.1));
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 100;
      border-bottom: $m1 solid rgba(0, 0, 0, 0.1);
      flex-flow: row wrap;

      .mobileTrigger {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: $m25;
        height: $m25;
        background: inherit;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin: auto;
        border-radius: 50%;
        transform: translate(0, -50%);
        padding-bottom: $m5;
        transition: all .5s;

        &.up {
          img {
            transform: rotate(180deg);
          }
        }

        img {
          width: 40%;
        }
      }

      .logo {
        width: auto;
        border-right: 0;
        padding: $m10 0;

        img {
          width: $m100;
        }
      }

      .item {
        border-width: $m1;

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
          left: -$m16;
          width: calc(100% + #{$m32});
          height: $m1;
          background: rgba(0,0,0,0.1);
        }

        &>.item:first-of-type {
          margin-top: $m16;
        }

        .item {
          height: $m44 !important;
          margin-bottom: $m10;
          font-weight: bold;

          p {
            font-weight: bold !important;
          }
        }
      }

      nav {
        flex-direction: column;
        padding-bottom: $m16;

        .item {
          font-size: $m16;
          border-radius: $m16;
          border: $m1 solid $primary;
          flex-direction: row;
          justify-content: space-between;
          padding: 0 $m25 !important;
          color: transparentize($color, .3);

          .subText {
            position: static;
            font-size: $m14;
          }
        }
      }

      .fullCost {
        width: auto;
        padding: 0 0 0 $m15;
        border-left: 0;

        .number {
          font-size: $m26;
        }

        .sub {
          font-size: $m10;
          display: none;
        }
      }
    }

    .main {
      width: 100%;
      height: auto !important;
      padding: 0 $m16 !important;
      padding-top: $m60 !important;
    }

    .buttons {
      margin-top: $m30;
      padding-bottom: $m50;
      .button {
        width: auto;
      }
      .back {
        margin-right: $m15;
      }
    }
  }
}
</style>
