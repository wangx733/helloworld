// Client ID and API key from the Developer Console
var CLIENT_ID = '904494310957-snk9h5ndi37tl0h4emhho96llkpm10v7.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBkCA6UT776r0tRv_oynJX5g4T8xZd7PIE';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";
var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
/**
 *  On load, called to load the auth2 library and API client library.
 */
 function onSuccess(googleUser) {
      console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    }
    function onFailure(error) {
      console.log(error);
    }
    function renderButton() {
      gapi.signin2.render('authorize_button', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
      });
    }



function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}
/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}
/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUpcomingEvents();
        $("#allTheSignUp").css("display","none");
        $("#signOut").css("z-index","4");
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}
/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}
/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */

   
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;
        $(".date").html(" <div class='bullet'></div>"+"The Upcoming Events: ");
        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.dateTime;
                    
                }
                var eventt=$("<div>");
                eventt.attr("class","event")
                       .html("<h4 class='eventTitle'>"+event.summary +"</h4>"+
                                            "<p class='address'>"+ when +"</p>" +
                                            "<p class='arrivalTimeClass'>"+ "arrival time: "+"<bold class='arrivalTime'>"+when+"</bold>"+ "</p>"+
                                            "<p class='minutesBeforeClass'>"+"arrive"+"<input type='text' class='minuteBefore' value='"+$('#preferredTime').val()+"'>mins ahead</p>");
               $("#container-for-content").append(eventt);
            
            
            }
        } else {
            $(".date").text('No upcoming events found.');
            
        }
    });
}