const APP_ID = "ffef3e69dad74d0da7499039ae4c9388";
const CHANNEL_NAME = sessionStorage.getItem("room");
const TOKEN =sessionStorage.getItem("token");
let uid = Number(sessionStorage.getItem("uid"))
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let localTracks = [];
let remoteUsers = {};
let NAME = sessionStorage.getItem("name");

let joinAndDisplayLocalStream = async () => {

    document.getElementById("room-name").innerText = CHANNEL_NAME
    client.on('user-published', handlejoinedusers)
    client.on('user-unpublished', handleleavingusers)

    try{
    await client.join(APP_ID, CHANNEL_NAME, TOKEN, uid);
    }catch(error){
        console.error(error);
        window.open('/', '_self');

    }
   

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    let member = await createMember()

    let player = `  <div class="video-container" id="user-container-1">

    <div id="username-wrap"><span id="username">${member.name} </span></div>
    <div class="video-player" id="user-${uid}"></div>

    </div>
`
document.getElementById("video-stream").insertAdjacentHTML("beforeend", player);

localTracks[1].play(`user-${uid}`);

await client.publish([localTracks[0], localTracks[1]]);


}

let handlejoinedusers = async (user, mediaType) =>{
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)
    if (mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null){
            player.remove()
        }

        let member= await getMember(user)

         player = `  <div class="video-container" id="user-container-${user.uid}">

        <div id="username-wrap"><span id="username">${member.name} </span></div>
        <div class="video-player" id="user-${user.uid}"></div>
    
        </div>
         `
        document.getElementById("video-stream").insertAdjacentHTML("beforeend", player);
        user.videoTrack.play(`user-${user.uid}`)
    }

    if(mediaType ==='audio'){
        user.audioTrack.play()
    }

}

let handleleavingusers= async(user) =>{
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let LeaveAndRemoveStream = async() =>{
    for (let i = 0; localTracks.length > i; i++){
        localTracks[i].stop();
        localTracks[i].close();
    }
    await client.leave()

    deleteMember()

    window.open('/', '_self')
}

let Camera = async(el) =>{
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        el.target.style.backgroundColor = '#fff'

    } else{
        await localTracks[1].setMuted(true)
        el.target.style.backgroundColor = 'grey'
    }

}

let Microphone = async(el) =>{
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        el.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[0].setMuted(true)
        el.target.style.backgroundColor = 'grey'
    }
}

let createMember = async()=>{
    let response = await fetch('/createuser/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': NAME,
            'room': CHANNEL_NAME,
            'uid':uid
        })
    })

    let member = await response.json()
    return member


}
let getMember = async(user)=>{
    let response = await fetch(`/getuser/?room_name=${CHANNEL_NAME}&uid=${user.uid}`)
    let member = await response.json()
    return member
}


let deleteMember = async()=>{
    let response = await fetch('/deleteuser/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': NAME,
            'room': CHANNEL_NAME,
            'uid':uid
        })
    })

    let member = await response.json()


}




joinAndDisplayLocalStream();

window.addEventListener("beforeunload", deleteMember)

document.getElementById("exit-btn").addEventListener('click', LeaveAndRemoveStream)
document.getElementById("video-btn").addEventListener('click', Camera)
document.getElementById("mic-btn").addEventListener('click', Microphone)