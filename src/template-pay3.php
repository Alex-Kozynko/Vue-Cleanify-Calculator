<?php
/**
 * Template Name:  Checkout custom 3
 *
 *
 * @package WordPress
 * @subpackage Twenty_Twenty
 * @since Twenty Twenty 1.0
 */

get_header();
?>

<script id="wc-checkout-js-extra">
var wc_checkout_params = {"ajax_url":"\/wp-admin\/admin-ajax.php","wc_ajax_url":"\/?wc-ajax=%%endpoint%%","update_order_review_nonce":"","apply_coupon_nonce":"","remove_coupon_nonce":"","option_guest_checkout":"yes","checkout_url":"\/?wc-ajax=checkout","is_checkout":"1","debug_mode":"1","i18n_checkout_error":"\u041e\u0448\u0438\u0431\u043a\u0430 \u0432 \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u0435 \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u044f \u0437\u0430\u043a\u0430\u0437\u0430. \u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437."};
</script>



<script src="https://unpkg.com/vue"></script>
<script src="/cleanify/cleanify.umd.js"></script>

<link rel="stylesheet" href="/cleanify/cleanify.css">


<div id="app">
  <demo></demo>
</div>

<script>

var global_wp_nonce_field='<?php wp_nonce_field( 'woocommerce-process_checkout', 'woocommerce-process-checkout-nonce' ); ?>'

new Vue({
  components: {
    demo: cleanify
  }
}).$mount('#app')
</script>



<script src="/wp-content/plugins/woocommerce/assets/js/frontend/checkout.js"></script>
<?php get_footer(); ?>
