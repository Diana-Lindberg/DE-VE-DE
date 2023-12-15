import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, updateDoc, query, where, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAtxEoZYyKE0MD3y4S0APWEdXOgeUFRQBs",
  authDomain: "de-ve-de-348eb.firebaseapp.com",
  projectId: "de-ve-de-348eb",
  storageBucket: "de-ve-de-348eb.appspot.com",
  messagingSenderId: "765910930103",
  appId: "1:765910930103:web:b1e798cbe521082ec87332",
  measurementId: "G-TLQH3N4T9T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const submitButton = document.querySelector('#submitButton')
const movieList = document.querySelector('#movieList')


async function addMovie(movie) {
  const movieRef = collection(db, 'movies');
  movie.title = movie.title.toUpperCase();

  const result = await getDocs(query(movieRef, where('title', '==', movie.title)));

  if (result.size > 0) {
    alert('Filmen finns redan');
  } else {
    await addDoc(movieRef, movie);
    console.log('Lagt till film');
    updateMovieList()
  }
};

async function getMovie(){
  const getTheMovie = await getDocs(collection(db, 'movies'));
  getTheMovie.forEach((movie)=> movieElement({id: movie.id, ...movie.data()}));
}
updateMovieList()


async function deleteMovie(movieData){
  await deleteDoc(doc(db, 'movies', movieData.id))
}

async function watchedMovie(movieData){
const watchedButton = document.querySelector('.watchedButton');
if (movieData.watched === false){
  movieData.watched = true;
  await updateDoc(doc(db, 'movies', movieData.id), movieData);
  watchedButton.checked = true;
} else {
  movieData.watched = false;
  await updateDoc(doc(db, 'movies', movieData.id), movieData);
  watchedButton.checked = false;
}
}

function updateMovieList(){
  movieList.innerHTML = ''
  getMovie()
}

function movieElement(movieData){
  const containerElem = document.createElement('article');
  containerElem.innerHTML = `
  <h3>${movieData.title}</h3>
  <p>${movieData.genre}</p>
  <p>${movieData.releasedate}</p>
  <button id="deleteButton">Ta bort</button>
Jag har sett filmen<input type="checkbox"  class="watchedButton" name="watch button">
  `;
  movieList.appendChild(containerElem);
  const deleteButton = containerElem.querySelector('#deleteButton');
  const watchedButton = containerElem.querySelector('.watchedButton');


if(movieData.watched === true){
  watchedButton.checked = true;
} else {
  watchedButton.checked = false;
}

  watchedButton.addEventListener('click', ()=>{
    watchedMovie(movieData)
  })


  deleteButton.addEventListener('click', () => {
  updateMovieList()
  deleteMovie(movieData)
  })
}

submitButton.addEventListener('click', ()=> {
  event.preventDefault();
  const movie = {
    title: document.querySelector('#title').value , 
    genre: document.querySelector('#genre').value ,
    releasedate: document.querySelector('#releaseDate').value,
    watched: false
  }
  if (movie.title === ''|| movie.genre === '' === movie.releasedate === ''){
    alert('Fyll i alla fält');
    return;
  }else{
  addMovie(movie);
  updateMovieList()
  }
});