// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            WinJS.Application.sessionState.currentPage = "itemDetail";

            var item = options && options.item ? options.item : Heroes.heroes.getAt(0);
            WinJS.Application.sessionState.currentItem = item;
            document.getElementById("view-on-dotabuff").setAttribute("style", "");

            element.querySelector(".titlearea .pagetitle").textContent = item.itemName;
            element.querySelector(".item_header > img").src = "/images/items/" + item.itemNameBasic + ".png";
            element.querySelector(".item_goldcost").textContent = item.itemCost;
            element.querySelector(".item_lore").textContent = item.itemLore;
            element.querySelector(".item_info > p").textContent = item.itemDescription;
            var itemStats = element.querySelector(".item_stats");
            itemStats.textContent = "";

            if (item.itemPropSize > 0) {
                for (var i = 0; i < item.properties.length; i++) {
                    var property = item.properties[i];
                    if (property.itemProperty) {
                        var prop = formatProperty(property.itemPropertyId, property.itemProperty, property.itemPropertyDetail);
                        var li = document.createElement("li");
                        li.innerHTML = prop;
                        itemStats.appendChild(li);
                    }
                }

                if (item.itemDescription)
                    element.querySelector(".item_stats").setAttribute("class", "item_stats divider");
            } else
                element.querySelector(".item_stats").setAttribute("style", "display: none;");

            if (item.itemManaCost || item.itemCooldown) {
                if (item.itemManaCost)
                    element.querySelector(".item_manacost").innerHTML = format(item.itemManaCost);
                else
                    element.querySelector(".manacost").setAttribute("style", "display: none;");

                if (item.itemCooldown)
                    element.querySelector(".item_cooldown").innerHTML = format(item.itemCooldown);
                else
                    element.querySelector(".cooldown").setAttribute("style", "display: none;");

                if (item.itemDescription || item.itemPropSize > 0)
                    element.querySelector(".item_costs").setAttribute("class", "item_costs divider");

            } else {
                element.querySelector(".item_costs").setAttribute("style", "display: none;");
            }

            if (item.recipe.length > 0) {
                var itemRecipe = element.querySelector(".item_recipe_list");
                var itemRecipeItem = element.querySelector(".item_recipe_item");
                var itemRecipeItemRecipe = "<img src=\"/images/items/recipe.png\" /><div class=\"item_recipe_text\"><span class=\"component\">Recipe</span><br /><span class=\"gold\"><img src=\"/images/icons/icon_gold.png\" />" + item.itemRecipeCost + "</span></div>";
                itemRecipe.textContent = "";

                for (var i = 0; i < item.recipe.length; i++) {
                    var recipe_item = item.recipe[i];
                    var li = document.createElement("li");
                    li.innerHTML = itemRecipeItem.innerHTML;
                    li.querySelector("img").src = "/images/items/" + recipe_item.itemNameBasic + ".png";
                    li.querySelector(".quality").textContent = recipe_item.itemName;
                    li.querySelector(".quality").setAttribute("class", recipe_item.itemQuality);
                    li.querySelector(".item_recipe_goldcost").textContent = recipe_item.itemCost;

                    itemRecipe.appendChild(li);
                }

                if (item.itemRecipeCost != 0) {
                    var li = document.createElement("li");
                    li.innerHTML = itemRecipeItemRecipe;
                    itemRecipe.appendChild(li);
                }
            }
            else
                element.querySelector(".item_recipe").setAttribute("style", "display: none;");
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
            document.getElementById("view-on-dotabuff").setAttribute("style", "display: none");
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });

    function formatProperty(id, prop, val) {
        var property;
        val = val.split(' ');
        var i;
        for (i = 0; i < val.length; i++) {
            val[i] = '<em>'+val[i]+'</em>';
        }
        val = val.join(" / ");
        switch(id) {
            case "bonus_all_stats":
                property = '+ <span class="item_bonus">'+val+'</span> <em>All Attributes</em>';
                break;
            case "bonus_damage":
                property = '+ <span class="item_bonus">'+val+'</span> <em>Damage</em>';
                break;
            case "bonus_health_regen":
                property = '+ <span class="item_bonus">'+val+'</span> <em>HP Regeneration</em>';
                break;
            case "bonus_movement_speed":
                property = '+ <span class="item_bonus">'+val+'</span> <em>Movement Speed</em>';
                break;
            case "bonus_armor":
                property = '+ <span class="item_bonus">'+val+'</span> <em>Armor</em>';
                break;
            case "bonus_attack_speed":
                property = '+ <span class="item_bonus">'+val+'</span> <em>Attack Speed</em>';
                break;
            case "bonus_speed":
                property = '+ <span class="item_bonus">' + val + '</span> <em>Attack Speed</em>';
                break;
            case "bonus_strength":
                property = '+ <span class="item_bonus">'+val+'</span> <em>Strength</em>';
                break;
            case "bonus_agility":
                property = '+ <span class="item_bonus">'+val+'</span> <em>Agility</em>';
                break;
            case "bonus_intellect":
                property = '+ <span class="item_bonus">'+val+'</span> <em>Intelligence</em>';
                break;
            case "bonus_health":
                property = '+ <span class="item_bonus">'+val+'</span> <em>Health</em>';
                break;
            case "bonus_mana":
                property = '+ <span class="item_bonus">'+val+'</span> <em>Mana</em>';
                break;
            case "bonus_mana_regen":
                property = '+ <span class="item_bonus">'+val+'</span> <em>Mana Regeneration</em>';
                break;
            case "bonus_spell_resist":
                property = '+ <span class="item_bonus">'+val+'</span> <em>Spell Resistance</em>';
                break;
            case "bonus_evasion":
                property = '+ <span class="item_bonus">' + val + '</span> <em>Evasion</em>';
                break;
            case "bonus_stat":
                property = '+ <span class="item_bonus">' + val + '</span> <em>Selected Attribute</em>';
                break;
            case "movement_speed_percent_bonus":
                property = '+ <span class="item_bonus">' + val + '</span> <em>Movement Speed</em>';
                break;
            case "mana_regen":
                property = '+ <span class="item_bonus">' + val + '</span> <em>Mana Regeneration</em>';
                break;
            case "health_regen":
                property = '+ <span class="item_bonus">' + val + '</span> <em>HP Regeneration</em>';
                break;
            case "bonus_int":
                property = '+ <span class="item_bonus">' + val + '</span> <em>Intelligence</em>';
                break;
            case "tooltip_resist":
                property = '+ <span class="item_bonus">' + val + '</span> <em>Spell Resistance</em>';
                break;
            case "bonus_regen":
                property = '+ <span class="item_bonus">' + val + '</span> <em>HP Regeneration</em>';
                break;
            case "hp_regen":
                property = '+ <span class="item_bonus">' + val + '</span> <em>HP Regeneration</em>';
                break;
            default:
                if(prop) {
                    property = '<span class="item_prop">'+prop+'</span> <span class="item_bonus">'+val+'</span>';
                }
                else
                    property = '';
        }

        return property;
    }

    function format(string) {
        var str = string.split(' ');
        var i;
        for (i = 0; i < str.length; i++) {
            str[i] = '<em>' + str[i] + '</em>';
        }

        if (Array.prototype.unique(str).length == 1)
            return str[0];

        return str.join(" / ");
    }

    Array.prototype.unique = function () { var o = {}, i, l = this.length, r = []; for (i = 0; i < l; i += 1) o[this[i]] = this[i]; for (i in o) r.push(o[i]); return r; };
})();
