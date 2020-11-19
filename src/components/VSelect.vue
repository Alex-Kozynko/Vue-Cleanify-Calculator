<template>
  <div class="v-select" :class="{open: visible, style2: style2, reverse: reverse, mobile: mobileStyle, button: mobileStyle}" @click="visible = !visible" v-click-outside="clickOutside">
    <div class="text">
      <p class="title">
        {{ value[label] }}
        <span v-if="value.duration">~ {{ +value.duration + details }} hour</span>
      </p>
      <img src="@/assets/img/icons/arrowDown.svg" alt=""/>
    </div>
    <div class="v-list-dropdown">
      <ul ref="select">
        <li
            v-for="(option, i) in options"
            @click="selected(option, i)"
            :class="{active: value[labelOption] === option[labelOption]}"
        >
          {{ option[labelOption] }}
          <span v-if="option.duration">~ {{ +option.duration + details }} hour</span>
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
    value: {
      type: Object
    },
    details: {},
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
  computed: {
    mobileStyle() {
      return window.innerWidth < 1023
    }
  },
  methods: {
    clickOutside() {
      this.visible = false
    },
    selected(option, i) {
      option.index = i
      this.$emit('input', option)
      this.$store.dispatch('setCache')
    },
/*    detailsValue(item) {
      return item[this.details.match(/[{].*[}]/)[0].replace(/\W/gi, '')]
    },*/
  },
  /*created() {
    !this.value && this.$emit('update:value', this.options[0])
  },*/
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
      font-size: $a20;
      position: relative;

      span {
        font-size: $a13;
        font-weight: 600;
        position: absolute;
        top: 110%;
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
    padding: 1px 0;
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

  &.style2, &.mobile {
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
      border: 1px solid $secondary;
      border-top-color: $primary;
      left: -1px;
      width: calc(100% + 2px);
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
        border: 1px solid $secondary;
        border-bottom-color: $primary;
      }
      &.open {
        border-radius: 0 0 $a16 $a16 !important;
      }
    }
  }
}
@media screen and (max-width: $mobileOn) {
  .v-select {
    &.style2, &.mobile {
      padding: 0 $m25 !important;
      .text {
        .title {
          font-size: $m16;
          span {
            font-size: $m12;
            text-align: center;
          }
        }
        img {
          width: $m13;
          margin-left: $m10;
        }
      }
      .v-list-dropdown {
        border-radius: 0 0 $m16 $m16;
        padding: $m4 0;
        border-width: $m1;
        left: -$m1;
        width: calc(100% + #{$m2});
        ul {
          max-height: $m210;
          li {
            height: auto;
            padding: $m8 $m25;
            white-space: normal;
            span {
              font-size: $m12;
              text-align: center;
              white-space: nowrap;
            }
          }
        }
      }
      &.open {
        border-radius: $m16 $m16 0 0 !important;
      }
      &.reverse {
        .v-list-dropdown {
          border-radius: $m16 $m16 0 0;
        }
        &.open {
          border-radius: 0 0 $m16 $m16 !important;
        }
      }
    }
  }
}
</style>
