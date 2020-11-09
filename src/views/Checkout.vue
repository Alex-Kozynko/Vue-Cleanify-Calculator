<template>
  <div id="checkout">
    <h2>Checkout</h2>
    <div class="firstClean">Get 50% OFF for your first clean</div>
    <form name="checkout" method="post" class="checkout woocommerce-checkout" action="/checkout" enctype="multipart/form-data">
    <div class="form-info">
      <div class="left">
        <h3>Almost there !</h3>
        <p class="subtitle">Enter your payment & contact info to finalize your appoinment</p>
        <input type="text" class="button item" placeholder="First name*" required name="billing_first_name">
        <input type="text" class="button item" placeholder="Last name*" required name="billing_last_name">
        <input type="email" class="button item" placeholder="Email address*" required name="billing_email">
        <input type="text" class="button item" placeholder="Company name" name="billing_company">
        <input type="tel" class="button item" placeholder="Phone number*" required v-mask="'###-###-####'" name="billing_phone">
        <div class="cupon">
          <input type="text" class="button item" placeholder="Have a coupon? Enter your CODE here.">
          <div class="button active">Apply</div>
        </div>
      </div>
      <div id="id_receipt" class="right" :class="{open: receiptVisible}">
<<<<<<< HEAD

=======
>>>>>>> 05bd03cb8eb8d1ca9ac8107e748c54b7676c3a25
        <p class="title">Receipt <span class="arrow" @click="receiptVisible = !receiptVisible"></span></p>
        <div class="item">
          <p class="name">Industry</p>
          <p class="value">{{ data.selected.industry.text }}</p>
        </div>
<<<<<<< HEAD

         <div class="item">
=======
        <input type="hidden" name="_vue_order_industry" :value="data.selected.industry.text" >

        <div class="item">
>>>>>>> 05bd03cb8eb8d1ca9ac8107e748c54b7676c3a25
          <p class="name">Clean Type</p>
          <p class="value">{{ data.selected.typecleaning.text }} (~{{ data.selected.typecleaning.duration }} hours)</p>
        </div>
        <input type="hidden" name="_vue_order_typecleaning" :value="data.selected.typecleaning.text +' (~'+data.selected.typecleaning.duration + ' hours)'" >

<<<<<<< HEAD

        <div class="item">
          <p class="name">Bedroom</p>
          <p class="value">{{ data.selected.bedroom.text }}</p>
        </div>


=======
         <div class="item">
          <p class="name">Bedroom</p>
          <p class="value">{{ data.selected.bedroom.text }}</p>
        </div>
       <input type="hidden" name="_vue_order_bedroom" :value="data.selected.bedroom.text" >

>>>>>>> 05bd03cb8eb8d1ca9ac8107e748c54b7676c3a25
        <div class="item">
          <p class="name">Bathroom</p>
          <p class="value">{{ data.selected.bathroom.text }}</p>
        </div>
<<<<<<< HEAD

=======
        <input type="hidden" name="_vue_order_bathroom" :value="data.selected.bathroom.text" >
>>>>>>> 05bd03cb8eb8d1ca9ac8107e748c54b7676c3a25

        <div class="item">
          <p class="name">Date</p>
          <p class="value">{{ $moment(data.date.month + data.date.day + data.date.year, 'MMDDYYYY').format('MMMM DD, YYYY') }}</p>
        </div>
        <input type="hidden" name="_vue_order_date" :value="$moment(data.date.month + data.date.day + data.date.year, 'MMDDYYYY').format('MMMM DD, YYYY')" >

        <div class="item">
          <p class="name">Time</p>
          <p class="value">{{ data.date.time.text }}</p>
        </div>
        <input type="hidden" name="_vue_order_date_time" :value="data.date.time.text" >


        <div class="item">
          <p class="name">Address</p>
          <p class="value">-</p>
        </div>

          <input type="hidden" name="_vue_order_address" value="" >

        <div class="item small">
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
                <p v-for="addon in data.addons">{{ addon.text }}   <span> ${{addon.price}}</span></p>
              </div>
            </div>
          </div>
          <p class="value" v-else>-</p>
        </div>
        <!-- Вставить   значение -->
        <input type="hidden" name="_vue_order_addons" value="" >

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
        <input type="hidden" name="_vue_order_сlean" v-model="clean" >

        <div class="item">
          <p class="name">Recurring</p>
          <p class="value">{{ data.frequent.text }}</p>
        </div>
        <input type="hidden" name="_vue_order_recurring" :value="data.frequent.text" >

        <div class="item small">
          <p class="name">Discounts</p>
          <div class="value">
            <animated-number
                class="number"
                :value="-data.date.time.sale - (clean + addonsPrice - data.date.time.sale) * (data.frequent.sale / 100)"
                :formatValue="formatToPrice"
                :duration="500"
            />
            <div class="details-holder">
              ?
              <div class="detail">
                <p>First Cleaning 50% OFF <span> $75</span></p>
                <p v-if="+data.date.time.sale > 0">Time sale   <span> ${{data.date.time.sale}}</span></p>
                <p v-if="+data.frequent.sale > 0">Recurring {{data.frequent.sale}}% off   <span> ${{((clean + addonsPrice - data.date.time.sale) * (data.frequent.sale / 100)).toFixed(0)}}</span></p>
              </div>
            </div>
          </div>
        </div>

         <!-- Вставить   значение -->
        <input type="hidden" name="_vue_order_discounts" value="" >


        <div class="item">
          <p class="name">Promo</p>
          <p class="value">-</p>
        </div>

        <!-- Вставить   значение -->
        <input type="hidden" name="_vue_order_promo" value="" >


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
        <input type="hidden" name="_vue_order_total_price" v-model="subtotal">

      </div>
    </div>

  <input type="hidden"  name="payment_method"  v-model="payment_method"/>

  <div v-html="wp_nonce_field"></div>
<<<<<<< HEAD
  <input type="hidden" name="_vue_order_data"  v-model="data" value="">
  <input type="hidden" name="_vue_order_total_price" v-model="subtotal"  value="">

  <!-- Сюда нужно поместить HTML перед сабмитом формы. Создал sendData() она должна заполнить модель  send_data.
      Наверное хорошо передать каждое поле отдельно.
      <input type="hidden" name="_vue_order_industry"  >
      <input type="hidden" name="_vue_order_ typecleaning"  >
       ....

    В отдельном input. Но у тебя смешана логика и отображение.
    {{ $moment(data.date.month + data.date.day + data.date.year, 'MMDDYYYY').format('MMMM DD, YYYY') }}
    а input как прочитал работает через  v-model  -->
    <input type="hidden" name="_vue_order_send_data" v-model="send_data"  >
 <!--// Сюда -->


    <div class="footer">
=======
     <div class="footer">
>>>>>>> 05bd03cb8eb8d1ca9ac8107e748c54b7676c3a25
      <p>Your personal data will be used to process your order,
        support your experience throughout this website, and
        for other purposes described in our privacy policy.</p>
      <label class="checkbox-holder">
        <span class="checkbox">
          <input type="checkbox">
          <span></span>
        </span>
        I AGREE TO THE WEBSITE TERMS AND CONDITIONS
      </label>
      <div class="buttons-holder">
        <div class="button" @click="cardPay = !cardPay,payment_method = 'authnet'" :class="{active: cardPay}">Pay with Card</div>
<<<<<<< HEAD
        <div class="button" @click="payment_method = 'paypal'" :class="{active: cardPay}">PayPal</div>

        <!-- 'cod' - шлюз оплата при получении. Просто создаст ордер как я понял зчем эта кнопка -->
         <div class="button" @click="payment_method = 'cod'">Submit Request</div>
         <!--//-->
=======
       <button class="button active" type="submit" @click="payment_method = 'paypal'">PayPal</button>
       <button class="button active" type="submit" @click="payment_method = 'cod'">Submit Request</button>

>>>>>>> 05bd03cb8eb8d1ca9ac8107e748c54b7676c3a25
       </div>
      <div class="creditCard" v-show="cardPay">
        <div class="close" @click="cardPay = false"></div>
        <div class="item">
          <div class="button active">Credit cart</div>
          <img src="~@/assets/img/cardType.png" alt="" />
        </div>
        <div class="item">
          <input type="text" class="button cardNumber" placeholder="Card number" name="authnet-card-number">
        </div>
        <div class="item">
          <input type="text" class="button" placeholder="MM/YY" name="authnet-card-expiry">
          <input type="text" class="button" placeholder="CVC" name="authnet-card-cvc">
        </div>
        <button class="button active " name="woocommerce_checkout_place_order" type="submit" @click="payment_method = 'authnet'">Place order</button>


      </div>
    </div>
  </form>
  </div>
</template>

<script>
import AnimatedNumber from "animated-number-vue";
import {mask} from 'vue-the-mask'

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

    }
  },
  computed: {
    wp_nonce_field(){

      if ( typeof global_wp_nonce_field  !== 'undefined'){
         return global_wp_nonce_field;
      }else {
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
      let bedroomSelected = this.data.selected.bedroom
      let bathroomSelected = this.data.selected.bathroom
      let bedroomPrice = +this.data.selected.typecleaning.dependencies.bedroom * (this.selects.bedroom ? (this.selects.bedroom.map(item => item.text).indexOf(bedroomSelected.text) + 1) : 1)
      let bathroomPrice = +this.data.selected.typecleaning.dependencies.bathroom * (this.selects.bathroom ? (this.selects.bathroom.map(item => item.text).indexOf(bathroomSelected.text) + 1) : 1)
      return (+this.data.selected.typecleaning.price + this.addonsPrice - timeSale + bedroomPrice + bathroomPrice ) * frequentSale;
    },
    addonsPrice() {
      return this.data.addons.length > 0 ? this.data.addons.map(addon => +addon.price).reduce((a, b) => a + b) : 0
    },
    clean() {
      let bedroomSelected = this.data.selected.bedroom
      let bathroomSelected = this.data.selected.bathroom
      let bedroomPrice = +this.data.selected.typecleaning.dependencies.bedroom * (this.selects.bedroom ? (this.selects.bedroom.map(item => item.text).indexOf(bedroomSelected.text) + 1) : 1)
      let bathroomPrice = +this.data.selected.typecleaning.dependencies.bathroom * (this.selects.bathroom ? (this.selects.bathroom.map(item => item.text).indexOf(bathroomSelected.text) + 1) : 1)
      return (+this.data.selected.typecleaning.price + bedroomPrice + bathroomPrice );
    },
  },
  methods: {
    formatToPrice(value) {
      return value < 0 ? '-$' + value.toFixed(0) * -1 : '$' + value.toFixed(0);
    },
    sendData(){

         let el = document.getElementById('id_receipt');
         console.log ( el.innerHTML);
         return el.innerHTML;

    }
  },
  beforeCreate() {
    console.log(this.$store.state.dataToSend);
    console.log(this.$parent.atest);
    console.log(global_wp_nonce_field);
     this.data.wp_nonce_field = global_wp_nonce_field;
  },
}
function Nikita() {

}
</script>

<style lang="scss">
  #checkout {
    flex-direction: column;
    padding: $a55 $a460 !important;
    height: calc(100vh - #{$a87});
    h2 {
      margin-bottom: $a35;
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
    .form-info {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: $a45;
      .left {
        width: $a515;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: auto;
        .subtitle {
          margin-top: $a10;
          margin-bottom: $a20;
          opacity: .3;
          font-size: $a15;
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
        }
      }
      .creditCard {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: $a25;
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
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: $a30;
          width: $a410;
          img {
            width: $a180;
          }
          input {
            padding: 0 $a25;
            width: calc(50% - #{$a20});
          }
          .button.active {
            width: $a200;
            margin-right: $a35;
          }
          .cardNumber {
            width: $a410;
          }
        }
        .button.active {
          padding: 0 $a35;
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
          .item {
            padding: 0 $m25;
            margin-bottom: $m10;
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
                width: $m6;
                height: $m6;
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
          padding: $m20;
          background: transparentize($color, .5);
          justify-content: center;
          .close {

          }
          &:before {
            width: 95%;
            height: $m300;
            background: #ffffff;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            z-index: -1;
            border-radius: $m16;
          }
          .item {
            width: 100%;
            flex-flow: row wrap;
            margin-bottom: 0;
            &:nth-of-type(2) {
              display: none;
            }
            input {
              width: 100% !important;
              margin-bottom: $m10;
              padding: 0 $m25;
            }
          }
          .button.active {
            width: 100%;
            margin-top: $m10;
          }
          .close {
            display: block;
            position: absolute;
            top: 0;
            bottom: $m290;
            width: $m25;
            height: $m25;
            background: linear-gradient(0deg, $color, $color) no-repeat center center / 2px 70%, linear-gradient(0deg, $color, $color) no-repeat center center / 70% 2px, #fff;
            border-radius: 50%;
            transform: rotate(45deg);
            margin: auto;
            right: 1%;
            box-shadow: 0 0 $m3 0 rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }
</style>
