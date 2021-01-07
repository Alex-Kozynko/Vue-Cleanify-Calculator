<template>
  <div id="checkout">
    <h2>Checkout</h2>
<!--    <div class="firstClean">Get 50% OFF for your first clean</div>-->
    <form name="checkout" method="post" class="checkout woocommerce-checkout" action="/checkout" enctype="multipart/form-data">
      <div class="form-info">
        <div class="left">
          <h3>Almost there !</h3>
          <p class="subtitle">Enter your payment & contact info to finalize your appoinment</p>
          <input type="text" class="button item" placeholder="First name*" name="shipping_first_name" required v-model="data.address.firstName">
          <input type="text" class="button item" placeholder="Last name*" name="shipping_last_name" required v-model="data.address.lastName">
          <input type="email" class="button item" placeholder="Email address*" required v-model="data.address.email">
          <input type="tel" class="button item" placeholder="Phone*" name="billing_phone" required v-model="data.phone">
          <input type="text" class="button item" placeholder="Company name" name="billing_company">
          <h4>Service address</h4>
          <div class="address" :class="{success: data.address.status === true, error: data.address.status === false}">
            <gmap-autocomplete
                class="button item gmapauto"
                placeholder="Street address*"
                name="billing_address_1"
                type="search"
                required
                :value="!sameBillingAddress ? data.billingAddress.street : data.address.street"
                :options="{
                    componentRestrictions: {country: 'us'}
                  }"
                @place_changed="getAddressData($event)"
            />
            <p class="status">Address is not valid</p>
            <input type="text" class="button apt item" placeholder="Apt" name="shipping_apt" v-model="data.address.apt">
          </div>
          <div class="address">
            <input type="text" class="button zip item" placeholder="Zip" name="shipping_postcode" v-model="data.address.zip" :readonly="data.address.status">
            <input type="text" class="button item" placeholder="City" name="shipping_city" :value="data.address.city" readonly>
            <input type="text" class="button item" placeholder="State" name="shipping_state" :value="data.address.state" readonly>

            <input  type="hidden" name="shipping_country" value="US">

          </div>
          <div class="cupon" :class="{ok: this.apply_coupon.amount, error: this.apply_coupon === false}">
            <p v-if="this.apply_coupon === false" class="message">The coupon code you entered is not valid.</p>
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
            <p class="value">{{data.address.street + ', ' + data.address.zip}}</p>
          </div>

<!--          <div class="item">
            <p class="name">Zip code</p>
            <p class="value">{{data.address.zip}}</p>
          </div>-->
          <input type="hidden" name="_vue_order_zip" :value="data.address.zip">
          <input type="hidden" name="_vue_order_address" value="">

          <div class="item" :class="{small: data.addons.length > 0}">
            <p class="name">Add-ons</p>
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
          <input type="hidden" name="_vue_order_discounts" :value="-data.date.time.sale - (clean + addonsPrice - data.date.time.sale) * (data.frequent.sale / 100)">


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

      <input  type="hidden" name="billing_country" value="US">

      <div v-html="wp_nonce_field" v-show="false"></div>

      <div class="footer">
        <div class="buttons-holder">
          <div class="button" @click="payment_method = 'authnet'" :class="{active: payment_method === 'authnet', disabled: data.address.status !== true}">Pay
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
              :class="{disabled: data.address.status !== true}"
              :disabled="!agree || !data.address.status"
          >
            Submit Request
          </button>
        </div>
        <div class="creditCard" v-show="payment_method === 'authnet'">
          <div class="close" @click="payment_method = 'cod'"></div>
          <div class="holder">
            <div class="item">
<!--              <div class="button active">Credit cart</div>-->
              <img src="~@/assets/img/cardType.png" alt=""/>
            </div>
            <input type="text" class="button cardNumber item" placeholder="Card number" :required="payment_method === 'authnet'" v-mask='"#### #### #### ####"' name="authnet-card-number">
            <div class="item">
              <input type="text" class="button" placeholder="MM/YY" v-mask='"##/##"' name="authnet-card-expiry" :required="payment_method === 'authnet'">
              <input type="text" class="button" placeholder="CVC" v-mask="'###'" name="authnet-card-cvc" autocomplete="cc-csc">
            </div>
            <label class="checkbox-holder billing">
            <span class="checkbox">
              <input type="checkbox" v-model="sameBillingAddress" name="same_billing_address">
              <span></span>
            </span>
              <span>Billing address same as Service address</span>
            </label>
            <div class="billing-address-holder" v-show="!sameBillingAddress">
              <div class="address">
                <input type="text" class="button item" placeholder="First name*" required name="billing_first_name" :value="!sameBillingAddress ? data.billingAddress.firstName : data.address.firstName">
                <input type="text" class="button item" placeholder="Last name*" required name="billing_last_name" :value="!sameBillingAddress ? data.billingAddress.lastName : data.address.lastName">
              </div>
              <gmap-autocomplete
                  class="button item gmapauto"
                  placeholder="Street address*"
                  name="billing_address_1"
                  type="search"
                  required
                  :value="!sameBillingAddress ? data.billingAddress.street : data.address.street"
                  :options="{
                    componentRestrictions: {country: 'us'}
                  }"
                  @place_changed="getAddressDataBilling($event)"
              />
              <input type="text"
                     class="button item"
                     placeholder="Apt"
                     name="billing_apt"
                     :value="!sameBillingAddress ? data.billingAddress.apt : data.address.apt"
              >
              <div class="address">
                <input type="text"
                       class="button item"
                       placeholder="City*"
                       name="billing_city"
                       :value="!sameBillingAddress ? data.billingAddress.city : data.address.city"
                       required
                >
                <input type="text"
                       class="button item"
                       placeholder="State*"
                       name="billing_state"
                       :value="!sameBillingAddress ? data.billingAddress.state : data.address.state"
                       required
                >
              </div>
              <div class="address">
                <input type="text"
                       class="button zip item"
                       placeholder="Zip*"
                       name="billing_postcode"
                       :value="!sameBillingAddress ? data.billingAddress.zip : data.address.zip"
                       required
                       maxlength="5"
                >
                <input type="email" class="button item" placeholder="Email address*" required name="billing_email" :value="!sameBillingAddress ? data.billingAddress.email : data.address.email">
              </div>
            </div>
            <button class="button active " name="woocommerce_checkout_place_order" type="submit"
                    @click="payment_method = 'authnet'"
                    :class="{disabled: !agree}"
                    :disabled="!agree"
            >
              Place order
            </button>
          </div>
        </div>
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
        <p>Your personal data will be used to process your order,
          support your experience throughout this website, and
          for other purposes described in our privacy policy.</p>
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

      let total = (+this.data.selected.typecleaning.price + this.addonsPrice - timeSale + dependenciesPrice + (
              this.data.frequent.text === 'One time' &&
          (
              this.data.qHours > 2 ? ((this.data.qHours - 2) * 50) : 0)
          )
      ) * frequentSale

      if (this.apply_coupon.discount_type !== 'percent') {
        total -= this.apply_coupon.amount ? this.saleCupon : 0
      } else {
        total = total * this.saleCupon
      }

      return this.data.frequent.text === 'One time' ? total * this.data.qCleaners : total
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
      let total = +this.data.selected.typecleaning.price + this.addonsPrice + dependenciesPrice + (
              this.data.frequent.text === 'One time' &&
              (
                  this.data.qHours > 2 ? ((this.data.qHours - 2) * 50) : 0)
              )
      return this.data.frequent.text === 'One time' ? total * this.data.qCleaners : total
    },
    location() {
      return this.$store.state.location;
    },
    zip() {
      return this.data.address.zip
    },
    google: gmapApi
  },
  methods: {
    getAddressData(e) {
      let th = this
      new google.maps.Geocoder().geocode({'address': th.location.centeraddress}, (results, status) => {
        console.log(results);
        console.log(results[0].geometry.location);
        results[0].address_components.forEach(item => {
          if (item.types.includes("administrative_area_level_1")) {
            this.data.address.state = item.short_name
            this.$store.dispatch('setCache')
          }
          if (item.types.includes("sublocality_level_1")) {
            this.data.address.city = item.short_name
            this.$store.dispatch('setCache')
          }
        })
        if (status === 'OK' && th.google.maps.geometry.spherical.computeDistanceBetween(e.geometry.location, results[0].geometry.location) < th.location.radius) {
          let zip = e.address_components.filter(item => item.types[0] === 'postal_code')[0]
          if (zip) {
            let address =  e.address_components.filter(item => item.types[0] === "street_number")[0].long_name + ' ' + e.address_components.filter(item => item.types[0] === "route")[0].long_name;
            this.data.address.street = address;
            this.data.address.status = true
            this.data.address.zip = zip.long_name
            this.data.billingAddress = JSON.parse(JSON.stringify(this.data.address))
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
    getAddressDataBilling(e) {
      let address =  e.address_components.filter(item => item.types[0] === "street_number")[0].long_name + ' ' + e.address_components.filter(item => item.types[0] === "route")[0].long_name;
      this.data.billingAddress.street = address;
      e.address_components.forEach(item => {
        if (item.types.includes("administrative_area_level_1")) {
          this.data.billingAddress.state = item.short_name
          this.$store.dispatch('setCache')
        }
        if (item.types.includes("sublocality_level_1")) {
          this.data.billingAddress.city = item.short_name
          this.$store.dispatch('setCache')
        }
        if (item.types.includes("postal_code")) {
          this.data.billingAddress.zip = item.short_name
          this.$store.dispatch('setCache')
        }
      })
    },
    formatToPrice(value) {
      return value < 0 ? '-$' + value.toFixed(0) * -1 : '$' + value.toFixed(0);
    },
    chCoupon() {
      axios({
        method: 'get',
        url: 'https://cleanify.com/wp-json/api/v2/coupon/'+this.coupon
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
  }
}
</script>

<style lang="scss">
.pac-item {
  span {
    font-size: 11px;
    &.pac-item-query {
      font-size: 13px;
    }
    &.pac-matched {
      font-size: 13px;
    }
  }
}
  #checkout {
    flex-direction: column;
    padding: vwD(55) vwD(460) !important;
    height: 100%;
    .woocommerce-error li {
      color: $color !important;
    }
    h2 {
      margin-bottom: vwD(35);
    }
    input[readonly] {
      background: #F0F0F0;
      &:hover {
        background: #F0F0F0 !important;
      }
    }
    .firstClean {
      width: 100%;
      height: vwD(76);
      background: $primary;
      border-radius: vwD(16);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: vwD(30);
      color: #ffffff;
      margin-bottom: vwD(40);
    }
    .checkout {
      width: 100%;
    }
    .form-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      margin-bottom: vwD(45);
      .left {
        width: vwD(515);
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: vwD(25);
        h4 {
          text-align: left;
          margin-bottom: vwD(30);
          padding-left: vwD(25);
        }
        h3 {
          padding-left: vwD(25);
          text-align: left;
          width: 100%;
        }
        .address {
          display: flex;
          justify-content: space-between;
          width: 100%;
          position: relative;
          input:not(:last-of-type) {
            margin-right: vwD(15);
          }
          .zip {
            width: 44.5%;
          }
          .status {
            display: none;
          }
          &.success {
            .gmapauto {
              border-color: #00ff00 !important;
            }
          }
          &.error {
            .gmapauto {
              border-color: red !important;
            }
            .status {
              display: block;
              position: absolute;
              bottom: vwD(5);
              left: vwD(25);
              color: red;
              font-size: vwD(10);
              line-height: initial;
            }
          }
        }
        .subtitle {
          margin-top: vwD(10);
          margin-bottom: vwD(20);
          opacity: .3;
          font-size: vwD(15);
          width: 100%;
          padding-left: vwD(25);
        }
        .item {
          padding: 0 vwD(25);
          width: 100%;
          margin-bottom: vwD(15);
          cursor: auto;
          &:hover {
            background: none;
          }
        }
        .cupon {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-top: vwD(10);
          &.ok {
            .item {
              border-color: #00ff00 !important;
            }
          }
          &.error {
            position: relative;
            .item {
              border-color: red !important;
            }
            .message {
              color: red;
              position: absolute;
              top: 110%;
              left: vwD(25);
              font-size: vwD(10);
            }
          }
          .item {
            margin-bottom: 0;
          }
          .button.active {
            margin-left: vwD(36);
            min-width: vwD(108);
          }
        }
      }
      .right {
        width: vwD(360);
        background: transparentize($color, .97);
        padding: vwD(25) vwD(15) vwD(15) vwD(15);
        border-radius: 1px;
        .title {
          width: 100%;
          text-align: center;
          font-size: vwD(25);
          margin-bottom: vwD(20);
          .arrow {
            display: none;
          }
        }
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #EAEAF0;
          padding: vwD(10) 0;
          &.small {
            padding: vwD(6) 0;
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
              font-size: vwD(23);
              font-weight: bold;
              span {
                font-size: inherit;
                font-weight: inherit;
              }
            }
          }
          .details-holder {
            width: vwD(25);
            height: vwD(25);
            border-radius: vwD(8);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid $primary;
            background: transparentize($primary, .8);
            font-weight: bold;
            font-size: vwD(10);
            position: relative;
            cursor: help;
            .detail {
              border: 1px solid $primary;
              background: linear-gradient(0deg, transparentize($primary, .8), transparentize($primary, .8)), #fff;
              top: calc(100% + #{vwD(16)});
              left: 50%;
              padding: vwD(15) vwD(20);
              border-radius: 0 vwD(16) vwD(16) vwD(16);
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
                  margin-left: vwD(25);
                }
                &:not(:last-of-type) {
                  margin-bottom: vwD(10);
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
      padding-top: vwD(30);
      p {
        white-space: pre-line;
        width: vwD(410);
        margin: 0 auto;
        opacity: .7;
        margin-bottom: vwD(25);
      }
      .checkbox-holder {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: transparentize($color, .3);
        justify-content: center;
        margin-bottom: vwD(15);
        a {
          margin: 0 vwD(5);
        }
        .checkbox {
          width: vwD(25);
          height: vwD(25);
          border-radius: vwD(4);
          border: 1px solid $primary;
          box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.1);
          background: transparentize($primary, .8);
          cursor: pointer;
          margin-right: vwD(15);
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
                bottom: vwD(5);
                left: 0;
                right: 0;
                margin: auto;
                transform: rotate(-45deg);
                width: vwD(15);
                height: vwD(8);
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
        margin-bottom: vwD(25);
        .button {
          width: vwD(200);
          margin: 0 vwD(15);
          &.disabled {
            color: rgba(16, 16, 16, 0.3);
          }
        }
      }
      .creditCard {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: vwD(410);
        margin: vwD(25) auto 0 auto;
        .checkbox-holder {
          margin-bottom: vwD(30);
        }
        .close {
          display: none;
        }
        &:before {
          content: '';
          width: vwD(200);
          height: 1px;
          background: rgba(102, 108, 121, 0.2);
          margin-bottom: vwD(25);
        }
        .billing {
          width: vwD(410);
          justify-content: flex-start;
        }
        .address {
          display: flex;
          justify-content: space-between;
          width: 100%;
          input:first-of-type {
            margin-right: vwD(15);
          }
          .apt {
            width: vwD(130);
          }
          .gmapauto {
            &.success {
              border-color: #00ff00 !important;
            }
            &.error {
              border-color: red !important;
            }
          }
        }
        input {
          padding: 0 vwD(25);
        }
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: vwD(15);
          width: 100%;
          img {
            width: vwD(180);
            margin: 0 auto;
          }
          input {
            width: calc(50% - #{vwD(20)});
            box-sizing: border-box;
          }
          .button.active {
            width: vwD(200);
            margin-right: vwD(35);
          }
        }
        .button.active {
          padding: 0 vwD(35);
          margin: 0 auto vwD(25) auto;
        }
      }
    }
  }
  @media screen and (max-width: $mobileOn) {
    #checkout {
      h2 {
        margin-bottom: vwM(20);
      }
      .firstClean {
        font-size: vwM(16);
        height: vwM(56);
        border-radius: vwM(16);
        margin-bottom: vwM(16);
      }
      .form-info {
        flex-direction: column;
        .left, .right {
          width: 100%;
        }
        .left {
          .cupon {
            .message {
              font-size: vwM(10) !important;
            }
          }
          h3, .subtitle {
            display: none;
          }
          h4 {
            margin-bottom: vwM(20);
            margin-top: vwM(20);
          }
          .item {
            padding: 0 vwM(25);
            margin-bottom: vwM(10);
          }
          .address {
            flex-flow: row wrap;
            .status {
              font-size: vwM(10) !important;
              top: auto !important;
              bottom: calc(100% + #{vwM(5)}) !important;
              left: auto !important;
              right: 0 !important;
            }
            &:nth-of-type(1) {
              z-index: 1;
              .item {
                &:nth-of-type(1) {
                  margin-right: 0;
                }
                &:nth-of-type(2) {
                  width: calc(50% - #{vwM(5)});
                  margin-left: auto;
                  position: absolute;
                  right: 0;
                  top: 200%;
                  z-index: 1;
                }
              }
            }
            &:nth-of-type(2) {
              .item {
                width: calc(50% - #{vwM(5)});
                margin-right: 0;
              }
            }
            input {
              overflow: hidden;
              text-overflow: ellipsis;
              &:not(:last-of-type) {
                margin-right: vwM(10);
              }
            }
          }
        }
        .right {
          padding: vwM(15);
          margin-top: vwM(15);
          .title {
            font-size: vwM(24);
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
              width: vwM(32);
              height: vwM(32);
              border-radius: vwM(8);
              background: $primary;
              padding-bottom: vwM(4);
              &:before {
                content: '';
                border-right: vwM(3) solid $color;
                border-bottom: vwM(3) solid $color;
                width: vwM(8);
                height: vwM(8);
                transform: rotate(45deg);
              }
            }
          }
          .item {
            padding: vwM(10) 0 !important;
            display: none;
            p {
              font-size: vwM(13);
            }
            .value {
              font-size: vwM(13);
              span {
                font-size: inherit;
                font-weight: inherit;
              }
            }
            .details-holder {
              width: vwM(20);
              height: vwM(20);
              border-radius: vwM(6);
              font-size: vwM(10);
              .detail {
                top: 0;
                left: auto;
                right: calc(100% + #{vwM(10)});
                border-radius: vwM(8);
                padding: vwM(10);
                p {
                  span {
                    font-size: vwM(12);
                    margin-left: vwM(10);
                  }
                }
              }
            }
            &.total {
              p {
                font-size: vwM(20);
              }
            }
          }
          &.open {
            .title {
              margin-bottom: vwM(15);
              .arrow {
                padding-bottom: 0;
                padding-top: vwM(4);
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
          margin-top: vwM(15);
          .checkbox {
            min-width: vwM(20);
            height: vwM(20);
            border-radius: vwM(6);
            margin-right: vwM(10);
            margin-top: vwM(2);
            input:checked~ {
              span {
                width: vwM(10);
                height: vwM(6);
                bottom: vwM(3);
              }
            }
          }
        }
        .buttons-holder {
          justify-content: space-between;
          flex-direction: column-reverse;
          margin-top: vwM(20);
          padding-bottom: vwM(30);
          .button {
            width: 100%;
            margin: 0;
            margin-bottom: vwM(10);
            &:not(:first-of-type) {
              margin: 0 0 vwM(10) 0;
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
          padding: vwM(10);
          justify-content: flex-start;
          z-index: 100;
          max-height: 100%;
          background: transparentize($color, .5);
          .holder {
            background: #ffffff;
            border-radius: vwM(16);
            max-height: 100%;
            overflow: auto;
            padding: vwM(10);
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
              width: calc(50% - #{vwM(5)}) !important;
            }
          }
          input {
            width: 100% !important;
            margin-bottom: vwM(10) !important;
            padding: 0 vwM(25);
            min-height: vwM(56);
          }
          .button.active {
            width: 100%;
            margin-top: vwM(10);
          }
          .close {
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            width: vwM(25);
            height: vwM(25);
            background: linear-gradient(0deg, $color, $color) no-repeat center center / 2px 70%, linear-gradient(0deg, $color, $color) no-repeat center center / 70% 2px, #fff;
            border-radius: 50%;
            transform: rotate(45deg);
            box-shadow: 0 0 vwM(3) 0 rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }
</style>
