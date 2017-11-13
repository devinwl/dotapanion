# dotapanion

I started this project to with the goal to learn WinJS and release a complete app on the Windows 8 Store.  I did eventually release the app onto the store - and it garnered ~500 downloads.  I started the app sometime around November 2012 and finished the first complete version by January 2013.  It was released on the app store shortly after.

I created an earlier version of the app using the Sencha Touch 2 framework with the intention of using PhoneGap to wrap the app and provide a native-like experience - although I soon discovered that the performance of all these wrappers and custom frameworks was terrible.  It was a choppy mess that didn't deliver anything close to a native experience.  The project was scrapped until a few months later when I tried again using WinJS.

The idea behind the app was to act as a companion (hence the name Dotapanion) while playing the game Dota 2.  Windows 8 supported a feature called Split View where you could have two apps running side by side.  I thought it would be cool to run my app while playing and use it to look up information.  Unfortunately for me this wasn't a great feeling experience - a fact I didn't discover until well into development of the app.  An important lesson learned to test your ideas early.

I wrote a few scripts to read and organize the game's data into a `.json` format for easier use.  Dota 2 stores most of its data in a proprietary format called VDF (which ends up being pretty close to JSON).  I created [keyvalues-php](https://github.com/devinwl/keyvalues-php) to parse these files using PHP.  Then I created [dota2-json](https://github.com/devinwl/dota2-json) (Dota to JSON - aren't I clever...) which takes the processed VDF file and formats it as JSON.  I would convert the VDF files into giant associative arrays in PHP, then output the arrays as JSON files.

The scripts I created for parsing the game data ended up being useful for creating other Dota 2 projects - namely [Rubick Trainer](https://github.com/devinwl/rubicktrainer) - which is a simple quiz game used to test in-game knowledge.

As for Dotapanion - I maintained the app for a short while, keeping up with game updates and adding more information into the app.  Not much ended up in the app that you couldn't find elsewhere in the Internet.  It was mostly data on heroes stats and the items boguht in-game.  I learned a lot while working on the project though - namely the experience of taking a project and actually shipping it, and providing maintenance updates.

Quick stats:
- 582 downloads
- 17 reviews

A review from a user:
> *Good clean app* by Dylan
> 5/5 stars
> Simple and straightforward. Would love to see you take a crack at porting this to windowsphone.