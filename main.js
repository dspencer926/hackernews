console.log('main.js connected~');

window.onload = function() {

let catalog = {};

class Entry {
  constructor(id, title, user, score, link) {
    this.id = id;
    this.title = title;
    this.user = user;
    this.score = score;
    this.link = link;
  }
}

function getList() {
  fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(function(response1){
      response1.json()
        .then(function(json){
          console.log ('json 1 loaded');
           for(i = 0; i < json.length; i++){
             fetchArticle(json[i]);
           }
        })
    })
}

function fetchArticle(response) {
  fetch(`https://hacker-news.firebaseio.com/v0/item/${response}.json`)
    .then(function(response){
        response.json()
          .then(function(json){
            console.log('json 2 loaded');
            makeCatalog(json);
        })
    })
}

function makeCatalog(article) {
  let newId = article.id;
  let newEntry = new Entry(article.id , article.title , article.by , article.score , article.url)
  catalog[newId] = newEntry;
  postTitle(catalog[newId]);
}

function postTitle(article) {
  let articleCopy = article;
  let $art = $('<li/>').html(article.title);
  $art.attr('class', 'titleLink').attr('id', `${article.id}`);
  $art.appendTo('#list');
  $('<hr>').appendTo('#list');

  $(`#${article.id}`).on('click', function(event) {         //   <---I didn't want to use an anonymous function.  I wanted to make this
                                                            //       modular, but Idk how to pass the article info as a parameter
    event.preventDefault(); 
    let $newBox = $('<div/>').attr('class', 'item-box').attr('id', `${article.id}-box`);;
    let $delete = $('<div/>').attr('class', 'delete-item').html('X').appendTo($newBox);
      $delete.on('click', function(event){

       $(`#${event.currentTarget.parentElement.id}`).remove();
      });

    let $newItem = $('<div/>').attr('class', 'list-item');
    let $newTitle = $('<h1/>').html(`${article.title}`).appendTo($newItem);
    let $newUser = $('<p/>').html(`OP: ${article.user}`).appendTo($newItem);
    let $newScore = $('<p/>').html(`Score: ${article.score}`).appendTo($newItem);
    let $viewerLink = $('<div/>').html('Read in Viewer').attr('class', 'desc-link').appendTo($newItem);
    let $newLinkDiv = $('<div/>').attr('class', 'desc-link').appendTo($newItem);
    let $newLink = $('<a/>').html('Link to Page').attr('href', article.link).attr('target', '_blank').appendTo($newLinkDiv);
    $viewerLink.on('click', function(event){
      $('#display-div').attr('class', 'show flex'); 
      console.log(event);      
      $('#display').attr('src', article.link);              //   Got from stackoverflow
      var display = document.getElementById('display');
      console.log(display.contentDocument.readyState);
    })
    $newItem.appendTo($newBox);
    $newBox.appendTo('#desc-div');
  });
}

getList();

const displayDiv = document.getElementById('display-div');
displayDiv.addEventListener('click', function() {
  $('#display-div').attr('class', 'hidden');
});

}