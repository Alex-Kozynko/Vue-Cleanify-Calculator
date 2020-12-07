<template>
  <div id="extra">
    <h2 v-if="data.frequent.text !== 'One time'">Choose your frequency</h2>
    <h2 v-else>Choose moving type</h2>
    <div class="addons-holder" v-if="data.frequent.text !== 'One time'">
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
    </div>
    <template v-else>
      <div class="addons-holder">
        <!--      <v-select
                  class="item button"
                  label="abridgment"
                  label-option="text"
                  :options="selects.typecleaning.slice(1)"
                  :details="time"
                  v-model="data.selected.typecleaning"
                  v-if="selects.typecleaning"
                  style2
              ></v-select>-->
        <div
            class="item button frequent"
            :class="{active: item.text === data.selected.typecleaning.text}"
            v-for="(item, i) in selects.typecleaning"
            :key="item.text"
            @click="data.selected.typecleaning = item"
            v-if="selects.typecleaning && i !== 0"
        >
          <p class="name">{{ item.text }}</p>
        </div>
      </div>
      <div class="holder">
        <div class="item">
          <h3>How many cleaners?</h3>
          <div class="item button num">
            {{data.qCleaners}}
            <div class="arrow">
              <img src="@/assets/img/icons/arrowDown.svg" alt="" class="upp" @click="data.qCleaners++"/>
              <img src="@/assets/img/icons/arrowDown.svg" alt="" class="down" @click="data.qCleaners > 1 && data.qCleaners--"/>
            </div>
          </div>
<!--          <input type="number" class="item button num" placeholder="How many cleaners?" v-model="data.qCleaners" min="1">-->
        </div>
        <div class="item">
          <h3>How many hours?</h3>
          <div class="item button num">
            {{data.qHours}}
            <div class="arrow">
              <img src="@/assets/img/icons/arrowDown.svg" alt="" class="upp" @click="data.qHours++"/>
              <img src="@/assets/img/icons/arrowDown.svg" alt="" class="down" @click="data.qHours > 3 && data.qHours--"/>
            </div>
          </div>
        </div>
      </div>
    </template>
    <h2>How do we get in ?</h2>
    <div class="addons-holder col-4">
      <div
          class="item button frequent"
          :class="{active: item.item === data.entrance.item}"
          v-for="item in entrances"
          :key="item.item"
          @click="data.entrance = item"
          v-if="item.item !== 'Other'"
      >
        <p class="name">{{item.item}}</p>
      </div>
      <input type="text"
             class="button item other"
             placeholder="Other..."
             @input="data.entrance = $event.currentTarget.value"
             @click="data.entrance = $event.currentTarget.value"
             :class="{active: !data.entrance.item}"
      >
    </div>
    <h2 v-if="data.frequent.text !== 'One time'">Add ons</h2>
    <div class="addons-holder" v-if="data.frequent.text !== 'One time'">
      <div
          class="item button addon"
          :class="{
            active: data.addons.map(addon => addon.text).includes(item.text) || item.addons_included.includes(data.selected.typecleaning.text),
            disabled: item.addons_included.includes(data.selected.typecleaning.text)
          }"
          v-for="item in items"
          :key="item.text"
          @click="selectedAddons(item)"
      >
        <div class="icon">
          <img :src="item.icon" alt=""/>
        </div>
        <p class="name">{{ item.text }}</p>
        <p class="price" v-if="!item.addons_included.includes(data.selected.typecleaning.text)">${{ item.price }}</p>
        <p class="price in" v-else>Included</p>
      </div>
    </div>
    <div class="buttons">
      <router-link
          :to="{name: 'Checkout'}"
          class="button active"
      >
        Next
      </router-link>
    </div>
    <div class="deep" v-if="data.frequent.text !== 'One time'">
      <img src="@/assets/img/deep.png" alt="" />
      <p class="text">For a one time <br>
        Deep Clean <span @click="data.frequent = {text: 'One time', sale: 0}; data.selected.typecleaning = selects.typecleaning[1]; data.addons = []">Click Here</span></p>
    </div>
  </div>
</template>

<script>
import VSelect from '@/components/VSelect'
export default {
  name: 'Extra',
  props: {
    time: Number
  },
  components: {
    VSelect
  },
  computed: {
    items() {
      return this.$store.state.addons
    },
    pets() {
      return this.$store.state.pets;
    },
    data() {
      return this.$store.state.dataToSend;
    },
    frequents() {
      return this.$store.state.frequents;
    },
    entrances() {
      return this.$store.state.entrances;
    },
    selects() {
      return this.$store.state.selects;
    },
  },
  methods: {
    selectedAddons(item) {
      if (this.data.addons.map(addon => addon.text).includes(item.text)) {
        this.$store.commit('dataToSend', {key: 'addons', payload: this.data.addons.filter(addon => addon.text !== item.text)})
      } else {
        this.$store.commit('dataToSend', {key: 'addons', payload: [...this.data.addons, item]})
      }
      this.$store.dispatch('setCache')
    }
  }
}
</script>

<style lang="scss">
#extra {
  .buttons {
    margin-bottom: $a70;
  }
  .deep {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    position: relative;
    img {
      width: $a1000;
    }
    .text {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: $a80;
      right: 0;
      font-family: 'Gilroy ExtraBold';
      font-size: $a35;
      color: #fff;
      white-space: pre-line;
      span {
        color: $primary;
        font-family: 'Gilroy ExtraBold';
        font-size: $a35;
        cursor: pointer;
      }
    }
  }
  h2 {
    margin-bottom: $a40;
  }
  h5 {
    width: 100%;
  }
  .holder {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: $a45;
    grid-row-gap: $a15;
    width: 100%;
    margin-bottom: $a55;
    .item {
      display: flex;
      align-items: center;
      &:hover {
        background: none;
        cursor: auto;
      }
      .num {
        padding-left: $a25;
        padding-right: $a10;
        width: $a100;
        .arrow {
          display: flex;
          flex-direction: column;
          margin-left: auto;
          img {
            width: $a15;
            margin: $a4;
            cursor: pointer;
          }
          .upp {
            transform: rotate(180deg);
          }
        }
      }
      h3 {
        width: auto;
        margin-right: $a30;
      }
    }
  }
  .addons-holder {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: $a45;
    grid-row-gap: $a15;
    width: 100%;
    margin-bottom: $a55;
    &.col-4 {
      grid-template-columns: repeat(4, 1fr);
    }
    input {
      padding: 0 $a25 !important;
    }
  }
  .item {
    padding: 0 $a18 0 $a10;
    justify-content: flex-start;
    &.other {
      padding-left: $a25;

    }
    &.frequent {
      justify-content: center;
      position: relative;
      .name {
        font-weight: 600;
      }
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
    &.addon {
      &.active {
        background: transparentize($primary, .70);
        color: $color;
        .name, .price {
          opacity: 1;
        }
      }
    }
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: $a40;
      height: $a40;
      background: $primary;
      border-radius: $a10;
      margin-right: $a20;
      img {
        width: 50%;
      }
    }
    .name, .price {
      opacity: .7;
    }
    .price {
      font-weight: 600;
      margin-left: auto;
      &.in {
        color: $primary;
        letter-spacing: .05em;
      }
    }
    &.active {
      .name {
        opacity: 1;
      }
      &::-webkit-input-placeholder {
        color: #fff;
      }
      &::-moz-placeholder {
        color: #fff;
      }
    }
  }
  .petsHolder {
    width: 100%;
    display: flex;
    align-items: center;
    margin: $a35 0;
    .item {
      &.v-select {
        margin-bottom: 0;
      }
    }
    .detail {
      margin-left: $a40;
    }
  }
  textarea.button {
    padding: $a20 $a25;
    width: 100%;
    height: $a100;
    cursor: auto;
    resize: none;
    &:hover {
      background: none;
    }
  }
}

@media screen and (max-width: $mobileOn) {
  #extra {
    .deep {
      width: 100%;
      margin-bottom: $m30;
      img {
        width: 100%;
        height: $m80;
        border-radius: $m16;
      }
      .text {
        font-size: $m17;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 $m25;
        left: 0;
        width: 100%;
        span {
          font-size: $m17;
        }
      }
    }
    h2 {
      margin-bottom: $m20;
    }
    .holder {
      grid-template-columns: 1fr !important;
      .item {
        h3 {
          margin-right: $m10;
          min-width: 35%;
        }
        input {
          padding-left: $m25;
        }
      }
    }
    .addons-holder {
      grid-template-columns: 1fr !important;
      input {
        padding-left: $m25 !important;
      }
    }
    .item {
      width: 100%;
      margin-bottom: $m10;
      padding: 0 $m20 0 $m10;
      &.frequent {
        justify-content: flex-start;
        padding-left: $m25;
      }
      .icon {
        width: $m40;
        height: $m40;
        border-radius: $m10;
        margin-right: $m15;
      }
      .name {
        font-size: $m18;
        white-space: nowrap;
        width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .price {
        font-size: $m16;
      }
    }
    .petsHolder {
      margin-top: $m10;
      .detail {
        display: none;
      }
    }
    textarea.button {
      border-radius: $m16;
      height: $m130;
      padding: $m20 $m25;
      margin-top: $m16;
    }
  }
}
</style>
