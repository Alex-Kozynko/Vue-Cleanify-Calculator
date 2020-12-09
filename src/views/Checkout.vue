<template>
  <div id="checkout">
    <h2>Checkout</h2>
<!--    <div class="firstClean">Get 50% OFF for your first clean</div>-->
    <form name="checkout" method="post" class="checkout woocommerce-checkout" action="/checkout" enctype="multipart/form-data">
      <div class="form-info">
        <div class="left">
          <h3>Almost there !</h3>
          <p class="subtitle">Enter your payment & contact info to finalize your appoinment</p>
          <input type="text" class="button item" placeholder="First name*" required name="billing_first_name">
          <input type="text" class="button item" placeholder="Last name*" required name="billing_last_name">
          <input type="email" class="button item" placeholder="Email address*" required name="billing_email" v-model="data.email">
          <input type="text" class="button item" placeholder="Company name" name="billing_company">
          <h4>Service address</h4>
          <div class="address" :class="{success: data.address.status === true, error: !data.address.status}">
            <gmap-autocomplete
                class="button item gmapauto"
                :value="data.address.street"
                @place_changed="getAddressData($event)"
                placeholder="Street address*"
                required
                name="cleaning_address"
            />
            <p class="status">Address is not valid</p>
            <input type="text" class="button zip item" placeholder="Zip" name="cleaning_zip" v-model="data.zip">
          </div>
          <div class="address">
            <input type="text" class="button apt item" placeholder="Apt" name="cleaning_apt">
            <input type="text" class="button item" placeholder="City" name="cleaning_city" :value="data.address.city" readonly>
            <input type="text" class="button item" placeholder="State" name="cleaning_state" :value="data.address.state" readonly>
          </div>
          <div class="cupon" :class="{ok: this.apply_coupon.amount, error: this.apply_coupon === false}">
            <input type="text" class="button item" placeholder="Have a coupon? Enter your CODE here." v-model="coupon">
            <div class="button active" @click="chCoupon()">Apply</div>
          </div>
        </div>

        <input type="hidden" name="_vue_order_coupon" :value="apply_coupon.coupon">

        <div id="id_receipt" class="right" :class="{open: receiptVisible}">
          <p class="title">Receipt <span class="arrow" @click="receiptVisible = !receiptVisible"></span></p>
          <template v-for="(select, key) in data.selected.premises">
            <div class="item">
              <p class="name">{{ key[0].toUpperCase() + key.slice(1) }}</p>
              <p class="value">{{ select.text }}</p>
            </div>
            <input type="hidden" :name="'_vue_order_premises[' + key[0].toUpperCase() + key.slice(1)+']'" :value="select.text">
          </template>

          <div class="item">
            <p class="name">Date</p>
            <p class="value">
              {{ $moment(data.date.month + data.date.day + data.date.year, 'MMDDYYYY').format('MMMM DD, YYYY') }}</p>
          </div>
          <input type="hidden" name="_vue_order_date"
                 :value="$moment(data.date.month + data.date.day + data.date.year, 'MMDDYYYY').format('MMMM DD, YYYY')">

          <div class="item">
            <p class="name">Time</p>
            <p class="value">{{ data.date.time.text }}</p>
          </div>
          <input type="hidden" name="_vue_order_date_time" :value="data.date.time.text">

          <div class="item">
            <p class="name">Address</p>
            <p class="value">{{data.address.street + ', ' + data.zip}}</p>
          </div>

<!--          <div class="item">
            <p class="name">Zip code</p>
            <p class="value">{{data.zip}}</p>
          </div>-->
          <input type="hidden" name="_vue_order_zip" :value="data.zip">
          <input type="hidden" name="_vue_order_address" value="">

          <div class="item" :class="{small: data.addons.length > 0}">
            <p class="name">Addons</p>
            <div class="value" v-if="data.addons.length > 0">
              <animated-number
                  class="number"
                  :value="addonsPrice"
                  :formatValue="formatToPrice"
                  :duration="500"
              />
              <div class="details-holder">
                ?
                <div class="detail">
                  <p v-for="addon in data.addons">
                    {{ addon.text }}
                    <span v-if="!addon.addons_included.includes(data.selected.typecleaning.text)"> ${{ addon.price }}</span>
                    <span v-else>Included</span>
                  </p>
                </div>
              </div>
            </div>
            <p class="value" v-else>-</p>
          </div>
          <!-- Вставить   значение -->
          <input type="hidden" name="_vue_order_addons" :value="addonsPrice">

          <div class="item">
            <p class="name">Clean</p>
            <p class="value">
              <animated-number
                  class="number"
                  :value="clean"
                  :formatValue="formatToPrice"
                  :duration="500"
              />
            </p>
          </div>
          <input type="hidden" name="_vue_order_сlean" v-model="clean">

          <div class="item">
            <p class="name">Recurring</p>
            <p class="value">{{ data.frequent.text }}</p>
          </div>
          <input type="hidden" name="_vue_order_recurring" :value="data.frequent.text">

          <div class="item" :class="{small: +data.date.time.sale || +data.frequent.sale}">
            <p class="name">Discounts</p>
            <div class="value">
              <animated-number
                  class="number"
                  :value="-data.date.time.sale - (clean + addonsPrice - data.date.time.sale) * (data.frequent.sale / 100)"
                  :formatValue="formatToPrice"
                  :duration="500"
              />
              <div class="details-holder" v-if="+data.date.time.sale || +data.frequent.sale">
                ?
                <div class="detail">
                  <!--                <p>First Cleaning 50% OFF <span> $75</span></p>-->
                  <p v-if="+data.date.time.sale > 0">Time sale <span> ${{ data.date.time.sale }}</span></p>
                  <p v-if="+data.frequent.sale > 0">Recurring {{ data.frequent.sale }}% off
                    <span> ${{ ((clean + addonsPrice - data.date.time.sale) * (data.frequent.sale / 100)).toFixed(0) }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Вставить   значение -->
          <input type="hidden" name="_vue_order_discounts"
                 :value="-data.date.time.sale - (clean + addonsPrice - data.date.time.sale) * (data.frequent.sale / 100)">


          <div class="item">
            <p class="name">Promo</p>
            <p class="value">
              <animated-number
                  class="number"
                  :value="promo"
                  :formatValue="formatToPrice"
                  :duration="500"
              />
            </p>
          </div>

          <!-- Вставить   значение -->
          <input type="hidden" name="_vue_order_promo" value="">


          <div class="item total">
            <p class="name">Total</p>
            <p class="value">
              <animated-number
                  class="number"
                  :value="subtotal"
                  :formatValue="formatToPrice"
                  :duration="500"
              />
            </p>
          </div>
          <input type="hidden" name="_vue_order_total_price" :value="clean">
          <input type="hidden" name="_vue_order_discounted_amount" :value="subtotal">

        </div>
      </div>

      <input type="hidden" name="payment_method" v-model="payment_method"/>

      <input type="hidden" name="details" :value="data.message"/>

      <div v-html="wp_nonce_field" v-show="false"></div>

      <div class="footer">
        <p>Your personal data will be used to process your order,
          support your experience throughout this website, and
          for other purposes described in our privacy policy.</p>
        <label class="checkbox-holder">
          <span class="checkbox">
            <input type="checkbox" required v-model="agree">
            <span></span>
          </span>
          <span>
            I AGREE TO THE WEBSITE
            <a href="/terms.html" target="_blank">TERMS</a>
            AND
            <a href="/policy.html" target="_blank">CONDITIONS</a>
          </span>
        </label>
        <div class="buttons-holder">
          <div class="button" @click="payment_method = 'authnet'" :class="{active: payment_method === 'authnet', disabled: !agree || !data.address.status}">Pay
            with Card
          </div>
<!--          <button
              class="button" type="submit"
              @click="payment_method = 'paypal'"
              :class="{active: payment_method === 'paypal', disabled: !agree}"
              :disabled="!agree"
          >
            PayPal
          </button>-->
          <button
              class="button"
              type="submit"
              @click="payment_method = 'cod'"
              :class="{disabled: !agree || !data.address.status}"
              :disabled="!agree || !data.address.status"
          >
            Submit Request
          </button>
        </div>
        <div class="creditCard" v-show="payment_method === 'authnet'">
          <div class="close" @click="payment_method = 'cod'"></div>
          <div class="holder">
            <div class="item">
              <div class="button active">Credit cart</div>
              <img src="~@/assets/img/cardType.png" alt=""/>
            </div>
            <input type="text" class="button cardNumber item" placeholder="Card number" name="authnet-card-number">
            <div class="item">
              <input type="text" class="button" placeholder="MM/YY" name="authnet-card-expiry">
              <input type="text" class="button" placeholder="CVC" name="authnet-card-cvc">
            </div>
            <label class="checkbox-holder billing">
            <span class="checkbox">
              <input type="checkbox" v-model="sameBillingAddress" name="same_billing_address">
              <span></span>
            </span>
              <span>Billing address different to service address</span>
            </label>
            <template v-if="!sameBillingAddress">
              <input type="text" class="button gmapauto item" placeholder="Street address*" name="billing_address"
                     :value="!sameBillingAddress ? '' : data.address.street" required>
              <div class="address">
                <input type="text" class="button zip item" placeholder="Zip" name="cleaning_zip" :value="!sameBillingAddress ? '' : data.zip" required>
                <input type="text" class="button item" placeholder="Apt" name="billing_apt">
              </div>
              <div class="address">
                <input type="text" class="button item" placeholder="City*" name="billing_city"
                       :value="!sameBillingAddress ? '' : data.address.city" required>
                <input type="text" class="button item" placeholder="State*" name="billing_state"
                       :value="!sameBillingAddress ? '' : data.address.state" required>
              </div>
            </template>
            <button class="button active " name="woocommerce_checkout_place_order" type="submit"
                    @click="payment_method = 'authnet'">Place order
            </button>
          </div>

        </div>
      </div>
    </form>
  </div>
</template>

<script>
import AnimatedNumber from "animated-number-vue";
import {mask} from 'vue-the-mask'
import axios from "axios";
import {gmapApi} from "vue2-google-maps";
export default {
  name: "Checkout",
  components: {
    AnimatedNumber
  },
  directives: {
    mask
  },
  mounted() {
    let checkoutScript = document.createElement('script')
    checkoutScript.setAttribute('src', '/wp-content/plugins/woocommerce/assets/js/frontend/checkout.min.js')
    document.head.appendChild(checkoutScript)
  },
  data() {
    return {
      cardPay: false,
      receiptVisible: false,
      payment_method: 'cod',
      coupon:'',
      apply_coupon:'',
      dependenciesTime: 0,
      agree: false,
      sameBillingAddress: true
    }
  },
  computed: {
    wp_nonce_field(){

      if ( typeof global_wp_nonce_field  !== 'undefined'){
         return global_wp_nonce_field;
      } else {
        return false;
      }

    },

    data() {
      return this.$store.state.dataToSend;
    },
    selects() {
      return this.$store.state.selects;
    },
    subtotal() {
      let timeSale = this.data.date.time.sale ? this.data.date.time.sale : 0
      let frequentSale = (100 - this.data.frequent.sale) / 100

      let dependenciesPrice = 0;
      this.dependenciesTime = 0;
      this.data.selected.typecleaning.typecleaning_dependencies && this.data.selected.typecleaning.typecleaning_dependencies.forEach(item => {
        dependenciesPrice += +item.price * (this.data.selected.premises[item.label].index + 1)
      })

      let total = (+this.data.selected.typecleaning.price + this.addonsPrice - timeSale + dependenciesPrice + (this.data.qHours > 2 && this.$route.fullPath === '/one-time-cleaning' ? ((this.data.qHours - 2) * 50) : 0)) * frequentSale

      if (this.apply_coupon.discount_type !== 'percent') {
        total -= this.apply_coupon.amount ? this.saleCupon : 0
      } else {
        total = total * this.saleCupon
      }

      return  total
    },
    saleCupon() {
      if (this.apply_coupon.discount_type !== 'percent') {
        return +this.apply_coupon.amount
      } else {
        return this.apply_coupon.amount ? 1 - +this.apply_coupon.amount / 100 : 1
      }
    },
    promo() {
      if (this.apply_coupon.discount_type !== 'percent') {
        return +this.apply_coupon.amount * -1
      } else {
        return -this.subtotal / (100 - +this.apply_coupon.amount) * +this.apply_coupon.amount
      }
    },
    addonsPrice() {
      return this.data.addons.length > 0 ? this.data.addons.map(addon => !addon.addons_included.includes(this.data.selected.typecleaning.text) && +addon.price).reduce((a, b) => a + b) : 0
    },
    clean() {
      let dependenciesPrice = 0
      this.data.selected.typecleaning.typecleaning_dependencies && this.data.selected.typecleaning.typecleaning_dependencies.forEach(item => {
        dependenciesPrice += +item.price * (this.data.selected.premises[item.label].index + 1)
      })
      return (+this.data.selected.typecleaning.price + dependenciesPrice + (this.data.qHours > 2 ? ((this.data.qHours - 2) * 50) : 0));
    },
    location() {
      return this.$store.state.location;
    },
    zip() {
      return this.data.zip
    },
    google: gmapApi
  },
  methods: {
    getAddressData(e) {
      let th = this
      new google.maps.Geocoder().geocode({'address': th.location.centeraddress}, (results, status) => {
        if (status === 'OK' && th.google.maps.geometry.spherical.computeDistanceBetween(e.geometry.location, results[0].geometry.location) < th.location.radius) {
          let zip = e.address_components.filter(item => item.types[0] === 'postal_code')[0]
          if (zip) {
            let address =  e.address_components.filter(item => item.types[0] === "street_number")[0].long_name + ' ' + e.address_components.filter(item => item.types[0] === "route")[0].long_name;
            this.data.address.street = address;
            this.data.address.status = true
            /*th.$store.commit('dataToSend', {key: 'address', payload: address})
            th.$store.commit('dataToSend', {key: 'zip', payload: zip.long_name})*/
            this.$store.dispatch('setCache')
          } else {
            this.data.address.status = false
            this.data.address.street = '';
          }
        } else {
          this.data.address.status = false
          this.data.address.street = '';
        }
      })
    },
    formatToPrice(value) {
      return value < 0 ? '-$' + value.toFixed(0) * -1 : '$' + value.toFixed(0);
    },
    chCoupon() {
      axios({
        method: 'get',
        url: 'https://test2.niklex.net/wp-json/api/v2/coupon/'+this.coupon
      })
          .then((response) => {
            console.log(response.data);
            this.apply_coupon = '';
            if (response.data.is_valid) {
              this.apply_coupon  =  {
                amount: response.data.amount,
                discount_type: response.data.discount_type,
                coupon: this.coupon
              };
            } else {
              this.apply_coupon = false;
            }
          })
          .catch((error) => {
            this.apply_coupon = false;
            console.error(error)}


          )
    },
  },
  updated() {
  },
  watch: {
    zip(zip) {
      new google.maps.Geocoder().geocode({'address': zip}, (results, status) => {
        console.log(results);
        results[0].address_components.forEach(item => {
          if (item.types.includes("administrative_area_level_1")) {
            this.data.address.state = item.short_name
          }
          if (item.types.includes("sublocality_level_1")) {
            this.data.address.city = item.short_name
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
  #checkout {
    flex-direction: column;
    padding: $a55 $a460 !important;
    height: 100%;
    h2 {
      margin-bottom: $a35;
    }
    input[readonly] {
      background: #F0F0F0;
      &:hover {
        background: #F0F0F0 !important;
      }
    }
    .firstClean {
      width: 100%;
      height: $a76;
      background: $primary;
      border-radius: $a16;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: $a30;
      color: #ffffff;
      margin-bottom: $a40;
    }
    .checkout {
      width: 100%;
    }
    .form-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      margin-bottom: $a45;
      .left {
        width: $a515;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: $a25;
        h4 {
          text-align: left;
          margin-bottom: $a30;
          padding-left: $a25;
        }
        h3 {
          padding-left: $a25;
          text-align: left;
          width: 100%;
        }
        .address {
          display: flex;
          justify-content: space-between;
          width: 100%;
          position: relative;
          input:not(:last-of-type) {
            margin-right: $a15;
          }
          .zip {
            width: 44.5%;
          }
          .status {
            display: none;
          }
          &.success {
            .gmapauto {
              border-color: #00ff00;
            }
          }
          &.error {
            .gmapauto {
              border-color: red;
            }
            .status {
              display: block;
              position: absolute;
              bottom: $a15;
              left: $a25;
              color: red;
              font-size: $a10;
            }
          }
        }
        .subtitle {
          margin-top: $a10;
          margin-bottom: $a20;
          opacity: .3;
          font-size: $a15;
          width: 100%;
          padding-left: $a25;
        }
        .item {
          padding: 0 $a25;
          width: 100%;
          margin-bottom: $a30;
          cursor: auto;
          &:hover {
            background: none;
          }
        }
        .cupon {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-top: $a10;
          &.ok {
            .item {
              border-color: #00ff00;
            }
          }
          &.error {
            .item {
              border-color: red;
            }
          }
          .item {
            margin-bottom: 0;
          }
          .button.active {
            margin-left: $a36;
            min-width: $a108;
          }
        }
      }
      .right {
        width: $a360;
        background: transparentize($color, .97);
        padding: $a25 $a15 $a15 $a15;
        border-radius: 1px;
        .title {
          width: 100%;
          text-align: center;
          font-size: $a25;
          margin-bottom: $a20;
          .arrow {
            display: none;
          }
        }
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #EAEAF0;
          padding: $a10 0;
          &.small {
            padding: $a6 0;
          }
          p.name, p.value {
            opacity: .7;
            font-weight: 500;
            width: 50%;
            overflow: hidden;
            span {
              white-space: nowrap;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              display: block;
            }
          }
          div.value {
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
              opacity: .7;
              font-weight: 500;
            }
          }
          &.total {
            border-bottom: 0;
            p {
              font-size: $a23;
              font-weight: bold;
              span {
                font-size: inherit;
                font-weight: inherit;
              }
            }
          }
          .details-holder {
            width: $a25;
            height: $a25;
            border-radius: $a8;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid $primary;
            background: transparentize($primary, .8);
            font-weight: bold;
            font-size: $a10;
            position: relative;
            cursor: help;
            .detail {
              border: 1px solid $primary;
              background: linear-gradient(0deg, transparentize($primary, .8), transparentize($primary, .8)), #fff;
              top: calc(100% + #{$a16});
              left: 50%;
              padding: $a15 $a20;
              border-radius: 0 $a16 $a16 $a16;
              z-index: -1;
              opacity: 0;
              visibility: hidden;
              transition: all 0.5s;
              position: absolute;
              p {
                font-weight: 500;
                opacity: .7;
                white-space: nowrap;
                display: flex;
                justify-content: space-between;
                span {
                  margin-left: $a25;
                }
                &:not(:last-of-type) {
                  margin-bottom: $a10;
                }
              }
            }
            &:hover {
              .detail {
                visibility: visible;
                opacity: 1;
                z-index: 1;
              }
            }
          }
        }
      }
    }
    .footer {
      width: 80%;
      border-top: 1px solid rgba(102, 108, 121, 0.2);
      margin: 0 auto;
      padding-top: $a30;
      p {
        white-space: pre-line;
        width: $a410;
        margin: 0 auto;
        opacity: .7;
        margin-bottom: $a25;
      }
      .checkbox-holder {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: transparentize($color, .3);
        justify-content: center;
        margin-bottom: $a40;
        a {
          margin: 0 $a5;
        }
        .checkbox {
          width: $a25;
          height: $a25;
          border-radius: $a4;
          border: 1px solid $primary;
          box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.1);
          background: transparentize($primary, .8);
          cursor: pointer;
          margin-right: $a15;
          position: relative;
          input {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            opacity: 0;
            &:checked~ {
              span {
                position: absolute;
                top: 0;
                bottom: $a5;
                left: 0;
                right: 0;
                margin: auto;
                transform: rotate(-45deg);
                width: $a15;
                height: $a8;
                border-left: 2px solid $color;
                border-bottom: 2px solid $color;
              }
            }
          }
        }
      }
      .buttons-holder {
        display: flex;
        justify-content: center;
        .button {
          width: $a200;
          margin: 0 $a15;
          &.disabled {
            color: rgba(16, 16, 16, 0.3);
          }
        }
      }
      .creditCard {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: $a410;
        margin: $a25 auto 0 auto;
        .close {
          display: none;
        }
        &:before {
          content: '';
          width: $a200;
          height: 1px;
          background: rgba(102, 108, 121, 0.2);
          margin-bottom: $a25;
        }
        .billing {
          width: $a410;
          justify-content: flex-start;
        }
        .address {
          display: flex;
          justify-content: space-between;
          width: 100%;
          input:first-of-type {
            margin-right: $a15;
          }
          .apt {
            width: $a130;
          }
          .gmapauto {
            &.success {
              border-color: #00ff00;
            }
            &.error {
              border-color: red;
            }
          }
        }
        input {
          padding: 0 $a25;
        }
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: $a30;
          width: 100%;
          img {
            width: $a180;
          }
          input {
            width: calc(50% - #{$a20});
            box-sizing: border-box;
          }
          .button.active {
            width: $a200;
            margin-right: $a35;
          }
        }
        .button.active {
          padding: 0 $a35;
          margin: 0 auto;
        }
      }
    }
  }
  @media screen and (max-width: $mobileOn) {
    #checkout {
      h2 {
        margin-bottom: $m20;
      }
      .firstClean {
        font-size: $m16;
        height: $m56;
        border-radius: $m16;
        margin-bottom: $m16;
      }
      .form-info {
        flex-direction: column;
        .left, .right {
          width: 100%;
        }
        .left {
          h3, .subtitle {
            display: none;
          }
          h4 {
            margin-bottom: $m20;
            margin-top: $m20;
          }
          .item {
            padding: 0 $m25;
            margin-bottom: $m10;
          }
          .address {
            flex-flow: row wrap;
            &:nth-of-type(1) {
              .item {
                &:nth-of-type(1) {
                  margin-right: 0;
                }
                &:nth-of-type(2) {
                  width: calc(50% - #{$m5});
                }
              }
            }
            &:nth-of-type(2) {
              justify-content: flex-end;
              margin-top: -$m66;
              .item {
                width: calc(50% - #{$m5});
                margin-right: 0;
                &:nth-of-type(1) {
                  margin-left: $m20;
                }
                &:nth-of-type(2) {
                  margin-right: auto;
                }
              }
            }
            input {
              overflow: hidden;
              text-overflow: ellipsis;
              &:not(:last-of-type) {
                margin-right: $m10;
              }
            }
          }
        }
        .right {
          padding: $m15;
          margin-top: $m15;
          .title {
            font-size: $m24;
            text-align: left;
            margin-bottom: 0;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .arrow {
              display: flex;
              align-items: center;
              justify-content: center;
              width: $m32;
              height: $m32;
              border-radius: $m8;
              background: $primary;
              padding-bottom: $m4;
              &:before {
                content: '';
                border-right: $m3 solid $color;
                border-bottom: $m3 solid $color;
                width: $m8;
                height: $m8;
                transform: rotate(45deg);
              }
            }
          }
          .item {
            padding: $m10 0 !important;
            display: none;
            p {
              font-size: $m13;
            }
            .value {
              font-size: $m13;
              span {
                font-size: inherit;
                font-weight: inherit;
              }
            }
            .details-holder {
              width: $m20;
              height: $m20;
              border-radius: $m6;
              font-size: $m10;
              .detail {
                top: 0;
                left: auto;
                right: calc(100% + #{$m10});
                border-radius: $m8;
                padding: $m10;
                p {
                  span {
                    font-size: $m12;
                    margin-left: $m10;
                  }
                }
              }
            }
            &.total {
              p {
                font-size: $m20;
              }
            }
          }
          &.open {
            .title {
              margin-bottom: $m15;
              .arrow {
                padding-bottom: 0;
                padding-top: $m4;
                &:before {
                  transform: rotate(225deg);
                }
              }
            }
            .item {
              display: flex;
            }
          }
        }
      }
      .footer {
        border-top: 0;
        width: 100%;
        p {
          width: 100%;
        }
        .checkbox-holder {
          align-items: flex-start;
          margin-top: $m15;
          .checkbox {
            min-width: $m20;
            height: $m20;
            border-radius: $m6;
            margin-right: $m10;
            margin-top: $m2;
            input:checked~ {
              span {
                width: $m10;
                height: $m6;
                bottom: $m3;
              }
            }
          }
        }
        .buttons-holder {
          justify-content: space-between;
          flex-direction: column-reverse;
          margin-top: $m20;
          padding-bottom: $m30;
          .button {
            width: 100%;
            margin: 0;
            margin-bottom: $m10;
            &:not(:first-of-type) {
              margin: 0 0 $m10 0;
            }
          }
        }
        .creditCard {
          margin-top: 0;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: $m10;
          justify-content: flex-start;
          z-index: 100;
          max-height: 100%;
          background: transparentize($color, .5);
          .holder {
            background: #ffffff;
            border-radius: $m16;
            max-height: 100%;
            overflow: auto;
            padding: $m10;
            &>.item:nth-child(1) {
              display: none;
            }
          }
          .item {
            width: 100%;
            flex-flow: row wrap;
            margin-bottom: 0;
          }
          .billing {
            width: 100%;
          }
          .address {
            input {
              width: calc(50% - #{$m5}) !important;
            }
          }
          input {
            width: 100% !important;
            margin-bottom: $m10 !important;
            padding: 0 $m25;
            min-height: $m56;
          }
          .button.active {
            width: 100%;
            margin-top: $m10;
          }
          .close {
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            width: $m25;
            height: $m25;
            background: linear-gradient(0deg, $color, $color) no-repeat center center / 2px 70%, linear-gradient(0deg, $color, $color) no-repeat center center / 70% 2px, #fff;
            border-radius: 50%;
            transform: rotate(45deg);
            box-shadow: 0 0 $m3 0 rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }
</style>
