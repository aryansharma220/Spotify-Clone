async function main() {
    const playImage = 'Assets/img/play.svg';
    const pauseImage = 'Assets/img/pause.svg';
    const plays = document.getElementsByClassName("play");
    const cards = document.getElementsByClassName("card");

    // Add event listeners to cards for hover effect
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("mouseover", () => {
            plays[i].classList.add("animatePlay");
        });
        cards[i].addEventListener("mouseout", () => {
            plays[i].classList.remove("animatePlay");
        });
    }

    const show = document.getElementsByClassName("show")[0];
    const playlist = document.getElementsByClassName("cardContainer")[0];

    // Toggle playlist visibility
    const showAll = () => {
        if (playlist.style.height === "70vh") {
            playlist.style.height = "40vh";
            playlist.style.overflowY = "hidden";
            show.innerHTML = "Show All";
        } else {
            playlist.style.height = "70vh";
            playlist.style.overflowY = "scroll";
            show.innerHTML = "Hide";
        }
    };

    show.addEventListener("click", showAll);

    // Fetch songs from the server
    let songs = await getSongs();

    // Render song list
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        let display = song.split("/songs/")[1].replaceAll("-", "  ").replaceAll("%20", " ").replace(/\s+\d+/g, '').replace(/\.mp3$/, '');
        songUL.innerHTML += `<li data-song="${song}"> <!-- Store song filename in data attribute -->
                                <img class="invert" src="Assets/img/music.svg" alt="">
                                <div class="info" data-song=${song}>${display}</div>
                                <img class="playbackground playLib" src='Assets/img/play.svg' alt="">
                            </li>`;
    }

    // Play the selected song
    const playMusic = (track,item) => {
        let audio = new Audio(track); // Adjust the URL construction
        audio.play()
        // let currSrc = item.getAttribute('src');
        // if (currSrc == playImage) {
        //     item.setAttribute('src', pauseImage);
        //     audio.play();
        // } else {
        //     item.setAttribute('src', playImage);
        //     audio.pause();
        // }
    };
    

    // Add click event listener to each song list item
    const songListItems = document.querySelectorAll(".songlist ul li");
    songListItems.forEach((li) => {
        li.addEventListener("click", (event) => {
            const item = event.currentTarget
            const track = event.currentTarget.getAttribute("data-song");
            console.log(track) // Get song filename from data attribute
            playMusic(track,item);
        });
    });

    // Initialize audio player
    let currentIndex = 0;
    let audio = new Audio(songs[currentIndex]);

    // Define play/pause functionality
    const playPauseSong = (playButton) => {
        let currSrc = playButton.getAttribute('src');
        if (currSrc == playImage) {
            playButton.setAttribute('src', pauseImage);
            audio.play();
        } else {
            playButton.setAttribute('src', playImage);
            audio.pause();
        }
    };

    // Add event listeners to play buttons
    const playLibs = document.getElementsByClassName("playLib");
    for (let i = 0; i < playLibs.length; i++) {
        playLibs[i].addEventListener("click", () => playPauseSong(playLibs[i]));
    }

    // Add event listener to main play button
    const playButton = document.getElementById("playButton");
    playButton.addEventListener("click", () => playPauseSong(playButton));

    // Add event listeners to play buttons in cards
    for (let i = 0; i < plays.length; i++) {
        plays[i].addEventListener("click", () => {
            audio.play();
            playButton.setAttribute('src', pauseImage);
            audio.play();
        });
    }

    // Add event listener to next button
    const nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", () => {
        audio.pause();
        currentIndex = (currentIndex + 1) % songs.length;
        audio.src = songs[currentIndex];
        audio.play();
        playButton.setAttribute('src', pauseImage);
    });

    // Add event listener to previous button
    const prevButton = document.getElementById("prevButton");
    prevButton.addEventListener("click", () => {
        audio.pause();
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
        audio.src = songs[currentIndex];
        audio.play();
        playButton.setAttribute('src', pauseImage);
    });
}

// Function to fetch songs from the server
async function getSongs() {
    try {
        const response = await fetch("http://127.0.0.1:3000/Spotify%20Clone/Assets/songs/");
        const text = await response.text();
        const div = document.createElement("div");
        div.innerHTML = text;
        const songs = Array.from(div.getElementsByTagName("a"))
            .filter(element => element.href.endsWith(".mp3"))
            .map(element => element.href);
        return songs;
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}

// Call main function to start the application
main();

