// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var formedFilter;
    var textFilter;
    var dataSource;
    var emptyFilter = ";;";

    WinJS.UI.Pages.define("/pages/items/items.html", {
        ready: function (element, options) {
            WinJS.Application.sessionState.currentPage = "items";

            var lV = document.getElementById("itemListView").winControl;
            lV.itemTemplate = itemTemplateFunction;
            lV.addEventListener("iteminvoked", itemInvoked);

            var roleFilterDiv = document.getElementById("itemCatFilter");
            roleFilterDiv.addEventListener("change", updateFilter, false);

            var typeFilterDiv = document.getElementById("itemQualityFilter");
            typeFilterDiv.addEventListener("change", updateFilter, false);

            var textFilterDiv = document.getElementById("itemTextFilter");
            textFilterDiv.addEventListener("input", updateFilter, false);
            textFilterDiv.addEventListener("blur", updateFilter, false);

            if (WinJS.Application.sessionState.itemFormedFilter) {
                formedFilter = WinJS.Application.sessionState.itemFormedFilter;
                prepareFilter();
            }

            var viewState = Windows.UI.ViewManagement.ApplicationView.value;
            var lV = document.getElementById("itemListView").winControl;

            if (viewState == Windows.UI.ViewManagement.ApplicationViewState.snapped) {
                lV.layout = { type: WinJS.UI.ListLayout };
            }
            else {
                lV.layout = { type: WinJS.UI.GridLayout, disableBackdrop: true };
            }

            /* Restore previous scroll location in item view */
            if (WinJS.Application.sessionState.itemsScroll) {
                msSetImmediate(function () {
                    console.log("restoring to: " + WinJS.Application.sessionState.itemsScroll);
                    lV.scrollPosition = WinJS.Application.sessionState.itemsScroll;
                });
            }
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            var lV = document.getElementById("itemListView").winControl;

            if (viewState == Windows.UI.ViewManagement.ApplicationViewState.snapped) {
                lV.layout = { type: WinJS.UI.ListLayout };
            }
            else {
                lV.layout = { type: WinJS.UI.GridLayout, disableBackdrop: true };
            }

            if (WinJS.Application.sessionState.itemFormedFilter) {
                formedFilter = WinJS.Application.sessionState.itemFormedFilter;
            }

            prepareFilter();

            var lV = document.getElementById("itemListView").winControl;
            if (WinJS.Application.sessionState.itemSelected)
                lV.ensureVisible(WinJS.Application.sessionState.itemSelected);
        }
    });

    function itemTemplateFunction(itemPromise) {
        return itemPromise.then(function (item) {
            var div = document.createElement("div");
            var textContainerDiv = document.createElement("div");
            textContainerDiv.setAttribute("class", "text-container");
            var img = document.createElement("img");
            img.src = "images/items/" + item.data.itemNameBasic + ".png";
            img.setAttribute("class", "item-img");
            div.appendChild(img);
            var h3 = document.createElement("h3");

            h3.innerText = item.data.itemName.toUpperCase();
            h3.setAttribute("class", item.data.itemQuality);

            var h5 = document.createElement("span");
            var itemcost = document.createElement("span");
            itemcost.textContent = item.data.itemCost;
            itemcost.setAttribute("class", "gold");

            var goldimg = document.createElement("img");
            goldimg.src = "images/icons/icon_gold.png";
            goldimg.setAttribute("class", "img-gold");

            h5.appendChild(goldimg);
            h5.appendChild(itemcost);

            textContainerDiv.appendChild(h3);
            textContainerDiv.appendChild(h5);

            div.appendChild(textContainerDiv);
            return div;
        });
    }

    function itemInvoked(args) {
        var item;

        if (dataSource)
            item = dataSource.getAt(args.detail.itemIndex);
        else
            item = Data.items.getAt(args.detail.itemIndex);

        var lV = document.getElementById("itemListView").winControl;

        WinJS.Application.sessionState.itemsScroll = lV.scrollPosition;
        console.log(lV.scrollPosition);

        WinJS.Navigation.navigate("/pages/itemDetail/itemDetail.html", { item: item, index: args.detail.itemIndex });
    }

    function updateFilter() {
        var filterNeedsUpdating = false;

        var e = document.getElementById("itemCatFilter");
        var catFilter = e.options[e.selectedIndex].id;

        e = document.getElementById("itemQualityFilter");
        var qualityFilter = e.options[e.selectedIndex].id;

        e = document.getElementById("itemTextFilter");
        var textFilter = e.value;

        var oldFormedFilter = WinJS.Application.sessionState.itemFormedFilter ? WinJS.Application.sessionState.itemFormedFilter : emptyFilter;
        formedFilter = catFilter + ";" + qualityFilter + ";" + textFilter;

        WinJS.Application.sessionState.itemFormedFilter = formedFilter;

        WinJS.Application.sessionState.itemCatFilter = catFilter;
        WinJS.Application.sessionState.itemQualityFilter = qualityFilter;
        WinJS.Application.sessionState.itemTextFilter = textFilter;

        if (oldFormedFilter != formedFilter)
            filterNeedsUpdating = true;

        if (filterNeedsUpdating)
            prepareFilter();
    }

    function prepareFilter() {
        var lV = document.getElementById("itemListView").winControl;
        var filtered = Data.items.createFiltered(filterFunction);

        function getItemGroupKey(item) {
            return item.itemCategory.toUpperCase();
        }

        function getItemGroupData(item) {
            return {
                title: item.itemCategory.toUpperCase()
            };
        }

        var groupedFiltered = filtered.createGrouped(getItemGroupKey, getItemGroupData);

        if (WinJS.Application.sessionState.itemCatFilter)
            document.getElementById(WinJS.Application.sessionState.itemCatFilter).setAttribute("selected", "selected");

        if (WinJS.Application.sessionState.itemQualityFilter)
            document.getElementById(WinJS.Application.sessionState.itemQualityFilter).setAttribute("selected", "selected");

        if (WinJS.Application.sessionState.itemTextFilter)
            document.getElementById("itemTextFilter").setAttribute("value", WinJS.Application.sessionState.itemTextFilter);

        lV.itemDataSource = groupedFiltered.dataSource;
        lV.groupDataSource = groupedFiltered.groups.dataSource;
        dataSource = groupedFiltered;
    }

    function filterFunction(item) {
        var result = true;

        if (formedFilter)
            var itemFilters = formedFilter.split(";");

        if (itemFilters) {
            var i = 0;
            for (i = 0; i < itemFilters.length; i++) {
                if (itemFilters[i] != "") {
                    if (item.itemTags.indexOf(itemFilters[i]) == -1)
                        result = false;
                }
            }
        }

        return result;
    }
})();
