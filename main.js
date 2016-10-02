(function() {
    // Js Cookies
    !function(e){if("function"==typeof define&&define.amd)define(e);else if("object"==typeof exports)module.exports=e();else{var n=window.Cookies,o=window.Cookies=e();o.noConflict=function(){return window.Cookies=n,o}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,i,r){var c;if("undefined"!=typeof document){if(arguments.length>1){if(r=e({path:"/"},t.defaults,r),"number"==typeof r.expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*r.expires),r.expires=a}try{c=JSON.stringify(i),/^[\{\[]/.test(c)&&(i=c)}catch(s){}return i=o.write?o.write(i,n):encodeURIComponent(String(i)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)),n=n.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),n=n.replace(/[\(\)]/g,escape),document.cookie=[n,"=",i,r.expires&&"; expires="+r.expires.toUTCString(),r.path&&"; path="+r.path,r.domain&&"; domain="+r.domain,r.secure?"; secure":""].join("")}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,f=0;f<p.length;f++){var u=p[f].split("="),l=u.slice(1).join("=");'"'===l.charAt(0)&&(l=l.slice(1,-1));try{var m=u[0].replace(d,decodeURIComponent);if(l=o.read?o.read(l,m):o(l,m)||l.replace(d,decodeURIComponent),this.json)try{l=JSON.parse(l)}catch(s){}if(n===m){c=l;break}n||(c[m]=l)}catch(s){}}return c}}return t.set=t,t.get=function(e){return t(e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});
    //# sourceMappingURL=js.cookie.min.js.map
    
    // Returns a clean string
    var cleanString = function(input) {
        var output = "";
        for (var i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) <= 127) {
                output += input.charAt(i);
            }
        }
        return output;
    };

    // Returns a proper URL without the anchor tag
    var getProperURL = function() {
        return cleanString('http://www.' + window.location.hostname + window.location.pathname);
    };

    // Adds the necessary elements to the panel
    var addNecessaryElements = function() {
        $('div.reactric-reaction-panel').append("<div class=reactric-reaction-panel-content><table class='reactric-table reactric-table-top'><tr><td class=td-center>React!</td></tr></table><div class=reactric-options-collective><p class=reactric-loading>Loading...</div></p><div class=reactric-error-div></div><table class='reactric-table reactric-table-bottom'><tr><td class=td-left><a href=http://www.reactric.com/plugin/cookie-policy target=_blank class=reactric-link>Cookie Policy</a></td><td class=td-right><a href=http://www.reactric.com target=_blank class=reactric-powered-by-link><img src=http://res.cloudinary.com/dhhb1tde3/image/upload/v1473257100/poweredbyreactric_qcw7tg.png></img></a></td></tr></table></div>");
    };

    // Returns a formatted string that can be appended to the reaction panel
    var createAppendElement = function(name, type, count, image_url) {
        return "<div data-reactric-name=" + name + " data-reactric-type=" + type + " class=reactric-reaction-option><p class=reactric-reaction-option-count data-reactric-count=" + count + " data-reactric-backup-count=" + count + ">" + count + "</p><img src=" + image_url + " class=reactric-reaction-option-img><p>" + name + "</p></div>";
    };

    // Updates the data count depending on which option was killed.
    var updateDataCount = function(name, count) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].name === name) {
                data[i].count = count;
                break;
            }
        };
    };

    // Initializing the variables.
    var resp = {},
        data = [],
        cookieName = 'reactric-cookie-' + $('div.reactric-reaction-panel').attr('data-reactric-website-key'),
        properURL = getProperURL(),
        cookie = {},
        reactricApiUrl = 'http://127.0.0.1:8000/api/';

    // Variable that handles the reaction panel
    var reactionPanel = {

        // Initialization
        init: function(url, websiteKey) {

            // Emptying the panel first
            $('div.reactric-reaction-panel-content').remove();

            // Adding the necessary elements
            addNecessaryElements();

            // Cookie initialization
            if (Cookies.getJSON(cookieName) === undefined) {
                // Cookie not found, so one must be created.
                cookie[properURL] = {
                    count: 0, // No. of times the user has reacted
                    name: 'None',
                    type: 'None'
                };
                Cookies.set(cookieName, cookie, {
                    expires: 365
                });
            } else {
                // Cookie found
                cookie = Cookies.getJSON(cookieName)[properURL];
                if (cookie === undefined) {
                    // If cookie property for this content does not exist, the we create a new one
                    cookie = Cookies.getJSON(cookieName);
                    cookie[properURL] = {
                        count: 0, // No. of times the user has reacted
                        name: 'None',
                        type: 'None'
                    };
                    Cookies.set(cookieName, cookie, {
                        expires: 365
                    });
                }
            }
            // Getting the cookie
            cookie = Cookies.getJSON(cookieName)[properURL];

            // GETting the data from the API
            $.ajax({
                url: reactricApiUrl + 'content_detail_view/' + properURL, // No. of views is increased when the content is loaded.
                type: 'GET',
                dataType: 'json',
                success: function(json) {
                    // GET was successful

                    // Removing the loader
                    $('p.reactric-loading').remove();

                    // Using the data to populate the panel
                    resp = json; // Backup stored for PUT
                    data = JSON.parse(json.data); // This is changed dynamically
                    for (var i = 0; i < data.length; i++) {
                        $('div.reactric-options-collective').append(createAppendElement(data[i].name, data[i].reaction_type, data[i].count, data[i].image_url));
                    };

                    // Changing the reaction option image size based on the number of options
                    if (data.length >= 5) {
                        $('img.reactric-reaction-option-img').animate({
                            width: "45px"
                        }, 100);
                    } else if (data.length <= 2) {
                        $('img.reactric-reaction-option-img').animate({
                            width: "70px"
                        }, 100);
                    }

                    // Setting the active and inactive classes if applicable
                    if (cookie.name !== 'None') {
                        $("div[data-reactric-name='" + cookie.name + "']")
                            .addClass('reactric-reaction-option-active')
                            .siblings()
                            .addClass('reactric-reaction-option-inactive');
                    }

                    // Initializing the events
                    reactionPanel.initEvents(url);

                },
                error: function(req, status, err) {
                    // GET was unsuccessful
                    if (req.status == 404) {
                        // 404, so a new content instance has to be created.
                        $.ajax({
                            url: reactricApiUrl + 'website_detail/' + websiteKey + '/content_list/',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                "title": cleanString(document.title),
                                "address": properURL
                            },
                            success: function(json) {
                                // Reset the panel
                                reactionPanel.init(url, websiteKey);
                            },
                            error: function(req, status, err) {
                                // POST was unsuccessful so we handle the error.
                                console.log(req + status + err);

                                // Removing the loader
                                $('p.reactric-loading').remove();

                                // Handling the errors
                                $('div.reactric-error-div').append('<p class=reactric-error-text>Something went wrong loading the panel.</p><p><button class=reactric-reload-button>Reload</button></p>');

                                $('button.reactric-reload-button').click(function() {
                                    reactionPanel.init(url, websiteKey);
                                });
                            }
                        });
                    }

                    // Something else went wrong. So we handle the error.
                    else {
                        console.log(req + status + err);

                        // Removing the loader
                        $('p.reactric-loading').remove();

                        // Handling the errors
                        $('div.reactric-error-div').append('<p class=reactric-error-text>Something went wrong loading the panel.</p><p class=reactric-error-text><button class=reactric-reload-button>Reload</button></p>');

                        $('button.reactric-reload-button').click(function() {
                            reactionPanel.init(url, websiteKey);
                        });
                    }

                }
            });


        },

        // Initializing events
        initEvents: function(url) {
            $('div.reactric-reaction-option').click(function() {
                var $this = $(this);

                // Removing the error dialogue
                $('div.reactric-error-div').empty();

                // If the user has already reacted 3 times, we alert him and return.
                if (cookie.count >= 300) {
                    alert("You can only change your reaction 3 times.");
                    return;
                }

                // GETting the updated data
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'json',
                    success: function(json) {
                        // GET was successful

                        // Resetting the variables and data attributes
                        resp = json;
                        data = JSON.parse(json.data);
                        for (var i = 0; i < data.length; i++) {
                            $("div[data-reactric-name='" + data[i].name + "']")
                                .children('p.reactric-reaction-option-count')
                                .attr('data-reactric-count', data[i].count);
                        };

                        // Handle the event
                        reactionPanel.handleEvent(url, $this)
                    },
                    error: function(req, status, err) {
                        // GET was unsuccessful
                        console.log(req + status + err);

                        // Handling the errors
                        $('div.reactric-error-div')
                            .empty()
                            .append('<p class=reactric-error-text>Something went wrong. Try again.</p>');
                    }
                });

            });
        },

        // Handling the event depending on which option was clicked
        handleEvent: function(url, thisElem) {
            var count,
                backupCount, // This is used to only change the text displayed.
                $this = thisElem;

            if ($this.hasClass('reactric-reaction-option-active')) {

                count = parseInt($this.children('p.reactric-reaction-option-count').attr('data-reactric-count')) - 1;
                backupCount = parseInt($this.children('p.reactric-reaction-option-count').attr('data-reactric-backup-count')) - 1;

                // Updating the data count
                updateDataCount($this.attr('data-reactric-name'), count)

                $this
                    .removeClass('reactric-reaction-option-active')
                    .children('p.reactric-reaction-option-count')
                    .attr('data-reactric-count', count)
                    .attr('data-reactric-backup-count', backupCount)
                    .text(backupCount)
                    .end()
                    .siblings()
                    .removeClass('reactric-reaction-option-inactive');

                // Handling the reaction counts
                if (cookie.type === 'Positive') {
                    resp.positive_reactions_count -= 1;
                } else if (cookie.type === 'Negative') {
                    resp.negative_reactions_count -= 1;
                } else {
                    console.log('Possible Error (Can be ignored)');
                }

                // Setting the cookie name to none
                cookie.name = 'None';
                cookie.type = 'None';
            } else {

                if ($this.hasClass('reactric-reaction-option-inactive')) {
                    var active = $('div.reactric-reaction-option-active');

                    count = parseInt(active.children('p.reactric-reaction-option-count').attr('data-reactric-count')) - 1;
                    backupCount = parseInt(active.children('p.reactric-reaction-option-count').attr('data-reactric-backup-count')) - 1;

                    // Updating the data count
                    updateDataCount(active.attr('data-reactric-name'), count);

                    active
                        .children('p.reactric-reaction-option-count')
                        .attr('data-reactric-count', count)
                        .attr('data-reactric-backup-count', backupCount)
                        .text(backupCount);
                }

                count = parseInt($this.children('p.reactric-reaction-option-count').attr('data-reactric-count')) + 1;
                backupCount = parseInt($this.children('p.reactric-reaction-option-count').attr('data-reactric-backup-count')) + 1;

                // Updating the data count
                updateDataCount($this.attr('data-reactric-name'), count);

                $this
                    .removeClass('reactric-reaction-option-inactive')
                    .addClass('reactric-reaction-option-active')
                    .children('p.reactric-reaction-option-count')
                    .attr('data-reactric-count', count)
                    .attr('data-reactric-backup-count', backupCount)
                    .text(backupCount)
                    .end()
                    .siblings()
                    .removeClass('reactric-reaction-option-active')
                    .addClass('reactric-reaction-option-inactive');

                // Handling the reaction counts
                if (cookie.type === 'None') {
                    if ($this.attr('data-reactric-type') === 'Positive') {
                        resp.positive_reactions_count += 1;
                    } else if ($this.attr('data-reactric-type') === 'Negative') {
                        resp.negative_reactions_count += 1;
                    } else {
                        console.log('Possible Error (Can be ignored)');
                    }
                } else {
                    if (cookie.type === 'Positive' && $this.attr('data-reactric-type') === 'Negative') {
                        resp.positive_reactions_count -= 1;
                        resp.negative_reactions_count += 1;
                    } else if (cookie.type === 'Negative' && $this.attr('data-reactric-type') === 'Positive') {
                        resp.positive_reactions_count += 1;
                        resp.negative_reactions_count -= 1;
                    } else {
                        console.log('No change.');
                    }
                }

                // Setting the cookie name and count to the appropriate value
                cookie.name = $this.attr('data-reactric-name');
                cookie.type = $this.attr('data-reactric-type');
                cookie.count += 1;

            }

            // Updating the response into string
            resp.data = JSON.stringify(data);

            // PUTting the data to the API
            $.ajax({
                url: url,
                type: 'PUT',
                dataType: 'json',
                data: resp,
                success: function() {
                    // Re-setting the cookie
                    var cookieContent = Cookies.getJSON(cookieName);
                    cookieContent[properURL] = cookie;
                    Cookies.set(cookieName, cookieContent, {
                        expires: 365
                    });
                    cookie = Cookies.getJSON(cookieName)[properURL];
                },
                error: function(req, status, err) {
                    // PUT was unsuccessful
                    console.log(req + status + err);

                    // Handling the error
                    $('div.reactric-error-div')
                        .empty()
                        .append('<p class=reactric-error-text>Something went wrong. Try again.</p>');
                }
            });

        }

    };

    // Initializing the reaction panel
    reactionPanel.init(reactricApiUrl + 'content_detail/' + properURL, $('div.reactric-reaction-panel').attr('data-reactric-website-key'));

})();
