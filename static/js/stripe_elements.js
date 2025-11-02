const stripePublicKey = $('#id_stripe_public_key').text().slice(1, -1);
const clientSecret = $('#id_client_secret').text().slice(1, -1);
const stripe = Stripe(stripePublicKey);
let elements = stripe.elements();
var style = {
    base: {
        color: '#000',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#dc3545',
        iconColor: '#dc3545'
    }
};
let card = elements.create('card', {style: style});
card.mount('#card-element');

// Handle realtime validation errors on the card element
card.addEventListener('change', function (event) {
    const errorDiv =  document.getElementById('card-errors');
    if (event.error) {
        let html = `
        <span class="icon" role="alert">
            <i class="fas fa-times"></i>
        </span>
        <span>${event.error.message}</span>
        `;
        $(errorDiv).html(html);
    } else {
        errorDiv.textContent = '';
    }
});

// Handle form submit

const form = document.getElementById('payment-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  card.update({ 'disabled': true});
  $('submit-button').attr('disabled', true);
  $('#payment-form').fadeToggle(100);
  $('#loading-overlay').fadeToggle(100);
  stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
        }
    }).then(function(result) {
//   const {error} = await stripe.confirmCardPayment({
//     //`Elements` instance that was used to create the Payment Element
//     card,
//     elements,
//     confirmParams: {
//       return_url: 'https://example.com/order/123/complete',
//     },
//   });
        if (result.error) {
//   if (error) {
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Show error to your customer (for example, payment
    // details incomplete)
    const messageContainer = document.querySelector('#card-errors');
    //messageContainer.textContent = error.message;
    let html = `
        <span class="icon" role="alert">
            <i class="fas fa-times"></i>
        </span>
        <span>${result.error.message}</span>
        `;
        messageContainer.innerHTML = html;
        $('#payment-form').fadeToggle(100);
        $('#loading-overlay').fadeToggle(100);
        card.update({ 'disabled': false});
        $('submit-button').attr('disabled', false);
  } else {
    // Your customer will be redirected to your `return_url`. For some payment
    // methods like iDEAL, your customer will be redirected to an intermediate
    // site first to authorize the payment, then redirected to the `return_url`.
    if (result.paymentIntent.status === 'succeeded') {
    form.submit();
    }
  }
  });
});