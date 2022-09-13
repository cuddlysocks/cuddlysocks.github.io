//The following keys advance or rewind slides.
//Note: page-up and page-down are also keys transmitted by many usb pointers.
next_keys = [34, 32, 13, 78, 110]; //Page-up, spacebar, enter, N, n.
previous_keys = [33, 8, 80, 112]; //Page-down, backspace, P, p.

//Keys not in override_keys will only be accepted with ctrl+key.
//This allows free typing in presentations which have textboxes etc.
override_keys = next_keys.concat(previous_keys);

//Comment out the line below to bypass ctrl.
//override_keys = [33, 34];

//This function loads successive or previous pages into the iframe depending on the key pressed.
//The logic extracts the name of the page (i.e. 3.html), increments the number (to get i.e. 4.html),
//and then loads the resulting page.
//The final page has its own redirect, say 9.html->9end.html, which can't be further incremented but
//can be decreased back to 8.html.
$(document).keydown(function(event) {
    var key = event.keyCode | event.which;

    //Only accept ctrl-clicks from keyboard, specfic to presentations with dynamic input:
    if(override_keys.indexOf(key) < 0 && !event.ctrlKey) {
        return;
    }

    if(next_keys.indexOf(key) >= 0) {
        var page_name = /[^\/]*(?=.html$)/.exec(window.frames[0].location.href); //Extracts 3 from '??/??/???/3.html'
        var page_path = /.*\/(?=[^\/]*.html$)/.exec(window.frames[0].location.href); //Extracts '??/??/???/' from above.

        if(isNaN(page_name)) { //Better to check this on page_name cause parseInt may cheat (see below).
            return;
        }

        var page_number = parseInt(page_name);
        page_name = (page_number + 1).toString();
        window.frames[0].location.href = page_path + page_name + '.html';
        return;
    }

    if(previous_keys.indexOf(key) >= 0) {
        var page_name = /[^\/]*(?=.html$)/.exec(window.frames[0].location.href);
        var page_path = /.*\/(?=[^\/]*.html$)/.exec(window.frames[0].location.href);
        var page_number = parseInt(page_name); //Note - using a feature of parseInt by which parseInt('10end') = 10!!!
        if(isNaN(page_number) || page_number == 0) { //In case even parseInt couldn't find a number, e.g. page name was 'x.html'.
            return;
        }
        page_name = (page_number - 1).toString();
        window.frames[0].location.href = page_path + page_name + '.html';
        return;
    } 
});

//Copies iframe content to main div every time iframe refreshes.
$(document).ready(function() {
    var iframe = $('iframe[name="main"]');
    iframe.load(function() {
        //Get iframe content:
        var htm = iframe.contents().find("body").clone().html();
        //Make it the (inner)html of the main div (first element with class="main"):
        $(".main").html(htm);
    });
});
