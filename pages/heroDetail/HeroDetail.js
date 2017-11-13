// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/heroDetail/heroDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            WinJS.Application.sessionState.currentPage = "heroDetail";

            var item = options && options.item ? options.item : Data.heroes.getAt(0);
            WinJS.Application.sessionState.currentItem = item;

            element.querySelector(".titlearea .pagetitle").textContent = item.heroName;
            var heroImg = element.querySelector(".hero_header > img");
            heroImg.src = "/images/heroes/" + item.heroNameBasic + ".png";
            element.querySelector(".hero_team_type > .type").textContent = item.heroType;
            element.querySelector(".hero_team_type > .team").textContent = item.heroTeam == "radiant" ? "The Radiant" : "The Dire";
            var heroRolesUl = element.querySelector(".hero_roles > ul");
            var heroRolesLi = element.querySelector(".hero_roles > ul > li");
            heroRolesUl.textContent = "";

            for (var i = 0; i < item.roles.length; i++) {

                var role = item.roles[i].role;
                var li = document.createElement("li");
                li.innerHTML = heroRolesLi.innerHTML;
                li.querySelector("img").src = "/images/icons/roles/" + role + ".png";
                li.querySelector("span").textContent = role;

                heroRolesUl.appendChild(li);
            }

            element.querySelector("." + item.heroAttr).setAttribute("class", "prim_attr");

            var heroSound = element.querySelector('.hero_sound');
            heroSound.textContent = "";

            element.querySelector(".strBase").textContent = item.heroBaseStr;
            element.querySelector(".strPer").textContent = item.heroStrPerLevel;
            element.querySelector(".agiBase").textContent = item.heroBaseAgi;
            element.querySelector(".agiPer").textContent = item.heroAgiPerLevel;
            element.querySelector(".intBase").textContent = item.heroBaseInt;
            element.querySelector(".intPer").textContent = item.heroIntPerLevel;

            element.querySelector(".heroBaseDmg").textContent = item.heroBaseDamage;
            element.querySelector(".heroBaseMoveSpeed").textContent = item.heroMovementSpeed;
            element.querySelector(".heroBaseArmor").textContent = item.heroBaseArmor;

            element.querySelector(".hero_bio_text").innerHTML = item.heroBio;

            var heroAbilities = element.querySelector(".hero_abilities");
            var heroAbility = element.querySelector(".hero_abilities > .box");
            heroAbilities.textContent = "";

            for (var i = 0; i < item.abilities.length; i++) {
                var ability = item.abilities[i];
                var div = document.createElement("div");
                div.setAttribute("class", "box");
                div.innerHTML = heroAbility.innerHTML;

                div.querySelector(".hero_skill_icon").src = "/images/spellicons/" + ability.abilityNameBasic + ".png";
                div.querySelector(".hero_skill_name").textContent = ability.abilityName;

                if (ability.abilityBehavior != "")
                    div.querySelector(".hero_skill_behavior").innerHTML = "Ability: <em>" + ability.abilityBehavior + "</em><br />";
                else
                    div.querySelector(".hero_skill_behavior").setAttribute("style", "display: none;");

                if (ability.abilityTarget != "")
                    div.querySelector(".hero_skill_target").innerHTML = "Affects: <em>" + ability.abilityTarget + "</em><br />";
                else
                    div.querySelector(".hero_skill_target").setAttribute("style", "display: none;");

                if (ability.abilityDamageType != "")
                    div.querySelector(".hero_skill_damage").innerHTML = "Damage: <em>" + ability.abilityDamageType + "</em><br />";
                else
                    div.querySelector(".hero_skill_damage").setAttribute("style", "display: none;");

                div.querySelector(".hero_skill_descr").textContent = ability.abilityDescription;

                if (!isEmpty(ability.abilityManaCost))
                    div.querySelector(".hero_skill_manacost").innerHTML = format(ability.abilityManaCost);
                else
                    div.querySelector(".manacost").setAttribute("style", "display: none;");

                if (!isEmpty(ability.abilityCooldown))
                    div.querySelector(".hero_skill_cooldown").innerHTML = format(ability.abilityCooldown);
                else
                    div.querySelector(".cooldown").setAttribute("style", "display: none;");

                div.querySelector(".hero_skill_lore").textContent = ability.abilityLore;

                var heroAbilityProperties = div.querySelector(".hero_skill_properties_right");
                heroAbilityProperties.textContent = "";

                for (var j = 0; j < ability.properties.length; j++) {
                    var property = ability.properties[j];
                    var span = document.createElement("span");
                    if (property.abilityProperty != "") {
                        span.innerHTML = propertyFormat(property.abilityProperty) + " " + format(property.abilityPropertyDetail) + "<br />";
                        heroAbilityProperties.appendChild(span);
                    }

                }

                heroAbilities.appendChild(div);
            }


        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            window.scrollTo(0, 0);
        }
    });

    function isEmpty(string) {
        var str = string.split(' ');
        if(Array.prototype.unique(str).length == 1)
            str = Array.prototype.unique(str)[0];

        if(string == 0)
            return true;
        else if(str == 0.0)
            return true;
        else if(str == "")
            return true;
        else
            return false;
    }

    function propertyFormat(string) {
        if(!string.toLowerCase().indexOf("scepter"))
            return '<span class="scepter">'+string+'</span>';
        else
            return string;
    }

    function format(string) {
        var str = string.split(' ');
        var i;
        for (i = 0; i < str.length; i++) {
            str[i] = '<em>'+str[i]+'</em>';
        }

        if(Array.prototype.unique(str).length == 1)
            return str[0];

        return str.join(" / ");
    }

    function playSound(path) {
        var sound = document.createElement('audio');
        sound.src = path;
        sound.autoplay = true;
    }

    Array.prototype.unique = function () { var o = {}, i, l = this.length, r = []; for (i = 0; i < l; i += 1) o[this[i]] = this[i]; for (i in o) r.push(o[i]); return r; };
})();
