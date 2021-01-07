<template>
  <div id="extra">
    <h2 v-if="$route.fullPath === '/recurring-cleaning/'">Choose your frequency</h2>
    <h2 v-else>Choose moving type</h2>
    <div class="addons-holder" v-if="$route.fullPath === '/recurring-cleaning/'">
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
      <div class="addons-holder fr">
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
    <h2 v-if="$route.fullPath === '/recurring-cleaning/'">Add ons</h2>
    <div class="addons-holder" v-if="$route.fullPath === '/recurring-cleaning/'">
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

  <!--    <router-link
          :to="{name: 'Checkout'}"
          class="button active"
      >
       Next
      </router-link>
 -->
      <a
          @click="data.frequent = $store.state.frequents[0]; $router.push('/recurring-cleaning/')"
          class="back"
          v-if="$route.fullPath !== '/recurring-cleaning/'"
      >
        < Back
      </a>
     <a href="/checkout" class="button active">Next</a>


    </div>
    <div class="deep" v-if="$route.fullPath === '/recurring-cleaning/'">
      <img src="@/assets/img/deep.png" alt="" />
      <p class="text">For a one time <br>
        Deep Clean <span @click="data.frequent = {text: 'One time', sale: 0}; data.selected.typecleaning = selects.typecleaning[1]; data.addons = [];$router.push('/one-time-cleaning/')">Click Here</span></p>
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
  },
  created() {
    if (this.data.frequent.text === 'One time') {
      this.$router.push('/one-time-cleaning/')
    }
  }
}
</script>

<style lang="scss">
#extra {
  .buttons {
    margin-bottom: vwD(70);
  }
  .deep {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    position: relative;
    img {
      width: vwD(1000);
    }
    .text {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: vwD(80);
      right: 0;
      font-family: 'Gilroy ExtraBold';
      font-size: vwD(35);
      color: #fff;
      white-space: pre-line;
      line-height: initial;
      span {
        color: $primary;
        font-family: 'Gilroy ExtraBold';
        font-size: vwD(35);
        cursor: pointer;
      }
    }
  }
  h2 {
    margin-bottom: vwD(40);
  }
  h5 {
    width: 100%;
  }
  .holder {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: vwD(45);
    grid-row-gap: vwD(15);
    width: 100%;
    margin-bottom: vwD(55);
    .item {
      display: flex;
      align-items: center;
      &:hover {
        background: none;
        cursor: auto;
      }
      .num {
        padding-left: vwD(25);
        padding-right: vwD(10);
        width: vwD(100);
        .arrow {
          display: flex;
          flex-direction: column;
          margin-left: auto;
          img {
            width: vwD(15);
            margin: vwD(4);
            cursor: pointer;
          }
          .upp {
            transform: rotate(180deg);
          }
        }
      }
      h3 {
        width: auto;
        margin-right: vwD(30);
      }
    }
  }
  .addons-holder {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: vwD(45);
    grid-row-gap: vwD(15);
    width: 100%;
    margin-bottom: vwD(55);
    &.col-4 {
      grid-template-columns: repeat(4, 1fr);
    }
    input {
      padding: 0 vwD(25) !important;
    }
  }
  .item {
    padding: 0 vwD(18) 0 vwD(10);
    justify-content: flex-start;
    &.other {
      padding-left: vwD(25);

    }
    &.frequent {
      justify-content: center;
      position: relative;
      .name {
        font-weight: 600;
      }
      .sale {
        position: absolute;
        top: calc(100% + #{vwD(10)});
        left: 0;
        right: 0;
        margin: auto;
        text-align: center;
        font-size: vwD(13);
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
      width: vwD(40);
      height: vwD(40);
      background: $primary;
      border-radius: vwD(10);
      margin-right: vwD(20);
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
    margin: vwD(35) 0;
    .item {
      &.v-select {
        margin-bottom: 0;
      }
    }
    .detail {
      margin-left: vwD(40);
    }
  }
  textarea.button {
    padding: vwD(20) vwD(25);
    width: 100%;
    height: vwD(100);
    cursor: auto;
    resize: none;
    &:hover {
      background: none;
    }
  }
}

@media screen and (max-width: $mobileOn) {
  #extra {
    padding-top: vwM(10);
    .deep {
      width: 100%;
      margin-bottom: vwM(30);
      img {
        width: 100%;
        height: vwM(80);
        border-radius: vwM(16);
      }
      .text {
        font-size: vwM(17);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 vwM(25);
        left: 0;
        width: 100%;
        span {
          font-size: vwM(17);
        }
      }
    }
    h2 {
      margin-bottom: vwM(20);
    }
    .holder {
      grid-template-columns: 1fr !important;
      padding-top: vwM(20);
      .item {
        h3 {
          margin-right: vwM(10);
          min-width: 35%;
        }
        .num {
          width: vwM(80);
          padding-right: vwM(15);
          padding-left: vwM(25);
          margin-left: auto;
          margin-bottom: 0;
          .arrow {
            margin-left: vwM(15);
            img {
              width: vwM(12);
              margin: vwM(5) 0;
            }
          }
        }
      }
    }
    .addons-holder {
      grid-template-columns: 1fr !important;
      &.fr {
        .item {
          &:nth-child(-n + 2) {
            padding: 0 vwM(20);
          }
          p {
            font-size: vwM(12) !important;
          }
        }
      }
    }
    .addons-holder:first-of-type, .addons-holder.col-4 {
      display: flex;
      flex-wrap: wrap;
      grid-column-gap: 0;
      grid-row-gap: 0;
      .item {
        border-radius: 0;
        width: calc(100%/3);
        height: vwM(56);
        padding: 0 vwM(5);
        margin-bottom: 0;
        p {
          white-space: normal;
          font-size: vwM(16);
          text-align: center;
          width: 100%;
          line-height: initial;
        }
        &:first-child {
          border-radius: vwM(16) 0 0 vwM(16);
        }
        &:last-child {
          border-radius: 0 vwM(16) vwM(16) 0;
        }
      }
      input {
        padding-left: vwM(25) !important;
      }
    }
    .addons-holder.col-4 {
      .item {
        width: 50%;
        &:nth-child(1) {
          border-radius: vwM(16) 0 0 0;
        }
        &:nth-child(2) {
          border-radius: 0 vwM(16) 0 0;
        }
        &:nth-child(4) {
          border-radius: 0 0 vwM(16) 0;
        }
        &:nth-child(3) {
          border-radius: 0 0 0 vwM(16);
        }
      }
    }
    .item {
      width: 100%;
      margin-bottom: vwM(10);
      padding: 0 vwM(20) 0 vwM(10);
      &.frequent {
        justify-content: flex-start;
        padding-left: vwM(25);
      }
      .icon {
        width: vwM(40);
        height: vwM(40);
        border-radius: vwM(10);
        margin-right: vwM(15);
      }
      .name {
        font-size: vwM(18);
        white-space: nowrap;
        width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .price {
        font-size: vwM(16);
      }
    }
    .petsHolder {
      margin-top: vwM(10);
      .detail {
        display: none;
      }
    }
    textarea.button {
      border-radius: vwM(16);
      height: vwM(130);
      padding: vwM(20) vwM(25);
      margin-top: vwM(16);
    }
  }
}
</style>
