"use strict";

const missingImageURL = "https://tinyurl.com/tv-missing";
const TVMAZE_API_URL = "http://api.tvmaze.com/";


const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodesList = $("#episodes-list");


//Where is the searchShows function as described in the assignment intruction? I am assuming this is it after checking the solution
//Also...when using curl and insomia for the links provided in step one I get an empty array along with an error 404 message? Is this right or am I doing it wrong?
async function getShowsByTerm(term) {
  const response = await axios({
    url: `${TVMAZE_API_URL}search/shows?q=${term}`,
    method: 'GET'
  });
  return response.data.map(result => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : missingImageURL,
    }
  })
}


function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img src="${show.image}" alt="${show.name}" class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

async function getEpisodesOfShows(id) {
  const response = await axios({
    url: `${TVMAZE_API_URL}shows/${id}/episodes`,
    method: 'GET'
  });
  return response.data.map(e => ({
    id: e.id,
    name: e.name,
    season: e.season,
    number: e.number,
  }));
}

function populateEpisodes(episodes) {
  $episodesList.empty();

  for (let episode of episodes) {
    const $listItem = $(
      `<li>
        ${episode.name}
        Season: ${episode.season}
        Episode: ${episode.number}
        </li>`
    );
    $episodesArea.append($listItem);
  }
  $episodesArea.show();
}

async function getEpisodesAndDisplay(evt) {
  const showId = $(evt.target).closest(".Show").data("show-id");

  // // here's another way to get the ID of the show: search "closest" ancestor
  // // that has an attribute of 'data-show-id'. This is called an "attribute
  // // selector", and it's part of CSS selectors worth learning.
  // // const showId = $(evt.target).closest("[data-show-id]").data("show-id");

  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);
