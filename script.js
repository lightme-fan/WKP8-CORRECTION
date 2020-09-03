let songs = [
    {
        id: Date.now(),
        score: '12',
        title: 'Tontolo faharoa',
        artist: 'AmbondronA',
        style: 'Rock',
        length: '4:03',
        picture: 'https://bit.ly/3gWVjTd'
    }
];

const songsList = document.querySelector('.song-list-container');
const addSongForm = document.querySelector('.add-songs');
const filterTitleInput = document.querySelector('#filter-title');
const filterStyleInput = document.querySelector('#filter-style');
const filterForm = document.querySelector('.filter-songs');
const resetFiltersBtn = document.querySelector('.reset-filters');

const filterList = e => {};

const resetFilters = e => {};

resetFiltersBtn.addEventListener('click', resetFilters);
filterTitleInput.addEventListener('keyup', filterList);
filterStyleInput.addEventListener('change', filterList);

const showSongs = (event, filterTitle, filterStyle) => {
    const html = songs.map(song =>
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
    songsList.dispatchEvent(new CustomEvent('pleaseUpdateTheList'))
};

// event delegation for update and delete song buttons
const handleClick = e => {
    console.log(e.target.dataset.id);
    if (e.target.closest('button.increment-score')) {
        const button = e.target;
        const id = button.dataset.id;
        updateSong(Number(id))
    }

    if (e.target.closest('button.delete')) {
        const button = e.target;
        const id = button.dataset.id;
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
const initLocalStorage = () => {};

// we want to update the local storage each time we update, delete or add an attirbute
const updateLocalStorage = () => {};

addSongForm.addEventListener('submit', addSong);
songsList.addEventListener('pleaseUpdateTheList', showSongs);
songsList.addEventListener('pleaseUpdateTheList', updateLocalStorage);
songsList.addEventListener('click', handleClick);

initLocalStorage();
