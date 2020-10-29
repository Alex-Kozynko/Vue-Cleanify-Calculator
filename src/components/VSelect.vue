<template>
  <div class="v-select" :class="{open: visible, style2: style2, reverse: reverse}" @click="visible = !visible" v-click-outside="clickOutside">
    <div class="text">
      <p class="title">
        {{ value[label] }}
        <span v-if="details && +detailsValue(value)">{{ details.replace(/[{].*/, '') + detailsValue(value) + details.replace(/.*[{}]/, '') }}</span>
      </p>
      <img src="@/assets/img/icons/arrowDown.svg" alt=""/>
    </div>
    <div class="v-list-dropdown">
      <ul ref="select">
        <li
            v-for="option in options"
            @click="selected(option)"
            :class="{active: value[labelOption] === option[labelOption]}"
        >
          {{ option[labelOption] }}
          <span v-if="details && +detailsValue(option)">{{ details.replace(/[{].*/, '') + detailsValue(option) + details.replace(/.*[{}]/, '') }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-select',
  props: {
    options: {
      type: Array,
      required: true
    },
    labelOption: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: 'text'
    },
    value: {},
    details: {
      type: String,
      default: ''
    },
    style2: {
      type: Boolean,
      default: false
    },
    reverse: {
      type: Boolean
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {},
  methods: {
    clickOutside() {
      this.visible = false
    },
    selected(option) {
      this.$emit('update:value', option)
      this.$store.dispatch('setCache')
    },
    detailsValue(item) {
      return item[this.details.match(/[{].*[}]/)[0].replace(/\W/gi, '')]
    }
  },
  created() {
    console.log(this.options);
    console.log(this.value);
  },
}
</script>

<style scoped lang="scss">
.v-select {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .text {
    display: flex;
    align-items: center;
    justify-content: center;

    .title {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: $a24;
      position: relative;

      span {
        font-size: $a12;
        font-weight: 600;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    img {
      margin-left: $a15;
      transition: all 0.2s;
      width: $a15;
    }
  }

  .v-list-dropdown {
    position: absolute;
    left: 0;
    min-width: 100%;
    top: 100%;
    border-radius: 0 0 $a20 $a20;
    background: #FBFBFB;
    padding: max(1px, #{$a2}) 0;
    opacity: 0;
    visibility: hidden;
    overflow: hidden;
    z-index: 100;
    box-shadow: 0 $a15 $a30 rgba(0, 0, 0, 0.1);
    ul {
      list-style: none;
      max-height: $a320;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 2px;
        border-radius : 20px;
      }

      &::-webkit-scrollbar-track {
        background: none;
      }

      &::-webkit-scrollbar-thumb {
        background: $secondary;
        border-radius : 20px;
        width: 2px;
      }

      &::-webkit-scrollbar-thumb:window-inactive {
        background: $secondary;
        border-radius : 20px;
        width: 2px;
      }
      li {
        padding: 0 $a25;
        width: 100%;
        height: $a40;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: space-between;
        white-space: nowrap;
        flex-grow: 1;
        span {
          opacity: .5;
          font-size: $a12;
          margin-left: $a10;
        }
        &:hover {
          background: transparentize($primary, .85);
        }

        &.active {
          background: transparentize($primary, .70);
        }
      }
    }
  }

  &.open {
    .text {
      img {
        transform: rotate(180deg);
      }
    }

    .v-list-dropdown {
      opacity: 1;
      visibility: visible;
    }
  }

  &.style2 {
    padding: 0 $a25 !important;
    &:hover {
      background: none !important;
    }
    .text {
      justify-content: space-between;
      width: 100%;
      .title {
        opacity: .7;
        font-weight: 500;
        font-size: $a16;
        flex-direction: row;
        justify-content: space-between;
        flex-grow: 1;
        span {
          position: static;
          opacity: .5;
        }
      }
    }
    .v-list-dropdown {
      border: max(1px, #{$a1}) solid $secondary;
      border-top-color: $primary;
      left: min(-1px, #{-$a1});
      width: calc(100% + max(2px, #{$a2}));
      background: #fff;
    }
    &.open {
      border-radius: $a16 $a16 0 0 !important;
      border-color: $secondary !important;
    }
    &.reverse {
      .v-list-dropdown {
        top: auto;
        bottom: 100%;
        border-radius: $a20 $a20 0 0;
        box-shadow: 0 (-$a15) $a30 rgba(0, 0, 0, 0.1);
        border: max(1px, #{$a1}) solid $secondary;
        border-bottom-color: $primary;
      }
      &.open {
        border-radius: 0 0 $a16 $a16 !important;
      }
    }
  }
}
</style>
