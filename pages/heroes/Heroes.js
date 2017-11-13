// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var formedFilter;
    var textFilter;
    var dataSource;
    var emptyFilter = ";;;";

    WinJS.UI.Pages.define("/pages/heroes/heroes.html", {
        ready: function (element, options) {
            WinJS.Application.sessionState.currentPage = "heroes";

            var lV = document.getElementById("heroListView").winControl;
            lV.itemTemplate = heroTemplateFunction;
            lV.addEventListener("iteminvoked", itemInvoked);

            var roleFilterDiv = document.getElementById("heroRoleFilter");
            roleFilterDiv.addEventListener("change", updateFilter, false);

            var typeFilterDiv = document.getElementById("heroTypeFilter");
            typeFilterDiv.addEventListener("change", updateFilter, false);

            var attrFilterDiv = document.getElementById("heroAttrFilter");
            attrFilterDiv.addEventListener("change", updateFilter, false);

            var textFilterDiv = document.getElementById("heroTextFilter");
            textFilterDiv.addEventListener("input", updateFilter, false);
            textFilterDiv.addEventListener("blur", updateFilter, false);

            if (WinJS.Application.sessionState.formedFilter) {
                formedFilter = WinJS.Application.sessionState.formedFilter;
                prepareFilter();
            }

            /* Restore previous scroll location in heroes view */
            if (WinJS.Application.sessionState.heroesScroll) {
                msSetImmediate(function () {
                    lV.scrollPosition = WinJS.Application.sessionState.heroesScroll;
                });
            }

            var viewState = Windows.UI.ViewManagement.ApplicationView.value;
            var lV = document.getElementById("heroListView").winControl;

            if (viewState == Windows.UI.ViewManagement.ApplicationViewState.snapped) {
                lV.layout = { type: WinJS.UI.ListLayout };
            }
            else {
                lV.layout = { type: WinJS.UI.GridLayout };
            }
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            var viewState = Windows.UI.ViewManagement.ApplicationView.value;
            var lV = document.getElementById("heroListView").winControl;

            if (viewState == Windows.UI.ViewManagement.ApplicationViewState.snapped) {
                lV.layout = { type: WinJS.UI.ListLayout };
            }
            else {
                lV.layout = { type: WinJS.UI.GridLayout };
            }

            if (WinJS.Application.sessionState.formedFilter) {
                formedFilter = WinJS.Application.sessionState.formedFilter;
            }

            prepareFilter();

            var lV = document.getElementById("heroListView").winControl;
            if (WinJS.Application.sessionState.heroSelected)
                lV.ensureVisible(WinJS.Application.sessionState.heroSelected);
        }
    });

    function heroTemplateFunction(itemPromise) {
        return itemPromise.then(function (item) {
            var div = document.createElement("div");
            var textContainerDiv = document.createElement("div");
            textContainerDiv.setAttribute("class", "text-container");
            var img = document.createElement("img");

            var miniHero = document.createElement('div');
            var miniHeroImg = document.createElement('img');
            miniHeroImg.src = "images/miniheroes/" + item.data.heroNameBasic + ".png";
            miniHero.setAttribute('class', 'mini');
            miniHero.appendChild(miniHeroImg);

            img.src = "images/heroes/" + item.data.heroNameBasic + ".png";
            img.setAttribute('class', 'full');

            div.appendChild(img);
            div.appendChild(miniHero);

            var h3 = document.createElement("h3");

            var roles = [];

            for (var i = 0; i < item.data.roles.length; i++) {
                roles[i] = "" + item.data.roles[i].role;
            }

            roles = roles.join(", ");

            h3.innerText = item.data.heroName.toUpperCase();

            if (item.data.heroAttr == "str") {
                h3.setAttribute('class', 'str');
            } else if (item.data.heroAttr == "agi") {
                h3.setAttribute('class', 'agi');
            } else {
                h3.setAttribute('class', 'int');
            }

            var h5 = document.createElement("h5");
            h5.textContent = roles;

            textContainerDiv.appendChild(h3);
            textContainerDiv.appendChild(h5);

            div.appendChild(textContainerDiv);
            return div;
        });
    }

    function itemInvoked(args) {
        var item;

        if(dataSource)
            item = dataSource.getAt(args.detail.itemIndex);
        else
            item = Data.heroes.getAt(args.detail.itemIndex);

        var lV = document.getElementById("heroListView").winControl;

        WinJS.Application.sessionState.heroesScroll = lV.scrollPosition;

        WinJS.Navigation.navigate("/pages/heroDetail/heroDetail.html", { item: item, index: args.detail.itemIndex });
    }

    function updateFilter() {
        var filterNeedsUpdating = false;

        var e = document.getElementById("heroRoleFilter");
        var roleFilter = e.options[e.selectedIndex].id;

        e = document.getElementById("heroTypeFilter");
        var typeFilter = e.options[e.selectedIndex].id;

        e = document.getElementById("heroAttrFilter");
        var attrFilter = e.options[e.selectedIndex].id;

        e = document.getElementById("heroTextFilter");
        var textFilter = e.value;

        var oldFormedFilter = WinJS.Application.sessionState.formedFilter ? WinJS.Application.sessionState.formedFilter : emptyFilter;

        formedFilter = roleFilter + ";" + typeFilter + ";" + attrFilter + ";" + textFilter;

        WinJS.Application.sessionState.formedFilter = formedFilter;

        WinJS.Application.sessionState.typeFilter = typeFilter;
        WinJS.Application.sessionState.attrFilter = attrFilter;
        WinJS.Application.sessionState.roleFilter = roleFilter;
        WinJS.Application.sessionState.textFilter = textFilter;

        if (oldFormedFilter != formedFilter)
            filterNeedsUpdating = true;

        if(filterNeedsUpdating)
            prepareFilter();
    }

    function prepareFilter() {
        var lV = document.getElementById("heroListView").winControl;
        var filtered = Data.heroes.createFiltered(filterFunction);

        if (WinJS.Application.sessionState.roleFilter)
            document.getElementById(WinJS.Application.sessionState.roleFilter).setAttribute("selected", "selected");

        if (WinJS.Application.sessionState.attrFilter)
            document.getElementById(WinJS.Application.sessionState.attrFilter).setAttribute("selected", "selected");

        if (WinJS.Application.sessionState.typeFilter)
            document.getElementById(WinJS.Application.sessionState.typeFilter).setAttribute("selected", "selected");

        if (WinJS.Application.sessionState.textFilter)
            document.getElementById("heroTextFilter").setAttribute("value", WinJS.Application.sessionState.textFilter);

        dataSource = filtered;

        lV.itemDataSource = filtered.dataSource;
    }

    function filterFunction(item) {
        var result = true;

        if(formedFilter)
            var heroFilters = formedFilter.split(";");

        if (heroFilters) {
            var i = 0;
            for (i = 0; i < heroFilters.length; i++) {
                if (heroFilters[i] != "") {
                    if (item.heroTags.indexOf(heroFilters[i]) == -1)
                        result = false;
                }
            }
        }
                    
        return result;
    }

    function updateSorting() {
        dataSource = Data.heroes.createSorted(descComp);
    }

    function descComp(first, second) {
        if (first == second)
            return 0;
        else if (first > second)
            return 1;
        else
            return -1;
    }
})();
