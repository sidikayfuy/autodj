from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import login as auth_login, authenticate, logout
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from slugify import slugify


from .forms import NewUserForm
from .models import *


def home(request):
    return render(request, 'autodj/home.html', {})


def lk(request):
    return render(request, 'autodj/lk.html', {'scenaries': Scenaries.objects.filter(maker=request.user), 'triggers': Triggers.objects.filter(author=request.user), 'combo':ComboTrigger.objects.filter(parent__author=request.user)})


def tutorial(request):
    return render(request, 'autodj/tutorials.html', {})


def partners(request):
    return render(request, 'autodj/partners.html', {})


def login(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                auth_login(request, user)
                messages.info(request, f"You are now logged in as {username}.")
                return redirect("home")
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    form = AuthenticationForm()
    return render(request=request, template_name="autodj/login.html", context={"login_form": form})


def register(request):
    if request.method == "POST":
        form = NewUserForm(request.POST)
        if form.is_valid():
            user = form.save()
            auth_login(request, user)
            messages.success(request, "Registration successful.")
            return redirect("home")
        messages.error(request, "Unsuccessful registration. Invalid information.")
    form = NewUserForm
    return render(request=request, template_name="autodj/register.html", context={"register_form": form})


def site_logout(request):
    logout(request)
    messages.info(request, "You have successfully logged out.")
    return redirect("home")


def scenaries(request, pk):
    scen = Scenaries.objects.get(pk=int(pk))

    return render(request, 'autodj/scenaries.html', {'triggers':scen.triggers.all(), 'scenari': scen, 'combo':ComboTrigger.objects.filter(parent__author=request.user)})


def loadtrigger(request):
    user = request.user
    triggers = Triggers.objects.filter(author=user.pk)
    combo = ComboTrigger.objects.filter(parent__author__triggers=user.pk)
    data = {}
    comboo = {}

    for i in combo:
        parent = {}
        wordsp = {}
        for l in i.parent.words.all():
            wordsp[l.word] = l.word
        parent['parent'] = {
            'words': wordsp,
            'file': i.parent.file.first().title
        }
        child = {}
        for m in i.childrens.all():
            words = {}
            for z in m.words.all():
                words[z.word] = z.word
            child[i.pk] = {
                'words': words,
                'file': m.file.first().title
            }
        comboo[i.pk] = {
            'parent': parent,
            'child': child,
        }



    for i in triggers:
        words = {}
        for l in i.words.all():
            words[l.word] = l.word
        data[i.pk] = {
            'words': words,
            'file': i.file.first().title
        }
    return JsonResponse({'data': data, 'combo': comboo})


def loadscentrig(request):
    id = request.GET.get('id')
    trig = Scenaries.objects.get(pk=int(id)).triggers.all()
    data = {}

    for i in trig:
        words = {}
        for l in i.words.all():
            words[l.word] = l.word
        data[i.pk] = {
            'words': words,
            'file': i.file.first().title
        }
    return JsonResponse({'data': data})

# @csrf_exempt
# def send(request):
#     file = request.FILES.get('file')
#     fs = FileSystemStorage(location='media/audio/', base_url='/audio')
#     filename = fs.save(file.name+'.mp3', file)
#     r = sr.Recognizer()
#     file = sr.WavFile('media/audio/889.mp3')
#     with file as source:
#         audio = r.record(source)
#     text = r.recognize_google(audio, language='ru-RU')
#     print(text)
#     return HttpResponse('{"Status":"OK"}', status=200)


def addscen(request):
    if request.method == "POST":
        title = request.POST.get('title')
        triggers = str(request.POST.get('triggers')).replace("opt",'').replace(' ','').split(",")
        triggers.remove(triggers[-1])
        scen = Scenaries()
        scen.title = title
        scen.maker = request.user
        scen.save()
        for i in triggers:
            scen.triggers.add(Triggers.objects.get(pk=int(i)))

    return HttpResponse('{"Status":"OK"}', status=200)


def addtrigger(request):
    if request.method == "POST":
        file = request.FILES.get("file")
        print(file)
        audio = Audio.objects.create(title=file.name, file=file)
        wordsall = str(request.POST.get("words")).split(',')
        for i in wordsall:
            w = Words()
            w.word = i
            w.save()
        tom = Triggers.objects.create()
        for i in wordsall:
            tom.words.add(Words.objects.get(word=i))
        tom.file.add(Audio.objects.get(pk=audio.pk))
        tom.author = request.user
        tom.save()
    return JsonResponse({})


