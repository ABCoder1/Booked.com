from django.shortcuts import render,redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login

# Create your views here.
def MainPage(request):
    return render(request, 'Homepage/MainPage.html')

def Login(request):
    return render(request, 'registration/login.html')
    
def Register(request):
    if request.method == 'POST' :
        form = UserCreationForm(request.POST)

        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('index')
    else:
        form = UserCreationForm()
        context = {'form' : form}
        return render(request, 'registration/register.html', context)
