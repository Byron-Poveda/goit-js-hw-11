// import librarys
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

// def variables
const API_KEY = '36227558-9625164a7e143cb1d3fcc8b96';
let URL = 'https://pixabay.com/api/?key=' + API_KEY + '&q=',
  page = 1,
  per_page,
  imgString = '',
  pressKey = false,
  scrolling = false,
  skipSucces = false;
let scrollBody = document.getElementById('scroll');
const buttonSearch = document.getElementById('idBtnSearch'),
  inputSearch = document.getElementById('idInputSearch'),
  listGallery = document.getElementById('idListGallery');

// function => change url for add hits (use async/await and try/catch)
const functionApi = async dataSearch => {
  try {
    const fetchApi = await fetch(
      // change url
      `${URL}${dataSearch}&image_type=photo&page=${page}&per_page=${per_page}&safesearch=true&lang=es,en`
      // checking url
    );
    // converting plain content to json
    const data = await fetchApi.json();
    // clear listGallery (container`s hits)
    remove();
    if (
      data.totalHits >= 1 &&
      per_page >= data.totalHits &&
      scrolling === true
    ) {
      Report.warning('¡Atention!', '<div>The hits are over</div>', 'Okay', {
        backOverlay: true,
        backOverlayColor: 'rgba(0,0,0,0.5)',
        messageFontSize: '20px',
      });
      scrolling = false;
      inputSearch.blur();
      return;
    }
    // doing traversal of the array with the objects
    data.hits.forEach(element => {
      // adding the card li to an empty variable
      imgString += `<li class="gallery__item">
        <div class="photo-card">
        <a href="${element.largeImageURL}" class="gallery__link card">
          <img class="gallery__img card-img-top" src="${element.webformatURL}" alt="${element.tags}"/>
          <div class="card-body">
            <ul class="list-statistics">
              <li class="statistic__item"><p class="statistic__p">likes</p><span class="statistic__span">${element.likes}</span></li>
              <li class="statistic__item"><p class="statistic__p">views</p><span class="statistic__span">${element.views}</span></li>
              <li class="statistic__item"><p class="statistic__p">comments</p><span class="statistic__span">${element.comments}</span></li>
              <li class="statistic__item"><p class="statistic__p">downloads</p><span class="statistic__span">${element.downloads}</span></li>
            </ul>
          </div>
        </a>
        </div>
        </li>`;
    });
    // adding to the container the cards with the hits
    listGallery.innerHTML = imgString;
    // use library SimpleLightbox in cards
    let galleryCaption = new SimpleLightbox('.gallery__link');
    // verifying that the word that the client chose is valid and the list has children
    if (listGallery.childNodes.length > 0) {
      return per_page <= 20
        ? Notify.success(`Hooray! We found ${data.totalHits} images.`)
        : null;
    }
    if (listGallery.childNodes.length < 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          backOverlay: true,
          backOverlayColor: 'rgba(0,0,0,0.5)',
          timeout: 1500,
          clickToClose: true,
          pauseOnHover: false,
        }
      );
      inputSearch.blur();
      return;
    }

    // error handling
  } catch (err) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      {
        backOverlay: true,
        backOverlayColor: 'rgba(0,0,0,0.5)',
        timeout: 1500,
        clickToClose: true,
        pauseOnHover: false,
      }
    );
    inputSearch.blur();
  }
};

// adding listener to buttonSearch
buttonSearch.addEventListener('click', () => {
  per_page = 20;
  searchDataApi();
  scrolling = false;
});
// adding functionality to enter
document.addEventListener('keydown', e => {
  if (pressKey) {
    return;
  }
  if (e.key === 'Enter') {
    buttonSearch.click();
    pressKey = true;
  }
});
document.addEventListener('keyup', () => {
  pressKey = false;
});
const remove = () => {
  imgString = '';
};
const searchDataApi = () => {
  if (inputSearch.value) {
    functionApi(inputSearch.value);
  } else {
    Notify.failure('Please enter something in the input, try again', {
      backOverlay: true,
      backOverlayColor: 'rgba(0,0,0,0.5)',
      timeout: 1500,
      clickToClose: true,
      pauseOnHover: false,
    });
    inputSearch.blur();
  }
};
// evento tras acabar con las 20 imagenes
// listener para saber cuando este al final de la pagina al hacer scroll
window.addEventListener('scroll', e => {
  scrolling = true;
  // console.log(e.currentTarget); aqui puedo ver opciones del window
  if (window.innerHeight + window.scrollY >= scrollBody.offsetHeight) {
    per_page += 12;
    searchDataApi();
  }
});
