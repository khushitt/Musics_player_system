
// ==========================================
// MUSIC DATA
// ==========================================

const songs = [
    {
        title: "Song One",
        artist: "Artist One",
        file: "songs/song1.mp3"
    },

    {
        title: "Song Two",
        artist: "Artist Two",
        file: "songs/song2.mp3"
    },

    {
        title: "Song Three",
        artist: "Artist Three",
        file: "songs/song3.mp3"
    },

    {
        title: "Song Four",
        artist: "Artist Four",
        file: "songs/song4.mp3"
    },

    {
        title: "Song Five",
        artist: "Artist Five",
        file: "songs/song5.mp3"
    }
];


// ==========================================
// DOUBLY LINKED LIST
// ==========================================

class SongNode {

    constructor(song) {

        this.song = song;

        this.prev = null;

        this.next = null;
    }
}


class MusicLinkedList {

    constructor() {

        this.head = null;

        this.tail = null;

        this.current = null;
    }


    // Add song to linked list
    addSong(song) {

        const newNode = new SongNode(song);


        // If playlist is empty
        if (this.head === null) {

            this.head = newNode;

            this.tail = newNode;

            this.current = newNode;

        }

        // Add at the end
        else {

            this.tail.next = newNode;

            newNode.prev = this.tail;

            this.tail = newNode;
        }
    }


    // Move to next song
    next() {

        if (this.current && this.current.next) {

            this.current = this.current.next;

            return this.current;
        }

        return null;
    }


    // Move to previous song
    previous() {

        if (this.current && this.current.prev) {

            this.current = this.current.prev;

            return this.current;
        }

        return null;
    }


    // Select song using index
    setCurrent(index) {

        let temp = this.head;

        let count = 0;


        while (temp !== null) {

            if (count === index) {

                this.current = temp;

                return temp;
            }

            temp = temp.next;

            count++;
        }

        return null;
    }
}



// ==========================================
// STACK
// Recently Played Songs
// ==========================================

class Stack {

    constructor() {

        this.items = [];
    }


    // Push song into stack
    push(song) {

        this.items.push(song);
    }


    // Remove last song
    pop() {

        return this.items.pop();
    }


    // Get all history
    getItems() {

        return this.items;
    }
}



// ==========================================
// QUEUE
// Upcoming Songs
// ==========================================

class Queue {

    constructor() {

        this.items = [];
    }


    // Add song
    enqueue(song) {

        this.items.push(song);
    }


    // Remove first song
    dequeue() {

        return this.items.shift();
    }


    // Get queue
    getItems() {

        return this.items;
    }
}



// ==========================================
// CREATE DATA STRUCTURES
// ==========================================

const playlist = new MusicLinkedList();

const history = new Stack();

const upcoming = new Queue();


// Add all songs to linked list

songs.forEach(function(song) {

    playlist.addSong(song);

});



// ==========================================
// GET HTML ELEMENTS
// ==========================================

const audio =
    document.getElementById("audio");

const songTitle =
    document.getElementById("song-title");

const artist =
    document.getElementById("artist");

const playButton =
    document.getElementById("play-button");

const progress =
    document.getElementById("progress");

const currentTime =
    document.getElementById("current-time");

const duration =
    document.getElementById("duration");

const volume =
    document.getElementById("volume");

const songList =
    document.getElementById("song-list");

const historyList =
    document.getElementById("history-list");



// ==========================================
// PLAYER VARIABLES
// ==========================================

let isPlaying = false;

let repeat = false;

let shuffle = false;



// ==========================================
// DISPLAY PLAYLIST
// ==========================================

function displayPlaylist() {

    songList.innerHTML = "";


    let temp = playlist.head;

    let index = 0;


    // Traverse linked list

    while (temp !== null) {


        const div =
            document.createElement("div");


        div.className = "song";


        div.innerHTML = `

            <div class="song-info">

                <span class="song-number">
                    ${index + 1}
                </span>

                <span>

                    <strong>
                        ${temp.song.title}
                    </strong>

                    <br>

                    <small>
                        ${temp.song.artist}
                    </small>

                </span>

            </div>

            <span>▶</span>

        `;


        // Play selected song

        const selectedIndex = index;


        div.onclick = function() {

            playlist.setCurrent(selectedIndex);

            loadSong();

            playSong();
        };


        songList.appendChild(div);


        temp = temp.next;

        index++;
    }


    updateActiveSong();
}



// ==========================================
// LOAD SONG
// ==========================================

function loadSong() {

    if (playlist.current === null) {

        return;
    }


    const song =
        playlist.current.song;


    songTitle.textContent =
        song.title;


    artist.textContent =
        song.artist;


    audio.src =
        song.file;


    updateActiveSong();
}



// ==========================================
// PLAY SONG
// ==========================================

function playSong() {

    if (playlist.current === null) {

        return;
    }


    audio.play()
        .then(function() {

            isPlaying = true;

            playButton.textContent = "⏸";

        })
        .catch(function(error) {

            console.log(
                "Audio could not be played:",
                error
            );

        });


    addToHistory(
        playlist.current.song
    );
}



// ==========================================
// PLAY / PAUSE
// ==========================================

function playPause() {


    if (isPlaying) {

        audio.pause();

        isPlaying = false;

        playButton.textContent = "▶";

    }

    else {

        playSong();
    }
}



// ==========================================
// NEXT SONG
// ==========================================

function nextSong() {

    if (playlist.current === null) {

        return;
    }


    // Add current song to stack

    history.push(
        playlist.current.song
    );


    let nextNode = null;


    // SHUFFLE

    if (shuffle) {

        const randomIndex =
            Math.floor(
                Math.random() * songs.length
            );


        nextNode =
            playlist.setCurrent(
                randomIndex
            );
    }


    // NORMAL NEXT

    else {

        nextNode =
            playlist.next();
    }


    // REPEAT

    if (nextNode === null && repeat) {

        playlist.current =
            playlist.head;

        nextNode =
            playlist.current;
    }


    // Play next song

    if (nextNode !== null) {

        loadSong();

        playSong();
    }

    else {

        audio.pause();

        isPlaying = false;

        playButton.textContent = "▶";
    }
}



// ==========================================
// PREVIOUS SONG
// ==========================================

function previousSong() {

    const previousNode =
        playlist.previous();


    if (previousNode !== null) {

        loadSong();

        playSong();
    }

    else {

        // Restart first song

        audio.currentTime = 0;

        playSong();
    }
}



// ==========================================
// REPLAY CURRENT SONG
// ==========================================

function replaySong() {

    if (playlist.current === null) {

        return;
    }


    audio.currentTime = 0;

    playSong();
}



// ==========================================
// SHUFFLE
// ==========================================

function toggleShuffle() {

    shuffle = !shuffle;


    if (shuffle) {

        alert("🔀 Shuffle ON");

    }

    else {

        alert("🔀 Shuffle OFF");
    }
}



// ==========================================
// REPEAT
// ==========================================

function toggleRepeat() {

    repeat = !repeat;


    const button =
        document.getElementById(
            "repeat-button"
        );


    if (repeat) {

        button.textContent =
            "🔁 Repeat: ON";
    }

    else {

        button.textContent =
            "🔁 Repeat: OFF";
    }
}



// ==========================================
// VOLUME
// ==========================================

volume.addEventListener(
    "input",
    function() {

        audio.volume =
            volume.value;

    }
);



// ==========================================
// PROGRESS BAR
// ==========================================

audio.addEventListener(
    "timeupdate",
    function() {

        if (!audio.duration) {

            return;
        }


        const percentage =
            (audio.currentTime /
             audio.duration) * 100;


        progress.value =
            percentage;


        currentTime.textContent =
            formatTime(
                audio.currentTime
            );

    }
);



// ==========================================
// AUDIO DURATION
// ==========================================

audio.addEventListener(
    "loadedmetadata",
    function() {

        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);



// ==========================================
// CHANGE SONG POSITION
// ==========================================

progress.addEventListener(
    "input",
    function() {

        if (!audio.duration) {

            return;
        }


        audio.currentTime =
            (progress.value / 100)
            * audio.duration;

    }
);



// ==========================================
// WHEN SONG ENDS
// ==========================================

audio.addEventListener(
    "ended",
    function() {

        if (repeat) {

            audio.currentTime = 0;

            playSong();
        }

        else {

            nextSong();
        }

    }
);



// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(seconds) {

    if (isNaN(seconds)) {

        return "0:00";
    }


    const minutes =
        Math.floor(seconds / 60);


    const secs =
        Math.floor(seconds % 60);


    return minutes +
        ":" +
        (secs < 10 ? "0" : "") +
        secs;
}



// ==========================================
// ADD SONG TO HISTORY
// ==========================================

function addToHistory(song) {

    history.push(song);

    displayHistory();
}

