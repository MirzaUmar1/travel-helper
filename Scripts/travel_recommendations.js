/**
 * Search function.
 */
async function searchDestination() {

    loadHome();
    var destinationSearch = document.getElementById("dest_search").value.toLowerCase();
    let successfulSearch = await produceRecommendations(destinationSearch);  
    return successfulSearch;
}

/**
 * This function updates the page to show the recommendations based on the search.
 * @param {String} search seach value
 */
function produceRecommendations(search) {

    // make this async function?????
    return fetch("../APIData/travel_recommendations.json")
    .then(response => {
        return response.json();
     })
    .then(data => {
        var destinations = data;        

        // Must first check that the input is valid
        if (Object.keys(destinations).includes(search)) {
            let recommendationList = document.getElementById("recommendations");
            recommendationList.style.visibility = "visible";

            let destinationResults = destinations[search];
            let contentDiv = document.getElementById("recommend_list");
            contentDiv.innerHTML = "";

            // add to the html each of the recommendations from the returned results
            destinationResults.forEach(destination => getHTML(search, destination));
            return 1;
        } else {
            return 0;
        }
    })
    .catch(error => "Cannot access JSON");
}

/**
 * Insert the HTML into page for each destination of the search result
 * @param {String} searchResult search value
 * @param {any} destination element in array of search object
 */
function getHTML(searchResult, destination) {

    const getTitle = function (name) { return name.includes(",") ? name.split(",") : [name, ""] };


    let titleConfig = getTitle(destination.name);
    destinationTime = "14:00";

    // HTML accordion item and add to the recommend list
    let htmlString = `<h2 class="accordion-header recommendation">
                        <button class="accordion-button rounded collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${destination.id}" aria-expanded="false" aria-controls=${destination.id}>
                            <h3>
                                ${titleConfig[0]}
                                <small class="text-body-secondary">${titleConfig[1]}</small>
                            </h3>
                        </button>
                      </h2>
                     <div id="${destination.id}" class="accordion-collapse collapse" data-bs-parent="#recommend_list">
                        <div class="accordion-body" id="${destination.id}_body">
                        </div>
                     </div>`;

    let contentDiv = document.getElementById("recommend_list");
    contentDiv.innerHTML += htmlString;

    // Get the HTML for the accordion item's body, depending on the search type
    var htmlBody = "";
    var bodyElement = document.getElementById(`${destination.id}_body`);

    // Append the correct HTML to the accordion item's body, depending on the search result
    if (searchResult != "countries") {
        htmlBody += `<div class="card">
                      <img src="${destination.imageUrl}" class="card-img-top" alt="">
                      <div class="card-body">
                        <p class="card-text">${destination.description}</p>
                      </div>
                    </div>`;
        bodyElement.innerHTML = htmlBody;
                        
    } else {   

        // Generate HTML list of cities for country search
        bodyElement.innerHTML = `<ul id="${destination.id}_card_list" class="card-list"></ul>`;
        var cardList = document.getElementById(`${destination.id}_card_list`);

        destination.cities.forEach(city => {
            
            htmlBody = `<li><div class="card" style="width: 18rem;">
                          <img src="${city.imageUrl}" class="card-img-top" alt="...">
                          <div class="card-body">
                          <h5 class="card-title">${city.name}</h5>
                            <p class="card-text">${city.description}</p>
                          </div>
                        </div></li>`;            
                        //scroll cards?
            cardList.innerHTML += htmlBody;
        });        
    }
        
}

/**
 * Clear the content of the search bar.
 */
function clearSearchBar(){
    document.getElementById("dest_search").value = "";
}

/**
 * Clear the recommendations from the page and the search bar
 */
function clearSearch() {
    // Clear recommendations

    // FIX: when cards are open, the bars close first and leave the cards...
    let recommendations = document.getElementById("recommendations");
    recommendations.style.visibility = "hidden";
    clearSearchBar();
}

/**
 * 
 * @param {String} pageURL HTML page to fetch HTML content from to update the main content of the page
 */
async function loadContent(pageURL){
    let getContent = await fetch(pageURL)
    .then(response => response.text())
    .then(text => {
            let contentDiv = document.getElementById("main-content");
                contentDiv.innerHTML = text;
        });

    // re-initialise any popovers in the updated HTML
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
}

/**
 * Load homepage content into main page.
 */
function loadHome(){
    loadContent("../Templates/home.html");
}

/**
 * Load about us content into main page.
 */
async function loadAboutUs() {
    let contentLoaded = await loadContent("../Templates/about_us.html");
    getTeam();
}

/**
 * Fetch the team data and add HTML content to team section.
 */
function getTeam() {
    fetch("../APIData/travel_team.json")
        .then(response => response.json())
        .then(teamData => {
            let teamSection = document.getElementById("team-section");
            let fadeTime = 2000;
            teamData.members.forEach(member => {
                let html = `<div class="col" id="${member.id} style="display:none">
                                <div class="card w-50 mb-3 member-card">
                                    <div class="card-body">
                                        <h5 class="card-title">${member.name}</h5>
                                        <img class="flag-icon" src="${member.nationality}">
                                        <p class="card-text">    
                                        <h6 class="card-sub-title"><u>Favourite destination</u></h6>
                                            ${member.favouritePlace}
                                        </p>
                                    </div>
                                </div>
                            </div>`;
                teamSection.innerHTML += html;
                $(`#${member.id}`).fadeIn(fadeTime);
                fadeTime+=3000;
            });            
        })
}

/**
 * Creates popup element to show success of form submission to the user
 * @param {String} message Message to show in popup
 */
function submitContact(message) {

    // Check if form filled out
    var contactName = document.getElementById("contact-name").value;
    var contactEmail = document.getElementById("contact-email").value;
    var contactMessage = document.getElementById("contact-message".value);

    const alertPlaceholder = document.getElementById('submit-alert');

    if (!contactName || !contactEmail || contactMessage) {
        alertPlaceholder.innerHTML = `<div class="alert alert-warning alert-dismissible" role="alert">
                                       <div>Please fill in the form correctly</div>
                                       <button type="button" class="btn-close submit-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                      </div>`;

    } else {
        alertPlaceholder.innerHTML = `<div class="alert alert-success alert-dismissible" role="alert">
                                       <div>${message}</div>
                                       <button type="button" class="btn-close submit-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                      </div>`
    }
}

//****************************** EVENT LISTENERS ****************************************/

/**
 * Event listeners for updating the page content from the navigation page.
 */
$(document).on("click", "#home", loadHome);
$(document).on("click", "#about_us", loadAboutUs);
$(document).on("click", "#contact_us", function(){loadContent("../Templates/contact_us.html")});

/**
 * Event listeners for user interaction with the beach search
 */
$(document).on("click", "#beach", function(){
    produceRecommendations("beaches");
    document.getElementById("beach").style["font-weight"] = "bolder";
    });

$(document).on("mouseover", "#beach", function(){
    const popover = bootstrap.Popover.getOrCreateInstance('#beach');
    popover.show();
});

$(document).on("mouseout", "#beach", function(){
    const popover = bootstrap.Popover.getOrCreateInstance('#beach');
    popover.hide();   
});

/**
 * Event listeners for user interaction with the temple search
 */
$(document).on("click", "#culture", function(){
    produceRecommendations("temples");
    document.getElementById("culture").style["font-weight"] = "bolder";
    });

$(document).on("mouseover", "#culture", function(){
    const popover = bootstrap.Popover.getOrCreateInstance('#culture');
    popover.show();
});

$(document).on("mouseout", "#culture", function(){
    const popover = bootstrap.Popover.getOrCreateInstance('#culture');
    popover.hide();
});

/**
 * Event listeners for user interaction with the country search
 */
$(document).on("click", "#country", function(){
    produceRecommendations("countries");
    document.getElementById("country").style["font-weight"] = "bolder";
    });

$(document).on("mouseover", "#country", function(){
    const popover = bootstrap.Popover.getOrCreateInstance('#country');
    popover.show();
});

$(document).on("mouseout", "#country", function(){
    const popover = bootstrap.Popover.getOrCreateInstance('#country');
    popover.hide();
});

/**
 * Event listener for recommendation search 
 */
$(document).on("click", "#search-button", function () {
    searchDestination()
        .then(success => {
            if (!success) {
                const popover = bootstrap.Popover.getOrCreateInstance('#search-popover');
                popover.show();
                setTimeout(() => { popover.dispose() }, 1000);
            } else {
                clearSearchBar();
            }
        })
      
})

/**
 * Event listeners for contact form submission
 */
$(document).on("click", "#submit-alert-button", function () {
    submitContact("Thank you for contacting us!");
})
