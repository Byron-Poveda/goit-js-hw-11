const API_KEY = '36227558-9625164a7e143cb1d3fcc8b96';
const URL = 'https://pixabay.com/api/?key=' + API_KEY + '&q=';
const buttonSearch = document.getElementById('idBtnSearch'),
  inputSearch = document.getElementById('idInputSearch'),
  listGallery = document.getElementById('idListGallery');
let imgString = '';
const funtionApi = async dataSearch => {
  const fetchApi = await fetch(`${URL}'${dataSearch}'`)
    .then(response => response.json())
    .then(data => {
      imgString = '';
      data.hits.forEach(element => {
        imgString += `<li class="gallery__item"><div class="card" style="width: 18rem">
        <a href="${element.webformatURL}" class="gallery__link">
        <img class="gallery__img card-img-top" src="${element.previewURL}" alt=""
        />
        <div class="card-body">
        <ul class="list-statistics">
            <li class="statistic__item"><p class="statistic__p">likes</p><span class="statistic__span">${element.likes}</span></li>
            <li class="statistic__item"><p class="statistic__p">views</p><span             class="statistic__span">${element.views}</span></li>
            <li class="statistic__item"><p class="statistic__p">comments</p><span          class="statistic__span">${element.comments}</span></li>
            <li class="statistic__item"><p class="statistic__p">downloads</p><span             class="statistic__span">${element.downloads}</span></li>
        </ul>
          </div>
        </a>
        </div>
   </li>`;
      });
      listGallery.innerHTML = imgString;
    })
    .catch(err => {
      console.log(err);
    });
};
buttonSearch.addEventListener('click', () => {
  inputSearch.value
    ? funtionApi(inputSearch.value)
    : alert('escribe algo en el input por favor');
});

// ya realice la conexion con la api me falta comentar el codigo, hacer q aparezcan mas imagenes, implementar en simpleLightBox, y las alertas, tambien tratar de q cada vez q baje al final cargen 20 fotos mas
