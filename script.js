// Global error handler
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.message, 'at', event.filename, 'line', event.lineno);
});

// DOM Elements
const toggleBtn = document.querySelector(".togg-btn");
const checked = document.getElementById("check");
const body = document.body;
const songCollection = document.querySelector("#songList");
const dropSong = document.querySelector("#dropdown");
const artistName = document.querySelector(".artist_name");
const songName = document.querySelector(".song_name");
const artistImage = document.querySelector(".artist_image");
const songPlay = document.querySelector(".songPlay");
const audioplay = document.getElementById("audios");
const audioPlayerContainer = document.querySelector(".audio-player-container");
const leftBtn = document.querySelector(".prev");
const rightBtn = document.querySelector(".next");
const inputField = document.querySelector(".enterPlayList");
const inputBtn = document.querySelector(".createPlaylist");
const allPlayList = document.querySelector(".All");
const addToPlaylistBtn = document.querySelector(".ply");
const currentPlaylist = document.querySelector(".current.list");
const songBox = document.querySelector('.song_box');

// Video elements
const videoContainer = document.querySelector('.video_container');
const videoContainerWrapper = document.querySelector('.video-container-wrapper');
const songImgContainer = document.querySelector('.song_img');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = videoPlayer.querySelector('source');
const modeToggleBtn = document.querySelector('.mode-switch');
const audioModeElements = document.querySelectorAll('.audio-mode-element');
const videoModeElements = document.querySelectorAll('.video-mode-element');

// Custom control elements
const playPauseBtn = document.querySelector('.play-pause-btn');
const playPauseIcon = playPauseBtn.querySelector('i');
const progressContainer = document.querySelector('.progress-container');
const progressBar = document.querySelector('.progress-bar');

// Player state
let isVideoMode = false;
let currentIndex = 0;
let currentPlaybackTime = 0;
let isPlaying = false;
let userInitiatedPlayback = false; // Track if user has initiated playback
let currentViewMode = 'all'; // 'all' or 'playlist'
let currentPlaylistName = ''; // Currently active playlist
let currentPlaylistSongs = []; // Array to store currently active songs

// Playlist data structures
let playlists = {
    'mynewsong': ["It's You", "lovely"],
    'rock song': ["We Don't Trust You", "Wonderwall"],
    'favourite': ["It's You", "We Don't Trust You"]
};

// Load playlists from localStorage if available
function loadPlaylistsFromStorage() {
    const storedPlaylists = localStorage.getItem('musicPlayerPlaylists');
    if (storedPlaylists) {
        try {
            playlists = JSON.parse(storedPlaylists);
        } catch (e) {
            console.error('Error loading playlists from storage:', e);
        }
    }
}

// Save playlists to localStorage
function savePlaylistsToStorage() {
    try {
        localStorage.setItem('musicPlayerPlaylists', JSON.stringify(playlists));
    } catch (e) {
        console.error('Error saving playlists to storage:', e);
    }
}

// Prevent autoplay on load
audioplay.autoplay = false;
videoPlayer.autoplay = false;

// Dark/Light mode toggle
toggleBtn.addEventListener("click", () => {
    if (checked.checked) {
        body.style.backgroundColor = "#E8E7E6";
        document.querySelectorAll(".all_songs, .song_card, .playlist").forEach(element => {
            element.style.backgroundColor = "rgba(107, 184, 222, 0.7)";
        });
        document.querySelectorAll(".song, .lists, .empty-playlist").forEach(element => {
            element.style.backgroundColor = "rgba(11, 129, 188, 0.7)";
            element.style.color = "#fff";
        });
    } else {
        body.style.backgroundColor = "#1a252f";
        document.querySelectorAll(".all_songs, .song_card, .playlist").forEach(element => {
            element.style.backgroundColor = "rgba(38, 50, 56, 0.7)";
        });
        document.querySelectorAll(".song, .lists, .empty-playlist").forEach(element => {
            element.style.backgroundColor = "rgba(31, 31, 31, 0.7)";
            element.style.color = "#fff";
        });
    }
});

// Custom play/pause button functionality
playPauseBtn.addEventListener('click', () => {
    userInitiatedPlayback = true; // User has initiated playback
    
    const currentPlayer = isVideoMode ? videoPlayer : audioplay;
    
    if (isPlaying) {
        // Pause the current player
        currentPlayer.pause();
        playPauseIcon.className = 'fa-solid fa-play';
        isPlaying = false;
    } else {
        // Play the current player
        currentPlayer.play().catch(error => {
            console.log(`Error playing ${isVideoMode ? 'video' : 'audio'}:`, error);
        });
        playPauseIcon.className = 'fa-solid fa-pause';
        isPlaying = true;
    }
});

// Progress bar functionality
function updateProgressBar() {
    const currentPlayer = isVideoMode ? videoPlayer : audioplay;
    if (currentPlayer.duration) {
        const progressPercent = (currentPlayer.currentTime / currentPlayer.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
}

// Set progress when clicking on progress bar
progressContainer.addEventListener('click', (e) => {
    const currentPlayer = isVideoMode ? videoPlayer : audioplay;
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = currentPlayer.duration;
    
    currentPlayer.currentTime = (clickX / width) * duration;
    updateProgressBar();
});

// Update progress bar as media plays
audioplay.addEventListener('timeupdate', updateProgressBar);
videoPlayer.addEventListener('timeupdate', updateProgressBar);

// Listen for play/pause events to update UI
audioplay.addEventListener('play', () => {
    userInitiatedPlayback = true;
    // If audio starts playing, ensure video is paused
    if (videoPlayer && !videoPlayer.paused) {
        videoPlayer.pause();
    }
    isPlaying = true;
    playPauseIcon.className = 'fa-solid fa-pause';
});

audioplay.addEventListener('pause', () => {
    isPlaying = false;
    playPauseIcon.className = 'fa-solid fa-play';
});

videoPlayer.addEventListener('play', () => {
    userInitiatedPlayback = true;
    // If video starts playing, ensure audio is paused
    if (audioplay && !audioplay.paused) {
        audioplay.pause();
    }
    isPlaying = true;
    playPauseIcon.className = 'fa-solid fa-pause';
});

videoPlayer.addEventListener('pause', () => {
    isPlaying = false;
    playPauseIcon.className = 'fa-solid fa-play';
});

// Toggle between audio and video modes with clean conditional rendering
modeToggleBtn.addEventListener('click', () => {
    // Store current playback state
    isPlaying = isVideoMode ? !videoPlayer.paused : !audioplay.paused;
    
    // Store current playback time before switching
    currentPlaybackTime = isVideoMode ? videoPlayer.currentTime : audioplay.currentTime;
    
    // First, pause both players to ensure exclusive playback
    audioplay.pause();
    videoPlayer.pause();
    
    // Toggle mode
    isVideoMode = !isVideoMode;
    
    // Update UI based on mode
    renderPlayerMode();
    
    // Set playback time and play state after mode switch
    if (isVideoMode) {
        // Set video time to match previous time
        videoPlayer.currentTime = currentPlaybackTime;
        
        // Only play if user has initiated playback before
        if (isPlaying && userInitiatedPlayback) {
            videoPlayer.play().catch(error => {
                console.log('Error playing video:', error);
                playPauseIcon.className = 'fa-solid fa-play';
                isPlaying = false;
            });
        }
    } else {
        // Set audio time to match previous time
        audioplay.currentTime = currentPlaybackTime;
        
        // Only play if user has initiated playback before
        if (isPlaying && userInitiatedPlayback) {
            audioplay.play().catch(error => {
                console.log('Error playing audio:', error);
                playPauseIcon.className = 'fa-solid fa-play';
                isPlaying = false;
            });
        }
    }
    
    // Update progress bar after mode switch
    updateProgressBar();
});

// Function to render player based on current mode
function renderPlayerMode() {
    if (isVideoMode) {
        // Switch to video mode
        audioModeElements.forEach(el => el.style.display = 'none');
        videoModeElements.forEach(el => el.style.display = 'block');
        
        // Make sure video source is set correctly
        if (videoSource.getAttribute('src') !== songs[currentIndex].videoSource) {
            videoSource.setAttribute('src', songs[currentIndex].videoSource);
            videoPlayer.load();
        }
        
        modeToggleBtn.textContent = 'Switch to Audio';
    } else {
        // Switch to audio mode
        videoModeElements.forEach(el => el.style.display = 'none');
        audioModeElements.forEach(el => el.style.display = 'block');
        
        modeToggleBtn.textContent = 'Switch to Video';
    }
    
    // Update play/pause button to reflect current state
    playPauseIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
}

// Sample songs data with video sources
const songs = [
    { id: 1, name: "It's You", artist: "Ali Gate", genre: "Pop", image: "./Cover/d548ab1547c2d3415e08865f4ec49f7b.999x999x1.jpg", source: "./Songs/It's You.mp3", videoSource: "./Video/ItsYou.mp4" },
    { id: 2, name: "lovely", artist: "Billie Eilish & Khalid", genre: "Pop", image: "./Cover/Billie_Eilish_and_Khalid_-_Lovely.png", source: "./Songs/Billie Eilish - lovely (with Khalid) Audio.mp3", videoSource: "./Video/lovely.mp4" },
    { id: 3, name: "We Don't Trust You", artist: "Future & Metro Boomin", genre: "Hip_Hop", image: "./Cover/artworks-f11ec3e9-efe3-4c51-a667-f49d4b5212b7-0-t500x500.jpg", source: "./Songs/Future, Metro Boomin - We Don't Trust You (Official Audio).mp3", videoSource: "./Video/WeDontTrustYou.mp4" },
    { id: 4, name: "Neighbours", artist: "J. Cole", genre: "Hip_Hop", image: "./Cover/artworks-J0XW9w89WTcq-0-t500x500.jpg", source: "./Songs/J. Cole - Neighbours (4 Your Eyez Only) (Audio).mp3", videoSource: "./Video/Neighbours.mp4" },
    { id: 5, name: "Can't Leave Without It", artist: "21 Savage", genre: "Hip_Hop", image: "./Cover/maxresdefault.jpg", source: "./Songs/21 Savage - Can't Leave Without It (Official Audio).mp3", videoSource: "./Video/CantLeaveWithoutIt.mp4" },
    { id: 6, name: "Wonderwall", artist: "Oasis", genre: "Rock", image: "./Cover/img-wonderwall_114238576960.png", source: "./Songs/Oasis - Wonderwall (Audio).mp3", videoSource: "./Video/Wonderwall.mp4" }
];

// Initialize the player with the first song
function initializePlayer() {
    if (songs.length > 0) {
        // Set current playlist songs to all songs initially
        currentPlaylistSongs = [...songs];
        
        const firstSong = songs[0];
        songName.textContent = firstSong.name;
        artistName.textContent = firstSong.artist;
        artistImage.setAttribute("src", firstSong.image);
        songPlay.setAttribute("src", firstSong.source);
        videoSource.setAttribute("src", firstSong.videoSource);
        currentIndex = 0;
        
        // Explicitly prevent autoplay
        audioplay.autoplay = false;
        videoPlayer.autoplay = false;
        
        // Reset progress bar
        progressBar.style.width = '0%';
        
        console.log("Player initialized with all songs. Total songs:", currentPlaylistSongs.length);
    }
}

// Function to render all songs initially
function renderAllSongs() {
    songCollection.innerHTML = '';
    
    // Set current playlist songs to all songs
    currentPlaylistSongs = [...songs];
    
    songs.forEach(song => {
        const songElement = document.createElement("li");
        songElement.className = "song";
        songElement.textContent = song.name;
        songElement.dataset.id = song.id;
        songCollection.appendChild(songElement);
    });
    attachSongClickEvents();
    
    // Update view mode
    currentViewMode = 'all';
    currentPlaylistName = '';
    document.querySelector('.txt').textContent = 'All Songs';
    
    // Reset current index
    currentIndex = 0;
    
    console.log("Rendered all songs. Total songs:", currentPlaylistSongs.length);
}

// Function to filter songs by genre
function filterSongsByGenre(genre) {
    songCollection.innerHTML = '';
    const filteredSongs = genre === 'All' 
        ? songs 
        : songs.filter(song => song.genre === genre);
    
    // Update current playlist songs
    currentPlaylistSongs = [...filteredSongs];
    
    filteredSongs.forEach(song => {
        const songElement = document.createElement("li");
        songElement.className = "song";
        songElement.textContent = song.name;
        songElement.dataset.id = song.id;
        songCollection.appendChild(songElement);
    });
    attachSongClickEvents();
    
    // Update view mode
    currentViewMode = 'genre';
    currentPlaylistName = genre;
    document.querySelector('.txt').textContent = genre === 'All' ? 'All Songs' : `${genre} Songs`;
    
    // Reset current index
    currentIndex = 0;
    
    console.log(`Filtered songs by genre: ${genre}. Total songs:`, currentPlaylistSongs.length);
}

// Attach click events to songs
function attachSongClickEvents() {
    const songElements = document.querySelectorAll("#songList .song");
    songElements.forEach(songElement => {
        songElement.addEventListener("click", (e) => {
            const songId = parseInt(e.target.dataset.id) || findSongIdByName(e.target.textContent);
            if (songId) {
                console.log(`Song clicked: ${e.target.textContent} (ID: ${songId})`);
                playSongById(songId);
                userInitiatedPlayback = true; // User has initiated playback
                
                // Update current index to match the clicked song
                const songIndex = currentPlaylistSongs.findIndex(s => s.id === songId);
                if (songIndex !== -1) {
                    currentIndex = songIndex;
                    console.log(`Updated current index to ${currentIndex}`);
                }
            }
        });
    });
}

// Find song ID by name
function findSongIdByName(name) {
    const song = songs.find(s => s.name === name);
    return song ? song.id : null;
}

// Play song by ID - updated to handle video and use currentPlaylistSongs
function playSongById(id) {
    const song = songs.find(s => s.id === id);
    if (song) {
        // Reset playback time when changing songs
        currentPlaybackTime = 0;
        
        // Update song metadata
        songName.textContent = song.name;
        artistName.textContent = song.artist;
        artistImage.setAttribute("src", song.image);
        songPlay.setAttribute("src", song.source);
        videoSource.setAttribute("src", song.videoSource);
        
        // First, pause both players to ensure exclusive playback
        audioplay.pause();
        videoPlayer.pause();
        
        // Load media
        audioplay.load();
        videoPlayer.load();
        
        // Reset progress bar
        progressBar.style.width = '0%';
        
        // Play based on current mode
        if (isVideoMode) {
            videoPlayer.play().catch(error => {
                console.log('Error playing video:', error);
                playPauseIcon.className = 'fa-solid fa-play';
                isPlaying = false;
            });
        } else {
            audioplay.play().catch(error => {
                console.log('Error playing audio:', error);
                playPauseIcon.className = 'fa-solid fa-play';
                isPlaying = false;
            });
        }
        
        // Update current index based on the position in currentPlaylistSongs
        const songIndex = currentPlaylistSongs.findIndex(s => s.id === id);
        if (songIndex !== -1) {
            currentIndex = songIndex;
            console.log(`Now playing song at index ${currentIndex} in current playlist`);
        } else {
            // If song is not in current playlist, add it temporarily
            console.log(`Song ${id} not found in current playlist, playing anyway`);
        }
        
        isPlaying = true;
        playPauseIcon.className = 'fa-solid fa-pause';
    }
}

// Event listener for genre dropdown
dropSong.addEventListener("change", () => {
    const selectedGenre = dropSong.value;
    filterSongsByGenre(selectedGenre);
});

// Previous button event listener
leftBtn.addEventListener("click", () => {
    if (currentPlaylistSongs.length === 0) {
        console.log("No songs in current playlist");
        return;
    }
    
    if (currentIndex > 0) {
        currentIndex--;
        const prevSong = currentPlaylistSongs[currentIndex];
        console.log(`Playing previous song: ${prevSong.name} (ID: ${prevSong.id})`);
        playSongById(prevSong.id);
        userInitiatedPlayback = true; // User has initiated playback
    } else {
        console.log("Already at the first song in the playlist");
    }
});

// Next button event listener
rightBtn.addEventListener("click", () => {
    if (currentPlaylistSongs.length === 0) {
        console.log("No songs in current playlist");
        return;
    }
    
    if (currentIndex < currentPlaylistSongs.length - 1) {
        currentIndex++;
        const nextSong = currentPlaylistSongs[currentIndex];
        console.log(`Playing next song: ${nextSong.name} (ID: ${nextSong.id})`);
        playSongById(nextSong.id);
        userInitiatedPlayback = true; // User has initiated playback
    } else {
        console.log("Already at the last song in the playlist");
    }
});

// Create a new playlist
function createPlaylist(name) {
    if (!name || name.trim() === '') return false;
    
    name = name.trim();
    
    // Check if playlist already exists
    if (playlists[name]) {
        alert('A playlist with this name already exists!');
        return false;
    }
    
    // Create new playlist
    playlists[name] = [];
    savePlaylistsToStorage();
    
    // Add to UI
    renderPlaylist(name);
    return true;
}

// Render a playlist in the UI
function renderPlaylist(name) {
    const newPlaylist = document.createElement("li");
    newPlaylist.className = "lists";
    newPlaylist.textContent = name;
    newPlaylist.dataset.playlistName = name; // Add data attribute for easier selection
    
    // Add click event to switch to this playlist
    newPlaylist.addEventListener('click', function() {
        console.log(`Switching to playlist: ${name}`);
        switchToPlaylist(name);
    });
    
    allPlayList.appendChild(newPlaylist);
    
    // Log to confirm element was created and event attached
    console.log(`Playlist "${name}" rendered with click event`);
}

// Add song to playlist
function addSongToPlaylist(songTitle, playlistName) {
    if (!playlists[playlistName]) {
        playlists[playlistName] = [];
    }
    
    // Check if song already exists in playlist
    if (!playlists[playlistName].includes(songTitle)) {
        playlists[playlistName].push(songTitle);
        savePlaylistsToStorage();
        
        // If current playlist is being viewed, update the view
        if (currentViewMode === 'playlist' && currentPlaylistName === playlistName) {
            loadPlaylist(playlistName);
        }
        
        return true;
    }
    
    return false;
}

// Remove song from playlist
function removeSongFromPlaylist(songTitle, playlistName) {
    if (!playlists[playlistName]) return false;
    
    const index = playlists[playlistName].indexOf(songTitle);
    if (index !== -1) {
        playlists[playlistName].splice(index, 1);
        savePlaylistsToStorage();
        
        // If current playlist is being viewed, update the view
        if (currentViewMode === 'playlist' && currentPlaylistName === playlistName) {
            // Check if the removed song was currently playing
            const currentSongTitle = songName.textContent;
            const wasCurrentSong = (currentSongTitle === songTitle);
            
            // Reload the playlist
            loadPlaylist(playlistName);
            
            // If the removed song was playing, either play the next song or stop playback
            if (wasCurrentSong) {
                if (currentPlaylistSongs.length > 0) {
                    // Play the first song in the updated playlist
                    playSongById(currentPlaylistSongs[0].id);
                } else {
                    // No songs left, reset player
                    isPlaying = false;
                    playPauseIcon.className = 'fa-solid fa-play';
                }
            }
        }
        
        return true;
    }
    
    return false;
}

// Load and display songs from a playlist
function loadPlaylist(playlistName) {
    if (!playlists[playlistName]) return;
    
    songCollection.innerHTML = '';
    
    const playlistSongTitles = playlists[playlistName];
    
    // Filter songs that are in this playlist
    const playlistSongs = songs.filter(song => playlistSongTitles.includes(song.name));
    
    // Update current playlist songs
    currentPlaylistSongs = [...playlistSongs];
    
    // Handle empty playlist
    if (playlistSongs.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "empty-playlist";
        emptyMessage.textContent = "No songs in this playlist";
        songCollection.appendChild(emptyMessage);
        
        // Reset player display but don't change current song
        console.log("Playlist is empty");
    } else {
        // Render playlist songs
        playlistSongs.forEach(song => {
            const songElement = document.createElement("li");
            songElement.className = "song";
            songElement.textContent = song.name;
            songElement.dataset.id = song.id;
            
            // Add remove button
            const removeBtn = document.createElement("span");
            removeBtn.className = "remove-song";
            removeBtn.innerHTML = "×";
            removeBtn.title = "Remove from playlist";
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeSongFromPlaylist(song.name, playlistName);
            });
            
            songElement.appendChild(removeBtn);
            songCollection.appendChild(songElement);
        });
    }
    
    attachSongClickEvents();
    
    // Update view mode
    currentViewMode = 'playlist';
    currentPlaylistName = playlistName;
    document.querySelector('.txt').textContent = `Playlist: ${playlistName}`;
    
    // Reset current index
    currentIndex = 0;
    
    console.log(`Loaded playlist: ${playlistName}. Total songs:`, currentPlaylistSongs.length);
}

// Switch to viewing a specific playlist
function switchToPlaylist(playlistName) {
    console.log(`Switching to playlist: ${playlistName}`);
    
    if (!playlists[playlistName]) {
        console.error(`Playlist "${playlistName}" not found!`);
        return;
    }
    
    // Pause current playback before switching
    if (isPlaying) {
        const currentPlayer = isVideoMode ? videoPlayer : audioplay;
        currentPlayer.pause();
        isPlaying = false;
        playPauseIcon.className = 'fa-solid fa-play';
    }
    
    // Load the playlist
    loadPlaylist(playlistName);
    
    // If the playlist has songs, prepare the first song but don't play automatically
    if (currentPlaylistSongs.length > 0) {
        const firstSong = currentPlaylistSongs[0];
        songName.textContent = firstSong.name;
        artistName.textContent = firstSong.artist;
        artistImage.setAttribute("src", firstSong.image);
        songPlay.setAttribute("src", firstSong.source);
        videoSource.setAttribute("src", firstSong.videoSource);
        
        // Reset progress bar
        progressBar.style.width = '0%';
        
        // Load media but don't play
        audioplay.load();
        videoPlayer.load();
    }
    
    console.log(`Successfully switched to playlist: ${playlistName}`);
}

// Create playlist functionality
inputBtn.addEventListener("click", function() {
    console.log("Create Playlist button clicked");
    
    if (inputField.value.trim().length === 0) {
        console.log("Empty playlist name, not creating");
        return;
    }
    
    const playListName = inputField.value.trim();
    console.log(`Attempting to create playlist: ${playListName}`);
    
    if (createPlaylist(playListName)) {
        console.log(`Successfully created playlist: ${playListName}`);
        inputField.value = "";
    } else {
        console.log(`Failed to create playlist: ${playListName}`);
    }
});

// Add to playlist functionality
function showAddToPlaylistModal() {
    const currentSongName = songName.textContent;
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'playlist-modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'playlist-modal-content';
    
    // Create header
    const header = document.createElement('h3');
    header.textContent = `Add "${currentSongName}" to playlist:`;
    
    // Create playlist list
    const playlistList = document.createElement('ul');
    playlistList.className = 'playlist-select';
    
    // Add playlists to the list
    Object.keys(playlists).forEach(playlistName => {
        const item = document.createElement('li');
        item.textContent = playlistName;
        item.addEventListener('click', () => {
            addSongToPlaylist(currentSongName, playlistName);
            document.body.removeChild(modal);
            
            // Update current playlist view if needed
            if (currentPlaylistName === playlistName && currentViewMode === 'playlist') {
                loadPlaylist(playlistName);
            }
        });
        playlistList.appendChild(item);
    });
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-modal';
    closeBtn.textContent = 'Cancel';
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Assemble modal
    modalContent.appendChild(header);
    modalContent.appendChild(playlistList);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Add event listener to "Add to Playlist" button
addToPlaylistBtn.addEventListener("click", function() {
    console.log("Add to Playlist button clicked");
    showAddToPlaylistModal();
});

// Audio ended event - play next song
audioplay.addEventListener('ended', () => {
    if (currentPlaylistSongs.length === 0) {
        console.log("No songs in current playlist");
        return;
    }
    
    if (currentIndex < currentPlaylistSongs.length - 1) {
        currentIndex++;
        const nextSong = currentPlaylistSongs[currentIndex];
        console.log(`Auto-playing next song: ${nextSong.name} (ID: ${nextSong.id})`);
        playSongById(nextSong.id);
    } else {
        // If it's the last song, reset play button
        console.log("Reached end of playlist");
        isPlaying = false;
        playPauseIcon.className = 'fa-solid fa-play';
    }
});

// Video ended event - play next song
videoPlayer.addEventListener('ended', () => {
    if (currentPlaylistSongs.length === 0) {
        console.log("No songs in current playlist");
        return;
    }
    
    if (currentIndex < currentPlaylistSongs.length - 1) {
        currentIndex++;
        const nextSong = currentPlaylistSongs[currentIndex];
        console.log(`Auto-playing next song: ${nextSong.name} (ID: ${nextSong.id})`);
        playSongById(nextSong.id);
    } else {
        // If it's the last song, reset play button
        console.log("Reached end of playlist");
        isPlaying = false;
        playPauseIcon.className = 'fa-solid fa-play';
    }
});

// Initialize the application
function init() {
    console.log("Initializing application...");
    
    // Load playlists from storage
    loadPlaylistsFromStorage();
    console.log("Playlists loaded from storage:", Object.keys(playlists));
    
    // Set initial mode to audio
    isVideoMode = false;
    
    // Render initial player mode
    renderPlayerMode();
    
    // Render all songs
    renderAllSongs();
    
    // Initialize player
    initializePlayer();
    
    // Render playlists
    allPlayList.innerHTML = '';
    console.log("Rendering playlists:", Object.keys(playlists));
    Object.keys(playlists).forEach(playlistName => {
        renderPlaylist(playlistName);
    });
    
    // Make current playlist items clickable and add remove buttons
    const currentPlaylistItems = currentPlaylist.querySelectorAll('.lists');
    console.log(`Found ${currentPlaylistItems.length} items in current playlist`);
    
    currentPlaylistItems.forEach(item => {
        // Add click event to play the song
        item.addEventListener('click', () => {
            const songId = findSongIdByName(item.textContent);
            if (songId) {
                playSongById(songId);
                userInitiatedPlayback = true;
            }
        });
        
        // Add remove button
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-song';
        removeBtn.innerHTML = '×';
        removeBtn.title = 'Remove from current playlist';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            item.remove();
        });
        
        item.appendChild(removeBtn);
    });
    
    console.log("Application initialized successfully");
}

// Start the application
document.addEventListener('DOMContentLoaded', () => {
    init();
});
