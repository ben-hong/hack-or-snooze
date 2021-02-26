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

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="far fa-star"></i>
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

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
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

// event listener for star
$allStoriesList.on("click", ".far", async (e) => {
  await currentUser.addFavorite($(e.target).parent().attr("id"));
  $(e.target).attr("class", "fas fa-star");
})

$allStoriesList.on("click", ".fas", async (e) => {
  await currentUser.removeFavorite($(e.target).parent().attr("id"));
  $(e.target).attr("class", "far fa-star");
})
