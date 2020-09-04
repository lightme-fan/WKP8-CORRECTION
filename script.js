let songs = [];

const songsList = document.querySelector('.song-list-container');
const addSongForm = document.querySelector('.add-songs');
const filterTitleInput = document.querySelector('#filter-title');
const filterStyleInput = document.querySelector('#filter-style');
const filterForm = document.querySelector('.filter-songs');
const resetFiltersBtn = document.querySelector('.reset-filters');

const filterList = e => {
    showSongs(e, filterTitleInput.value, filterStyleInput.value);
};

const resetFilters = e => {
    const resetBtn = e.target;
    console.log(resetBtn);
    songsList.dispatchEvent(new CustomEvent('pleaseUpdateTheList'))
};

resetFiltersBtn.addEventListener('click', resetFilters);
filterTitleInput.addEventListener('keyup', filterList);
filterStyleInput.addEventListener('change', filterList);

const showSongs = (event, filterTitle, filterStyle) => {
    let sortedSongs = songs.sort((a, b) => b.score - a.score);
    if (filterTitle) {
        sortedSongs = songs.filter(song => {
            let lowerCaseTitle = song.title.toLowerCase();
            let lowerCaseFilterTitle = filterTitle.toLowerCase();
            if (lowerCaseTitle.includes(lowerCaseFilterTitle)) {
                return true;
            } else {
                return false;
            }
        });
    }

    if (filterStyle) {
        console.log(filterStyle);
        sortedSongs = sortedSongs.filter(song => song.style == filterStyle);
    }

    const html = sortedSongs.map(song =>
    `
        <article class="song">
            <section>
                <img src="${song.picture}" alt="${song.artist}" />
            </section>
            <section>
                <h5>${song.title}</h5>
                <p>${song.style}</p>
            </section>
            <section>
                <h5>${song.artist}</h5>
                <p>${song.length}</p>
            </section>
            <section>
                SCORE: ${song.score}
            </section>
            <section>
                <button id="${song.id}" aria-label="Increment ${song.title}">+1</button>
                <button id="${song.id}" aria-label="Delete ${song.title}">
                    <img src="./assets/icons/trash.svg" alt="Delete Song" />
                </button>
            </section>
        </article>
    `    
    ).join('');
    songsList.innerHTML = html
};
showSongs();

const addSong = e => {
    e.preventDefault();
    const form = e.target;
    const newSong = {
        id: Date.now(),
        score: 0,
        title: form.title.value,
        artist: form.artist.value,
        style: form.style.value,
        length: form.length.value,
        picture: form.picture.value
    }
    songs.push(newSong);
    form.reset();
    songsList.dispatchEvent(new CustomEvent('pleaseUpdateTheList'))
};

// event delegation for update and delete song buttons
const handleClick = e => {
    if (e.target.closest('button.increment-score')) {
        const button = e.target.closest('button.increment-score');
        console.log(button);
        const id = button.dataset.id;
        console.log(id)
        updateSong(Number(id))
    }

    if (e.target.closest('button.delete')) {
        const button = e.target.closest('button.delete');
        console.log(button);
        const id = button.dataset.id;
        console.log(id)
        updateSong(Number(id))
    }
};

const updateSong = idFromTheButton => {
    const song = songs.filter(song => song.id === idFromTheButton);
    song.score++;
    songsList.dispatchEvent(new CustomEvent('pleaseUpdateTheList'))
};

const deleteSong = idToDelete => {
    songs = songs.filter(song => song.id !== idToDelete);
    songsList.dispatchEvent(new CustomEvent('pleaseUpdateTheList'))
};

// when we reload, we want to look inside the local storage and put them into songs
const initLocalStorage = () => {
    const stringFromLs = localStorage.getItem('songs');
    const listItem = JSON.parse(stringFromLs);
    if (listItem) {
        songs = listItem;
    } else {
        songs = [];
    }
    songsList.dispatchEvent(new CustomEvent('pleaseUpdateTheList'))
};

// we want to update the local storage each time we update, delete or add an attirbute
const updateLocalStorage = () => {
    localStorage.setItem('songs', JSON.stringify(songs));
};

addSongForm.addEventListener('submit', addSong);
songsList.addEventListener('pleaseUpdateTheList', showSongs);
songsList.addEventListener('pleaseUpdateTheList', updateLocalStorage);
songsList.addEventListener('click', handleClick);

initLocalStorage();
