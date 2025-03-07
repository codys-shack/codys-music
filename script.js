const greetingElement = document.getElementById('greeting');

function getGreeting() {
    const currentTime = new Date().getHours();
    let greeting;

    if (currentTime < 12) {
        greeting = 'Good morning';
    } else if (currentTime < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }

    greetingElement.textContent = greeting;
}

getGreeting();

const pageIds = ['home', 'queue', 'library', 'playlists'];

function showPage(pageId) {
  pageIds.forEach(id => {
    const page = document.getElementById(id);
    if (page) {
      page.style.display = (id === pageId) ? 'block' : 'none';
    }
  });

  // Update active link
  const links = document.querySelectorAll('#sidebar a');
  links.forEach(link => link.classList.remove('active'));
  const activeLink = document.querySelector(`#sidebar a[href="#${pageId}"]`);
  if (activeLink) activeLink.classList.add('active');
}

function handleHashChange() {
  const hash = window.location.hash.substring(1);
  showPage(hash || 'home');
}

handleHashChange();
window.addEventListener('hashchange', handleHashChange);


const fileInput = document.getElementById('fileInput');
        const uploadButton = document.getElementById('uploadButton');
        const libraryList = document.getElementById('libraryList');
        const playlistList = document.getElementById('playlistList');
        const queueList = document.getElementById('queueList');
        const audioPlayer = document.getElementById('audioPlayer');
        const newPlaylistName = document.getElementById('newPlaylistName');
        const createPlaylist = document.getElementById('createPlaylist');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const playlistMenu = document.getElementById('playlistMenu');
        const currentPlaylistName = document.getElementById('currentPlaylistName');
        const addSongsToPlaylist = document.getElementById('addSongsToPlaylist');
        const playPlaylistButton = document.getElementById('playPlaylistButton');
        const playlistAddList = document.getElementById('playlistAddList');
        const playlistSongsList = document.getElementById('playlistSongsList');
        const librarySongsBox = document.getElementById('librarySongsBox');
        const playPauseButton = document.getElementById('playPauseButton');
        const progressBar = document.getElementById('progressBar');

        let library = JSON.parse(localStorage.getItem('library')) || [];
        let playlists = JSON.parse(localStorage.getItem('playlists')) || {};
        let queue = JSON.parse(localStorage.getItem('queue')) || [];
        let currentTrackIndex = 0;
        let selectedPlaylist = null;

        function renderLibrary() {
            libraryList.innerHTML = '';
            library.forEach((song, index) => {
                const li = document.createElement('li');
                li.innerHTML = `${song.name}<div class="song-info">Artist: ${song.artist || 'Unknown'}, Album: ${song.album || 'Unknown'}</div>`;
                li.addEventListener('click', () => {
                    queue.push(song);
                    renderQueue();
                });
                libraryList.appendChild(li);
            });
        }

        function renderPlaylists() {
            playlistList.innerHTML = '';
            for (const playlistName in playlists) {
                const li = document.createElement('li');
                li.textContent = playlistName;
                li.addEventListener('click', () => {
                    selectedPlaylist = playlistName;
                    currentPlaylistName.textContent = playlistName;
                    playlistMenu.style.display = 'block';
                    renderPlaylistSongs();
                    librarySongsBox.style.display = 'none';
                });
                playlistList.appendChild(li);
            }
        }

        function renderQueue() {
            queueList.innerHTML = '';
            queue.forEach((song, index) => {
                const li = document.createElement('li');
                li.innerHTML = `${song.name}<div class="song-info">Artist: ${song.artist || 'Unknown'}, Album: ${song.album || 'Unknown'}</div>`;
                li.addEventListener('click', () => {
                    currentTrackIndex = index;
                    playQueue();
                });
                queueList.appendChild(li);
            });
        }

        function playQueue() {
            if (queue.length === 0) return;
            audioPlayer.src = queue[currentTrackIndex].url;
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
            renderQueue();
        }

        uploadButton.addEventListener('click', () => {
            const files = fileInput.files;
            for (const file of files) {
                const url = URL.createObjectURL(file);
                const song = { name: file.name, url: url };
                getMetadata(file).then(metadata => {
                    song.artist = metadata.artist;
                    song.album = metadata.album;
                    library.push(song);
                    localStorage.setItem('library', JSON.stringify(library));
                    renderLibrary();
                }).catch(() => {
                    library.push(song);
                    localStorage.setItem('library', JSON.stringify(library));
                    renderLibrary();
                });
            }
        });

        createPlaylist.addEventListener('click', () => {
            const playlistName = newPlaylistName.value;
            if (playlistName) {
                playlists[playlistName] = [];
                localStorage.setItem('playlists', JSON.stringify(playlists));
                renderPlaylists();
                newPlaylistName.value = '';
            }
        });

        addSongsToPlaylist.addEventListener('click', () => {
            librarySongsBox.style.display = librarySongsBox.style.display === 'block' ? 'none' : 'block';
            renderPlaylistAddList();
        });

        playPlaylistButton.addEventListener('click', () => {
            queue = [...playlists[selectedPlaylist]];
            currentTrackIndex = 0;
            playQueue();
            playlistMenu.style.display = 'none';
        });

        function renderPlaylistSongs() {
            playlistSongsList.innerHTML = '';
            playlists[selectedPlaylist].forEach((song, index) => {
                const li = document.createElement('li');
                li.innerHTML = `${song.name}<div class="song-info">Artist: ${song.artist || 'Unknown'}, Album: ${song.album || 'Unknown'}</div>`;
                li.addEventListener('click', () => {
                    queue = [...playlists[selectedPlaylist]];
                    currentTrackIndex = index;
                    playQueue();
                });
                playlistSongsList.appendChild(li);
            });
        }

        function renderPlaylistAddList() {
            playlistAddList.innerHTML = '';
            library.forEach((song) => {
                const li = document.createElement('li');
                li.innerHTML = `${song.name}<div class="song-info">Artist: ${song.artist || 'Unknown'}, Album: ${song.album || 'Unknown'}</div>`;
                li.addEventListener('click', () => {
                    playlists[selectedPlaylist].push(song);
                    localStorage.setItem('playlists', JSON.stringify(playlists));
                    renderPlaylistSongs();
                });
                playlistAddList.appendChild(li);
            });
        }

        audioPlayer.addEventListener('ended', () => {
            currentTrackIndex++;
            if (currentTrackIndex < queue.length) {
                playQueue();
            } else {
                playPauseButton.textContent = 'Play';
            }
        });

        prevButton.addEventListener('click', () => {
            currentTrackIndex--;
            if (currentTrackIndex >= 0) {
                playQueue();
            } else {
                currentTrackIndex = queue.length - 1;
                playQueue();
            }
        });

        nextButton.addEventListener('click', () => {
            currentTrackIndex++;
            if (currentTrackIndex < queue.length) {
                playQueue();
            } else {
                currentTrackIndex = 0;
                playQueue();
            }
        });

        playPauseButton.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playPauseButton.textContent = 'Pause';
            } else {
                audioPlayer.pause();
                playPauseButton.textContent = 'Play';
            }
        });

        audioPlayer.addEventListener('timeupdate', () => {
            progressBar.value = audioPlayer.currentTime;
        });

        audioPlayer.addEventListener('loadedmetadata', () => {
            progressBar.max = audioPlayer.duration;
        });

        progressBar.addEventListener('input', () => {
            audioPlayer.currentTime = progressBar.value;
        });

        async function getMetadata(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const buffer = event.target.result;
                    try {
                        const tags = window.jsmediatags.read(file, {
                            onSuccess: function (tag) {
                                const metadata = {
                                    artist: tag.tags.artist || 'Unknown',
                                    album: tag.tags.album || 'Unknown',
                                };
                                resolve(metadata);
                            },
                            onError: function (error) {
                                console.error('Error reading metadata:', error);
                                reject(error);
                            }
                        });
                    } catch (e) {
                         console.error("error with jsmediatags", e);
                         reject(e);
                    }

                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        }

        renderLibrary();
        renderPlaylists();
        renderQueue();