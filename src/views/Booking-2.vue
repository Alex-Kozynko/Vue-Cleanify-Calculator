<template>
  <div id="booking-2">
    <h2>Where are we coming to clean?</h2>
    <h4>Add on extras for a cleaning upgrade.</h4>
    <input class="item button address" placeholder="Address">
    <input class="item button apt" placeholder="APT">
    <input class="item button zip" placeholder="ZIP">
    <div class="entrancesHolder">
      <v-select
          class="item button"
          label="item"
          label-option="item"
          :options="entrances"
          :value.sync="data.entrance"
          style2
          v-if="entrances.length"
      ></v-select>
    </div>
    <h2>How frequent?</h2>
    <h5 class="title">RECURRING</h5>
    <div
        class="item button frequent"
        :class="{active: item.text === data.frequent.text}"
        v-for="item in frequents"
        :key="item.text"
        @click="data.frequent = item"
    >
      <p class="name">{{item.text}}</p>
      <p class="sale" v-if="item.sale > 0">{{item.sale}}% off</p>
    </div>
    <div class="buttons">
      <router-link
          to="/booking"
          class="back"
      >
        < Back
      </router-link>
      <router-link
          to="/checkout"
          class="button active"
      >
        Next
      </router-link>
    </div>
  </div>
</template>

<script>
import VSelect from "@/components/VSelect";

export default {
  name: "Booking-2",
  components: {
    VSelect
  },
  computed: {
    data() {
      return this.$store.state.dataToSend;
    },
    entrances() {
      return this.$store.state.entrances;
    },
    frequents() {
      return this.$store.state.frequents;
    }
  }
}
</script>

<style lang="scss">
  #booking-2 {
    h4 {
      margin-top: $a20;
      margin-bottom: $a40;
    }
    h5 {
      width: 100%;
    }
    .item {
      padding: 0 $a25;
      position: relative;
    }
    .frequent {
      width: $a275;
      .sale {
        position: absolute;
        top: calc(100% + #{$a10});
        left: 0;
        right: 0;
        margin: auto;
        text-align: center;
        font-size: $a13;
        font-weight: 600;
        opacity: .7;
        color: $color;
      }
    }
    input {
      cursor: auto;
      &:hover {
        background: none;
      }
    }
    .address {
      width: calc(50% - #{$a20 * 2 / 3});
    }
    .apt, .zip {
      width: calc(25% - #{$a20 * 2 / 3});
    }
    .entrancesHolder {
      margin: $a40 0 $a45 0;
      width: $a410;
    }
    &>.title {
      margin-top: $a40;
      margin-bottom: $a15;
    }
    .buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-top: $a86;
      .back {
        margin-right: $a35;
      }
      .button {
        width: $a110;
      }
    }
  }
</style>
