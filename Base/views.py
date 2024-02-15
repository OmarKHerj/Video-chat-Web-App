from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random
import time
import json
from .models import RoomUser

# Create your views here.

def Token(request):
    appId = "ffef3e69dad74d0da7499039ae4c9388"
    appCertificate = "2e9bc21d31f541f2a952cf999a7ffb5f"
    channelName = request.GET.get("channel")
    uid = random.randint(1,230)
    expirationTime= 3600 * 24
    currentTime = time.time()
    role = 1
    privilegeExpiredTs = currentTime + expirationTime
   
    token=RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)

    return JsonResponse({'token': token , 'uid':uid})

def home(request):
    return render(request, 'Base/home.html')

def room(request):
    return render(request, 'Base/room.html')

@csrf_exempt
def CreateUser(request):
    data= json.loads(request.body)

    member, created = RoomUser.objects.get_or_create(
        name=data['name'],
        uid=data['uid'],
        room_name=data['room']

    )
    return JsonResponse({'name': data['name']}, safe=False)


def GetUsers(request):
    uid= request.GET.get('uid')
    room_name= request.GET.get("room_name")

    users = RoomUser.objects.get(
        uid=uid,
        room_name=room_name
    )
    name= users.name
    return JsonResponse({'name': users.name}, safe=False)


@csrf_exempt
def DeleteUser(request):
    data= json.loads(request.body)

    member = RoomUser.objects.get(
        name=data['name'],
        uid=data['uid'],
        room_name=data['room']

    )
    member.delete()
    return JsonResponse('member deleted', safe=False)
