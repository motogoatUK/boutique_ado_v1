from django.shortcuts import render, redirect, reverse
from django.contrib import messages
from .forms import OrderForm


def checkout(request):
    bag = request.session.get('bag', {})
    if not bag:
        messages.error(request, "Your bag is empty!")
        return redirect(reverse('products'))

    order_form = OrderForm()
    template = 'checkout/checkout.html'
    context = {
        'order_form': order_form,
        'stripe_public_key': 'pk_test_51SO5rIPaSLx1qvfSfTJR4'
        'NRrTZRJ0WcNbBfpqHfLGAcs6S61TQCgs4y2G1xJuRcHLJdnklRTH'
        'ijentedUCrgWkel00Sv5kvgIt',
        'client_secret': 'test client secret',
    }

    return render(request, template, context)
