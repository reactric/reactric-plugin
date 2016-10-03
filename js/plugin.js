// ________________________________________________________

// Licenses
// ________________________________________________________

/*!
 * Reactric Reaction System Plugin
 * www.reactric.com
 *
 * Copyright 2016, Reactric, Bangladesh
*/

/*!
 * JavaScript Cookie v2.1.2
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
*/

// ________________________________________________________

// Cookies Initialization Function
// ________________________________________________________

function cookiesInit() {
    ;
    (function(factory) {
        if (typeof define === 'function' && define.amd) {
            define(factory);
        } else if (typeof exports === 'object') {
            module.exports = factory();
        } else {
            var OldCookies = window.Cookies;
            var api = window.Cookies = factory();
            api.noConflict = function() {
                window.Cookies = OldCookies;
                return api;
            };
        }
    }(function() {
        function extend() {
            var i = 0;
            var result = {};
            for (; i < arguments.length; i++) {
                var attributes = arguments[i];
                for (var key in attributes) {
                    result[key] = attributes[key];
                }
            }
            return result;
        }

        function init(converter) {
            function api(key, value, attributes) {
                var result;
                if (typeof document === 'undefined') {
                    return;
                }

                // Write

                if (arguments.length > 1) {
                    attributes = extend({
                        path: '/'
                    }, api.defaults, attributes);

                    if (typeof attributes.expires === 'number') {
                        var expires = new Date();
                        expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                        attributes.expires = expires;
                    }

                    try {
                        result = JSON.stringify(value);
                        if (/^[\{\[]/.test(result)) {
                            value = result;
                        }
                    } catch (e) {}

                    if (!converter.write) {
                        value = encodeURIComponent(String(value))
                            .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                    } else {
                        value = converter.write(value, key);
                    }

                    key = encodeURIComponent(String(key));
                    key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                    key = key.replace(/[\(\)]/g, escape);

                    return (document.cookie = [
                        key, '=', value,
                        attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
                        attributes.path && '; path=' + attributes.path,
                        attributes.domain && '; domain=' + attributes.domain,
                        attributes.secure ? '; secure' : ''
                    ].join(''));
                }

                // Read

                if (!key) {
                    result = {};
                }

                // To prevent the for loop in the first place assign an empty array
                // in case there are no cookies at all. Also prevents odd result when
                // calling "get()"
                var cookies = document.cookie ? document.cookie.split('; ') : [];
                var rdecode = /(%[0-9A-Z]{2})+/g;
                var i = 0;

                for (; i < cookies.length; i++) {
                    var parts = cookies[i].split('=');
                    var cookie = parts.slice(1).join('=');

                    if (cookie.charAt(0) === '"') {
                        cookie = cookie.slice(1, -1);
                    }

                    try {
                        var name = parts[0].replace(rdecode, decodeURIComponent);
                        cookie = converter.read ?
                            converter.read(cookie, name) : converter(cookie, name) ||
                            cookie.replace(rdecode, decodeURIComponent);

                        if (this.json) {
                            try {
                                cookie = JSON.parse(cookie);
                            } catch (e) {}
                        }

                        if (key === name) {
                            result = cookie;
                            break;
                        }

                        if (!key) {
                            result[name] = cookie;
                        }
                    } catch (e) {}
                }

                return result;
            }

            api.set = api;
            api.get = function(key) {
                return api(key);
            };
            api.getJSON = function() {
                return api.apply({
                    json: true
                }, [].slice.call(arguments));
            };
            api.defaults = {};

            api.remove = function(key, attributes) {
                api(key, '', extend(attributes, {
                    expires: -1
                }));
            };

            api.withConverter = init;

            return api;
        }

        return init(function() {});
    }));
}

// ________________________________________________________

// Reactric Initialization Function
// ________________________________________________________

function reactricInit($) {
    // Loading the CSS styles
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "https://cdn.rawgit.com/reactric/reactric-plugin/master/css/style.min.css"
    }).appendTo("head");

    // Loading the Cookie library
    cookiesInit();

    // --------- Functions ---------

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
        $('div.reactric-reaction-panel').append("<div class=reactric-reaction-panel-content><table class='reactric-table reactric-table-top'><tr><td class=td-center>React!</td></tr></table><div class=reactric-options-collective><p class=reactric-loading>Loading...</div></p><div class=reactric-error-div></div><table class='reactric-table reactric-table-bottom'><tr><td class=td-left><a href=http://www.reactric.com/plugin/cookie-policy target=_blank class=reactric-link>Cookie Policy</a></td><td class=td-right><a href=http://www.reactric.com target=_blank class=reactric-powered-by-link><img src=http://res.cloudinary.com/dhhb1tde3/image/upload/c_scale,h_50/v1473257100/poweredbyreactric_qcw7tg.png></img></a></td></tr></table></div>");
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

    // --------- Variables --------- 

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
};

// ________________________________________________________

// Function that dynamically loads jQuery
// ________________________________________________________

function loadjQuery(url, success) {
    var script = document.createElement('script');
    script.src = url;
    var head = document.getElementsByTagName('head')[0],
        done = false;
    head.appendChild(script);
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function() {
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
            done = true;
            success();
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        }
    };
};

// ________________________________________________________

// Function that runs once the document is loaded
// ________________________________________________________

(function() {
    if (typeof jQuery == 'undefined') {
        loadjQuery('https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js', function() {
            // if jQuery is not loaded, we load it, and run the initialization function
            reactricInit(jQuery);
        });
    } else {
        // jQuery is loaded, so we run the initialization function
        reactricInit(jQuery);
    }
})();
