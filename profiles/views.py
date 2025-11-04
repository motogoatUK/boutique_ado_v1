from django.shortcuts import render


def profile(request):
    """ Didplsy the user's profile. """
    template = 'profiles/profile.html'
    context = {}

    return render(request, template, context)
