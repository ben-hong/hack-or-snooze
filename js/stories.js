"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  // default class for empty star
  let star = "far";

  // reassigning to filled star class if story is a favorite
  for (let userFav of currentUser.favorites){
    if (userFav.storyId === story.storyId){
      star = "fas";
    }
  }

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="${star} fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage(arg) {
  console.debug("putStoriesOnPage");
  $allStoriesList.empty();

  let searchScope = storyList.stories;
  if (arg === "favorites") {
    searchScope = currentUser.favorites;
  }
  
  // loop through all of our stories and generate HTML for them
  //while (currentUser.favorites.length > 0){
    for (let story of searchScope) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }
  //}
  
  $formSubmit.hide();
  $allStoriesList.show();
}

// getting submit values and calling addStory
async function getSearchData() {
  let authorName = $('#author-name').val();
  let storyTitle = $('#story-title').val();
  let storyUrl = $('#story-url').val();

  $formSubmit.trigger("reset");
  
  await storyList.addStory(currentUser, {author: authorName, 
    title: storyTitle, url: storyUrl})

  }

// event listener for submit button, refreshes storyList and HTML
$formSubmit.on("submit", async (e)=> {
  e.preventDefault();
  await getSearchData();
  putStoriesOnPage();
})

// runs addFavorite/removeFavorite and changes star icon
$allStoriesList.on("click", ".fa-star", async (e) => {
  $(e.target).hasClass("far") ? 
  await currentUser.addFavorite($(e.target).parent().attr("id")) :
  await currentUser.removeFavorite($(e.target).parent().attr("id"));

  $(e.target).toggleClass("far fas");
});

