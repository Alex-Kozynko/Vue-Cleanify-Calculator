<template>
  <div id="app">
    <header>
      <a href="/" class="logo">
        <img src="@/assets/img/icons/logo.svg" alt=""/>
      </a>
      <div class="progressbar">
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
      </div>
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
        >
          {{ data.date.month + '-' + data.date.day + '-' + data.date.year }}
          <span class="subText" v-if="data.date.time.sale >= 0">{{data.date.time.text.slice(0, 9) }} <span v-if="+data.date.time.sale">{{'- $' + data.date.time.sale + '.00'}}</span></span>
        </router-link>
        <router-link
            to="/booking-2"
            class="item link"
        >
          {{ data.date.month + '-' + data.date.day + '-' + data.date.year }}
          <span class="subText">{{data.frequent.text}}</span>
        </router-link>
      </nav>
      <p class="fullCost">
        <animated-number
            class="number"
            :value="subtotal"
            :formatValue="formatToPrice"
            :duration="500"
        />
        <span class="sub">SUBTOTAL</span>
      </p>
    </header>
    <router-view class="main"/>
  </div>
</template>

<script>
import VSelect from '@/components/VSelect'
import AnimatedNumber from "animated-number-vue";

export default {
  components: {
    VSelect,
    AnimatedNumber
  },
  data() {
    return {
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
      return (+this.data.selected.typecleaning.price + this.addonsPrice - timeSale + bedroomPrice + bathroomPrice ) * frequentSale;
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
    }
  },
  created() {
    this.$store.dispatch('getCache')
    this.$store.dispatch('getData')
  },
  updated() {

  }
}
</script>

<style lang="scss">
@import "~@/scss/fonts";

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

html {
  overflow: hidden;
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
  border: max(1px, #{$a1}) solid $primary;
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

    .logo {
      width: $a200;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: max(1px, #{$a1}) solid #F0F0F0;

      img {
        width: $a120;
      }
    }

    .item {
      padding: 0 $a20 0 $a25;
      border-bottom: max(1px, #{$a10}) solid $primary;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;

      &:before {
        content: '';
        width: max(1px, #{$a1});
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
      border-left: max(1px, #{$a1}) solid #F0F0F0;
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
}
</style>
