const toggleBtn=document.querySelector(".togg-btn");
const checked=document.getElementById("check");
const cont= document.querySelectorAll(".cont");
const imageCont=document.querySelector(".image");
const listSong=document.querySelectorAll(".song");
toggleBtn.addEventListener("click",()=>{
    console.log("hello");
   if(checked.checked === true){
    document.body.style.backgroundColor="#E8E7E6";
     cont.forEach( (contain) => {
        contain.style.backgroundColor="#6BB8DE";
        contain.style.color="#333";
        
     })
     listSong.forEach((list)=>{
        list.style.backgroundColor="#0B81BC";
        list.style.color="#fff";
     })
     imageCont.style.backgroundColor="#0472AA";
    
    
    // checked.value="unchecked";
   }else{
    document.body.style.backgroundColor = "#565657";
    imageCont.style.backgroundColor="#565657";
    cont.forEach( (contain) => {
        contain.style.backgroundColor="#263238";
        contain.style.color="#fff";
     })
     listSong.forEach((list)=>{
        list.style.backgroundColor="#1F1F1F";
        list.style.color="#000";
     })
    
   }
})

// Sample songs data
const songs = [
   { id: 1, name: "It's You", artist: "Ali Gate", genre: "Pop", image: "./Cover/d548ab1547c2d3415e08865f4ec49f7b.999x999x1.jpg", source: "./Songs/It's You.mp3" },
   { id: 2, name: "lovely", artist: "Billie Eillish", genre: "Pop", image: "./Cover/Billie_Eilish_and_Khalid_-_Lovely.png", source: "./Songs/Billie Eilish - lovely (with Khalid) Audio.mp3" },
   { id: 3, name: "We Don't Trust You", artist: "Future & Metro Boomin", genre: "Hip_Hop", image: "./Cover/artworks-f11ec3e9-efe3-4c51-a667-f49d4b5212b7-0-t500x500.jpg", source: "./Songs/Future, Metro Boomin - We Don't Trust You (Official Audio).mp3" },
   { id: 4, name: "Neighbours", artist: "J. Cole", genre: "Hip_Hop", image: "./Cover/artworks-J0XW9w89WTcq-0-t500x500.jpg", source: "./Songs/J. Cole - Neighbours (4 Your Eyez Only) (Audio).mp3" },
   { id: 5, name: "can't leave without it", artist: "21 Savage", genre: "Hip_Hop", image: "./Cover/maxresdefault.jpg", source: "./Songs/21 Savage - Can't Leave Without It (Official Audio).mp3" },
   { id: 6, name: "Wonderwall", artist: "Oasis", genre: "Rock", image: "./Cover/img-wonderwall_114238576960.png", source: "./Songs/Oasis - Wonderwall (Audio).mp3" }
];

// Function to add songs dynamically
const dropSong = document.querySelector("#dropdown");
const songCollection = document.querySelector("#songList");
dropSong.addEventListener("change", () => {
   const song = dropSong.value;
   if (song === "All") {
      renderList();
      selectingSongs("All");
      currentwindowplay();
   }
   if (song === "Rock") {
      console.log("Rock")
      renderList();
      selectingSongs("Rock");
      currentwindowplay();
   }
   if (song === "Hip_Hop") {
      console.log("Hip_Hop")
      renderList();
      selectingSongs("Hip_Hop");
      currentwindowplay();
   }
   if (song === "Pop") {
      console.log("Pop")
      renderList();
      selectingSongs("Pop");
      currentwindowplay();
   }
})

songs.forEach((song) => {

   const songname = document.createElement("option");
   songname.className = "song";
   songname.textContent = song.name;
   // songname.value = song.name;
   console.log(songname);
   songCollection.appendChild(songname);
});

function selectingSongs(genre) {
   if (genre === 'All') {
      songs.forEach((song) => {

         const songname = document.createElement("option");
         songname.className = "song";
         songname.textContent = song.name;
         // songname.value = song.name;
         console.log(songname);
         songCollection.appendChild(songname);
      })
   }
   else {
      songs.forEach((song) => {
         if (song.genre === genre) {
            const songname = document.createElement("option");
            songname.className = "song";

            songname.textContent = song.name;
            // songname.value = song.name;
            console.log(songname);
            songCollection.appendChild(songname);
         }

      })
   }
}
function renderList() {
   const songList = document.querySelectorAll("#songList .song");
   console.log(songList);
   songList.forEach((song) => {
      song.remove();
   })
}
function currentwindowplay() {
   const artistName = document.querySelector(".artist_name");
   const songName = document.querySelector(".song_name");
   const artistImage = document.querySelector(".artist_image");
   const songPlay = document.querySelector(".songPlay");
   const audioplay = document.getElementById("audios");
   const selectedSong = document.querySelectorAll("#songList .song");
   selectedSongs = [...selectedSong]
   console.log(selectedSongs);
   selectedSongs.forEach((song) => {
      song.addEventListener("click", (e) => {
         console.log(e.target);
         let name = e.target.textContent;
         console.log(name);
         songs.forEach((songObject) => {
            if (songObject.name === name) {
               artistName.textContent = songObject.artist;
               songName.textContent = name;
               artistImage.setAttribute("src", songObject.image);
               handlesongSelecction(songObject);
               // songPlay.setAttribute("src" , songObject.source);

               // songObject.play();
            }
         })
         //   console.log(e.source);

      })
   })
   function handlesongSelecction(sing) {
      songPlay.src = sing.source;
      audioplay.load();
      audioplay.play();


   }
}


currentwindowplay();

const leftBtn = document.querySelector(".prev");
console.log(leftBtn)
const rightBtn = document.querySelector(".next");
console.log(rightBtn)
currentIndex = 0;

const artistName = document.querySelector(".artist_name");
const songName = document.querySelector(".song_name");
const artistImage = document.querySelector(".artist_image");
const songPlay = document.querySelector(".songPlay");
const audioplay = document.getElementById("audios");


leftBtn.addEventListener("click", () => {
   console.log("left");
   if (currentIndex >= 1) {
      currentIndex--;
      songs.forEach((song) => {
         if (song.id === currentIndex) {
            songPlay.src = song.source;
            audioplay.load();
            audioplay.play();
            artistName.textContent = song.artist;
            songName.textContent = song.name;
            artistImage.setAttribute("src", song.image);

         }
      })
   }
});

rightBtn.addEventListener("click", () => {
   if (currentIndex < songs.length - 1) {
      console.log("right");
      currentIndex++;
      songs.forEach((song) => {
         if (song.id === currentIndex) {
            songPlay.src = song.source;
            audioplay.load();
            audioplay.play();
            artistName.textContent = song.artist;
            songName.textContent = song.name;
            artistImage.setAttribute("src", song.image);

         }
      })
   }
});

const inputField = document.querySelector(".enterPlayList");
const inputBtn = document.querySelector(".createPlaylist");
const allPlayList = document.querySelector(".All");

inputBtn.addEventListener("click", () => {
   if (inputField.value.length === 0) {
      return;
   }
   let playListname = inputField.value;
   console.log(playListname);
   const newPlaylist = document.createElement("li");
   console.log(newPlaylist)
   newPlaylist.className = "lists";
   console.log(newPlaylist)
   newPlaylist.textContent = playListname;
   console.log(newPlaylist)
   allPlayList.appendChild(newPlaylist);
   inputField.value = "";

})

const songArray = [];

const addPlayList = document.querySelector(".createPlaylist");
console.log(addPlayList)
addPlayList.addEventListener("click", () => {
   songs.forEach((song) => {
      song.addEventListener('click', (e) => {
         console.log(e.target);
         songArray.push(e.target);
      })
   })
})

function addToPlaylist() {
   const currentPlaylist = document.querySelector(".current.list");
   const songName = document.querySelector(".song_name").textContent;
   
   const newSongItem = document.createElement("li");
   newSongItem.textContent = songName;
   newSongItem.className = "lists";

   currentPlaylist.appendChild(newSongItem);
}

const addToPlaylistBtn = document.querySelector(".ply");
addToPlaylistBtn.addEventListener("click", addToPlaylist);
