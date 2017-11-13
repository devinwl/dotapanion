// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                WinJS.Application.onsettings = function (e) {
                    e.detail.applicationcommands = {
                        "legalNotices": { href: "pages/legalNotices/legalnotices.html", title: "Legal notices" },
                        "aboutPane": { href: "pages/about/about.html", title: "About" }
                    };
                    WinJS.UI.SettingsFlyout.populateSettings(e);
                }
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }

            var URL_HEROES_JSON = "http://wonderfulfailure.com/dotapanion/heroes.json";
            var URL_ITEMS_JSON = "http://wonderfulfailure.com/dotapanion/items.json";
            var URL_GLOSSARY_JSON = "http://wonderfulfailure.com/dotapanion/glossary.json";
            var LOCAL_HEROES_JSON = "/heroes.json";
            var LOCAL_ITEMS_JSON = "/items.json";
            var LOCAL_GLOSSARY_JSON = "/glossary.json";
            var URL_DOTA2_BLOG_FEED = 'http://blog.dota2.com/feed/';
            var heroesParsed = "";
            var itemsParsed = "";
            var heroesList = new WinJS.Binding.List;
            var itemsList = new WinJS.Binding.List;
            var glossaryList = new WinJS.Binding.List;

            var heroes = WinJS.xhr({
                url: URL_HEROES_JSON,
                headers: {
                    "If-Modified-Since": "Mon, 27 Mar 1972 00:00:00 GMT"
                }
            });
            heroes.then(
                function (xhr) {
                    heroesParsed = JSON.parse(xhr.responseText).heroes;
                    loadData(heroesParsed, heroesList);
                },
                function (xhr) {
                    return WinJS.xhr({ url: LOCAL_HEROES_JSON, }).then(
                        function (response) {
                            heroesParsed = JSON.parse(response.responseText).heroes;
                            loadData(heroesParsed, heroesList);
                        },
                        function (error) {
                            WinJS.log && WinJS.log("Could not load online or local heroes JSON file");
                        });
                }
            )
            .then(function () {
                return WinJS.xhr({
                    url: URL_ITEMS_JSON,
                    headers: {
                        "If-Modified-Since": "Mon, 27 Mar 1972 00:00:00 GMT"
                    }
                });
            })
            .then(
                function (xhr) {
                    var items_json = JSON.parse(xhr.responseText).items;
                    loadData(items_json, itemsList);
                },
                function (xhr) {
                    return WinJS.xhr({ url: LOCAL_HEROES_JSON, }).then(
                        function (response) {
                            loadData(JSON.parse(response.responseText).heroes, heroesList);
                        },
                        function (error) {
                            WinJS.log && WinJS.log("Could not load online or local items JSON file");
                        });
                }
            )
            .then(function () {
                return WinJS.xhr({
                    url: URL_GLOSSARY_JSON,
                    headers: {
                        "If-Modified-Since": "Mon, 27 Mar 1972 00:00:00 GMT"
                    }
                });
            })
            .then(
                function (xhr) {
                    var glossary_json = JSON.parse(xhr.responseText).glossary;
                    loadData(glossary_json, glossaryList);
                },
                function (xhr) {
                    return WinJS.xhr({ url: LOCAL_GLOSSARY_JSON, }).then(
                        function (response) {
                            loadData(JSON.parse(response.responseText).glossary, glossaryList);
                        },
                        function (error) {
                            WinJS.log && WinJS.log("Could not load online or local glossary JSON file");
                        });
                }
            )
            .then(
                function () {
                    return WinJS.xhr({
                        url: URL_DOTA2_BLOG_FEED,
                        headers: {
                            "If-Modified-Since": "Mon, 27 Mar 1972 00:00:00 GMT"
                        }
                    }).then(
                        function (response) {
                            var x = 0;
                        },
                        function (error) {
                            var y = 0;
                        }
                    )
                }
            )
            .then(
                function () {
                    return loadHeroDataAsync(heroesParsed);
                }
            )
            .done(function () {

                function compareGroups(leftKey, rightKey) {
                    return leftKey.charCodeAt(0) - rightKey.charCodeAt(0);
                }

                function getGroupKey(item) {
                    return item.heroTeam.toUpperCase();
                }

                function getGroupData(item) {
                    return {
                        title: item.heroTeam.toUpperCase()
                    };
                }

                var groupedHeroes = heroesList.createGrouped(getGroupKey, getGroupData, compareGroups);

                function getItemGroupKey(item) {
                    return item.itemCategory.toUpperCase();
                }

                function getItemGroupData(item) {
                    return {
                        title: item.itemCategory.toUpperCase()
                    };
                }

                var groupedItems = itemsList.createGrouped(getItemGroupKey, getItemGroupData);

                var publicMembers = {
                    heroes: groupedHeroes,
                    items: groupedItems,
                    glossary: glossaryList
                };

                WinJS.Namespace.define("Data", publicMembers);

                args.setPromise(WinJS.UI.processAll().then(function () {
                    document.getElementById("heroes").addEventListener("click", heroesTab, false);
                    document.getElementById("items").addEventListener("click", itemsTab, false);

                    WinJS.Application.sessionState.currentPage = "heroes";

                    document.getElementById("progressRingText").setAttribute("style", "display: none;");

                    if (nav.location) {
                        nav.history.current.initialPlaceholder = true;
                        return nav.navigate(nav.location, nav.state);
                    } else {
                        return nav.navigate(Application.navigator.home);
                    }
                }));
            });
        }
    });

    function heroesTab() {
        if (WinJS.Application.sessionState.currentPage != "heroes") {
            WinJS.Navigation.navigate("/pages/heroes/heroes.html");
            document.getElementById("appbar").winControl.hide();
        }
    }

    function itemsTab() {
        if (WinJS.Application.sessionState.currentPage != "items") {
            WinJS.Application.sessionState.currentPage = "items";
            WinJS.Navigation.navigate("/pages/items/items.html");
            document.getElementById("appbar").winControl.hide();
        }
    }

    function dotabuffTab() {
        var currentItem = WinJS.Application.sessionState.currentItem;
        var itemName;
        var uri;

        if (currentItem) {
            if (currentItem.heroName) {
                itemName = currentItem.heroName;
                uri = 'https://dotabuff.com/heroes/';
            }
            else {
                itemName = currentItem.itemName;
                uri = 'https://dotabuff.com/items/';
            }

            var itemNameURI = itemName.toLowerCase().replace(/ /g, "-").replace(/'/g, "");
            var full_uri = uri + itemNameURI

            var uri = new Windows.Foundation.Uri(full_uri);
            Windows.System.Launcher.launchUriAsync(uri);
        }
    }

    function loadData(json, list) {
        for (var i = 0; i < json.length; i++) {
            list.push(json[i]);
        }
    }

    function loadHeroDataAsync(heroesJSON) {
        var y = 0;
        return new WinJS.Promise(function (c, e, p) {
            for (var i = 0; i < heroesJSON.length; i++) {
                downloadImageAsync(heroesJSON[i].heroNameBasic).then(
                    function (complete) {
                    },
                    function(error) {
                        console.log('got an error');
                    });
            }
            c();
        });
    }

    function downloadImageAsync(name) {
        return new WinJS.Promise(function (c, e, p) {
            var url = 'ms-appx:///images/heroes/' + name + '.png';
            return WinJS.xhr({ url: url }).then(
                function (success) {
                    c();
                },
                function (error) {
                    console.log('need to download: ' + name);
                    e();
                },
                function (progress) {
                    p();
                }
            );
        });
    }

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();
})();
