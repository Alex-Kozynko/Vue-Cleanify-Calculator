<template>
  <div id="extra">
    <h2>Extra options</h2>
    <h5 class="title">ADD ONS</h5>
    <div
        class="item button"
        :class="{active: data.addons.map(addon => addon.text).includes(item.text)}"
        v-for="item in items"
        :key="item.text"
        @click="selectedAddons(item)"
    >
      <div class="icon">
        <img :src="item.icon" alt="" />
      </div>
      <p class="name">{{item.text}}</p>
      <p class="price">${{item.price}}</p>
    </div>
    <div class="petsHolder">
      <v-select
          class="item button"
          label="item"
          label-option="item"
          :options="pets"
          :value.sync="data.pet"
          style2
      ></v-select>
      <p class="detail">Some of our cleaners have pet allergies. </p>
    </div>
    <textarea class="button" placeholder="Special instructions? (Optional)"></textarea>
    <div class="buttons">
      <a
          href="/"
          class="back"
      >
        < Back
      </a>
      <router-link
          to="/booking"
          class="button active"
      >
        Next
      </router-link>
    </div>
  </div>
</template>

<script>
import VSelect from '@/components/VSelect'
export default {
  name: 'Extra',
  components: {
    VSelect
  },
  computed: {
    items() {
      return this.$store.state.addons
    },
    subtotal() {
      return this.$store.state.subtotal;
    },
    pets() {
      return this.$store.state.pets;
    },
    data() {
      return this.$store.state.dataToSend;
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
  h2 {
    margin-bottom: $a70;
  }
  h5 {
    width: 100%;
  }
  .item {
    padding: 0 $a18 0 $a10;
    width: $a410;
    justify-content: flex-start;
    margin-bottom: $a15;
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
    }
    &.active {
      background: transparentize($primary, .70);
      color: $color;
      .name, .price {
        opacity: 1;
      }
    }
  }
  .petsHolder {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: $a20;
    margin-bottom: $a35;
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
    .item {
      width: 100%;
      margin-bottom: $m10;
      padding: 0 $m20 0 $m10;
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
