<template>
  <div id="extra">
    <h2>Extra options</h2>
    <h5 class="title">ADD ONS</h5>
    <div class="addons-holder">
      <div
          class="item button"
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
    <div class="petsHolder">
      <v-select
          class="item button"
          label="item"
          label-option="item"
          :options="pets"
          v-model="data.pet"
          style2
          v-if="pets.length"
      ></v-select>
      <p class="detail">Some of our cleaners have pet allergies. </p>
    </div>
    <textarea class="button" placeholder="Special instructions? (Optional)" v-model="data.message"></textarea>
    <div class="buttons">
<!--      <a
          href="/"
          class="back"
      >
        < Back
      </a>-->
      <router-link
          :to="{name: 'Booking'}"
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
  .addons-holder {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: $a45;
    grid-row-gap: $a15;
  }
  .item {
    padding: 0 $a18 0 $a10;
    width: $a410;
    justify-content: flex-start;
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
