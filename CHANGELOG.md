# Change Log

## 88.5-1.6.2 [Terminal Wallpaper support]

- Wallpaper now shows up on the terminal for the `1.83.1` builds. Please re-install your wallpaper for this to take effect.

## 88.5-1.6.1 [Cleanups]

- Cleaned up build process to use correct colors.
- Renamed stuff to reflect `main` branch rename. 

## 88.4-1.6.0 [VS Code Web Support]

- Extension now supported in [VSCode for the web](https://code.visualstudio.com/docs/editor/vscode-web).
- Added better checksum restoration error message.
- Updated Sagiri's syntax highlighting color a bit.

## 88.3-1.5.2 [Hide Watermark Restore]

- Restored hide watermark functionality for VSCode 1.75.0. Please re-run the hide watermark command for this to take effect.

![Hidden Watermark](https://user-images.githubusercontent.com/15972415/216770850-7dc66024-78f5-4503-ae15-2dc087def6cd.png)

## 88.3-1.5.1 [Terminal Wallpaper Bugfix]

- Fixed wallpaper rendering issue terminals of VSCode 1.74.3. Please re-install your wallpaper for this to take effect.

![Terminal](https://user-images.githubusercontent.com/15972415/213933498-b8d0697a-46d2-4a5f-ab43-830d9fd8231a.png)

## 88.3-1.5.0 [Semantic Highlighting]

- Themes now support [semantic highliglighting](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#semantic-coloring-in-color-themes). Which I tried to make as similar to [the WebStorm plugin syntax highlighting](https://github.com/doki-theme/doki-theme-jetbrains). 
  - If you don't like what I did, then you can always add `"editor.semanticHighlighting.enabled": false,` to your `settings.json` in your VSCode to turn off semantic highlighting :)

![Comparison](https://user-images.githubusercontent.com/15972415/209368481-0c8a2d07-4195-40d1-9cd7-994833a71091.png)

## 88.3-1.4.0 [Re-Brand]

- Re-Branded extension from `The Doki Theme` to just `Doki Theme`.
- Updated extension icon to match the newest Doki Theme logo.
- Prevents installation of asset that is a directory (for the most part).
- Updated XMas Chocola's theme.

## 88.1-1.3.2 [Sticker Fix Revisited]

- Remember what I last said? Well that was a lie, I did it correctly this time. I also am including the `z-index` in the `doki.sticker.css` setting so you can update it for your custom setup.

## 88.1.3.1 [Sticker Z-Index Fix]

- Placing the sticker at the proper z-index such that it no longer blocks the: Notifications & Status Bar Tooltips. Please re-install your sticker for this to take effect!

# 88.1-1.3.0 [Darling]

Best Girl just got _better_. ❤️

![Best Girl](https://doki.assets.unthrottled.io/misc/best_girl.png)

_Zero Two's Not Just A Cutie. ;)_

**4 New Themes!**

- I decided that I didn't have enough Zero Two themes, so I fixed that. She now has a new top-tier dark hacker theme: `Obsidian`. I also felt like Red Zero Two doesn't get enough attention, so I added a light `Sakura` theme which features her as she was as a child. With all these new Zero Two themes, I thought it would be best to rename the existing dark & light themes to `Rose` & `Lily` respectively.
- It wouldn't be the _Darling_ release if I didn't include Hiro as well. (Dark Theme)
- Lastly, this is the first release with a duo theme! (Nao's doesn't count, I just wanted the melon meme.) Just to pad my Zero Two theme stats, I've now got a Hiro & Zero Two couples' dark theme.

### Other Stuff

- Desaturated Itsuki's theme a bit.
- It was brought to my attention that I cannot spell "Rimuru".
- Zero Two's Obsidian theme is the default theme now.

# 84.2-1.3.0 [Enhancements n Stuff]

- Added the ability to control the position & size of the sticker using the `doki.sticker.css` configruation property.
- Fixed artifacted background images on the extension list tree & settings UI selected config (be sure to re-install your wallpaper for this to take effect).
- Restored asset installation on code-server (please be sure to clear caches and hard reload!)
- Added Remote Development Server/SSH connection asset installation help instructions.

# 84.2-1.2.1 [Small Dart Enhancement]

- Enhanced Dart syntax highlighting a bit.

# 84.1-1.2.0 [Light Theme Release]

![v84 Girls](https://doki.assets.unthrottled.io/misc/v84_girls.png)

This release is not for my Dark Theme Normies. Dark themes are nice, but I like Light Themes too (and my Dark Theme Normies). I'm currently trying new things out. Sorry in advance if I made your eyes bleed. I might tweak some of them as time goes on, still not 100% on what looks good & also is a fun color.

**6 New Light Themes!**

- Tired & broken down programmers rejoice! Even though you will never be pampered by a real Fox-demigod, you can now at least code with one. Let "The Helpful Fox Senko-san" watch over you as complete your tickets. You can almost feel the "おかえりなのじゃ" you will never get 😭
- I decided to complete my Quintessential Quintuplets collection by adding the oldest and youngest quint: Nakano Ichika & Nakano Itsuki.
- Tomori Nao, from Charlotte, has an interesting dichotomy when it comes to her personality. She is super cute tho.
- Have I ever seen Code Geass? No. Can I appreciate C.C. without having seen the anime? Yeah buddy.
- Guess while I'm talking about "anime I haven't seen but, chose to make a theme because the girl is pretty." We now have Yuzuriha Inori from Guilty Crown.

### Other Stuff

- Adjusted Sayori's dark diff deleted color & updated Satsuki's light autocomplete letter match color.

# 78.2-1.2.0 [Asset Settings & Custom Status Bar Name]

- Added the following settings that allow you to control what assets get installed during the `Install Wallpaper` actions.
  - `doki.background.enabled`: Whether you want an image in your empty editor background when when running the 'Install Wallpaper' command.
  - `doki.wallpaper.enabled`: Whether you want an image on top of your code editor, when running the 'Install Wallpaper' command.
- Enhanced the 'Settings (UI)' wallpaper experience.
- You can also set your own name that shows up next to the ❤ in the status bar now with the `doki.statusbar.name` setting. 

# 78.2-1.1.0 [Themed Bracket Pair Colorization]

- Since VS Code 1.67, [bracket pair colorization](https://code.visualstudio.com/updates/v1_67#_bracket-pair-colorization-enabled-by-default) is on by default. Well the default colors where cramping my style, so I fixed that. If you don't what I did, you can customize it yourself [search for "editorBracketHighlight.foreground" on this page](https://code.visualstudio.com/api/references/theme-color#editor-colors) and also see [customizing a color theme](https://code.visualstudio.com/docs/getstarted/themes#_customizing-a-color-theme).

![Themed Brace Matching](https://user-images.githubusercontent.com/15972415/167956580-ba51862a-8d31-4d1a-9cbe-fb3676f33152.png)

# 78.2-1.0.2 [Major Theme Syntax Coloring Updates]

- **Major Updates** to syntax highlighting colors to these themes:
  - Asuna Dark
  - Beatrice
  - Emilia Light.
  - Ibuki Light
  - Monika Dark/Light
  - Natsuki Dark/Light
  - Sayori Dark/Light
  - Yuri Dark/Light
- Minor syntax highlighting updates to these themes: Nakano Miku, Megumin, Mai Dark, Ryuko Dark, Tohsaka Rin,
  Rias: Crimson, Mai Light, and Asuna Light
- Small syntax highlighting usability updates to these themes: Zero Two Dark, Yukino, Hanekawa,
  Nagatoro, Rei, Astolfo, Echidna, Shima Rin, Sonoda Umi, Kurisu, & Ishtar Dark
- Made the background art brighter for: Satsuki Dark & Asuna Dark
- Made background art dimmer for: Yuri Light.

#### Motivation

I am in a position where I will now regularly be using my light themes more often. I am also planning on adding more.
Most of my light themes were created a long time ago and my tastes have evolved over time.
I have taken the time to revisit a fair number of my legacy themes, light and dark.

Thank you for your understanding!

# 78.0-1.0.2 [The Boys]

I'm trying to bring in a bit of inclusion.

**4 New Dark Themes!**

- I can already hear you now, "Rimuru Tempest, from 'That Time I Got Reincarnated as a Slime', is not a boy. They are the best genderless slime, get your facts correct." Yeah well....shut up.
- Next, is one of the S ranked heroes in the 'One Punch Man' universe, Genos.
- After that, is the smug smile of Yukihira Soma from Shokugeki no Soma. 
- Lastly, I am going to be honest, I haven't seen Haikyu. I just wanted a Indigo & Orange based theme. So here is Hinata Shoyo.

![v78 Bois](https://doki.assets.unthrottled.io/misc/v78_bois.png)

### Other Stuff

- Updated some of Rory, Ram, & Rem's syntax highlighting colors to be more usable.

# 74.2.1.0.2 [Unsupported Status Help]

- Added some guidance to users who will have issues with removing the [Unsupported] warning when installing assets.

# 74.2-1.0.1 [Enhanced Usability & Stuff]

- Increased badge icon foreground constrast.
- Increased usability of Raphtalia's, Yukino's, & Kanna's link colors.
- Darkened Nino's theme some.
- Removed the Zalgo Text from Š̸̘͚̼͎̯̙̣̱̎̋̐͒a̴̖̟̠̳̤͙̟͂̂͑̐͜ỷ̵̧̨̞̠̖̠o̴̧͍̗̬̎̓͆̔͝ͅr̴̡̮̟͈͠ͅi̴̡̨͓͈̬̗̺̍́̃̇̓'s dark theme name, so you can search for her dark theme now.

# 74.1-1.0.0 [Synapse break. Vanishment, this world!]

**4 New Dark Themes!**

- Decimate errors in the code alongside the Wicked Lord Shingan. Let your inner fantasies go rampant with Rikka Takanashi from: "Love, Chuunibyou, and Other Delusions". 
- It is comfy time! Don't let feature requests stress you out, because you can now code with Nadeshiko from Yuru Camp. 
- A Certain Scientific RailGun go: bzzzzzzt. Zap bugs out of existence with the electromaster Mikoto Misaka.
- Raccoon + Tanuki = one really cute cinnamon bun. Enjoy your time coding with Raphtalia from: "Rising of the Shield Hero."

![v74 Girls](https://doki.assets.unthrottled.io/misc/v74_girls.png)

### Other Stuff

- Updated Syntax Highlight & Look and Feel changes for the following legacy themes: Ibuki Dark, Astolfo, Aqua, Natsuki Light, Hatsune Miku, Christmas Chocola, Emilia Dark, Beatrice, Ram, and Rem.

# 19.0.0 [Holiday Release]

**3 New Dark Themes!**
 
- Celebrate Christmas with Chocola from the NekoPara Series!
_I lied about Shigure being the last addition from NekoPara._

- The 4th of July now just got even better, now that you can code with Essex from Azur Lane.
If you prefer a more canon experience, Essex's theme also has **secondary content** with the Eagle Union branding.

- Even though I missed this year's Halloween, I've got something to look forward to in 2022.
Yotsuba, from The Quintessential Quintuplets, isn't 2spooky4me.


![v22 Girls](https://doki.assets.unthrottled.io/misc/v22_girls.png)

#### Other Stuff

- Moved Tohsaka Rin's wallpaper over to the right.
- Not attempting to install custom assets when config is not a path to a file.

# 18.0.0 [Jahy-sama Will Not Be Discouraged!]

**1 New Theme!**

Featuring the Dark World's Second in Command: Jahy!

![v21 Girl](https://doki.assets.unthrottled.io/misc/v21_girl.png)


# 17.0.0 [Only for Onii-chan]

**3 New Themes!**

Last addition from the NekoPara Series:

- Minaduki Shigure (Light Theme)

From the dumpster fire of a series, "EroManga Sensei":

- Izumi Sagiri (Dark Theme)

From the smaller burning trash heap, "OreImo (My little sister cannot be this cute)":

- Kousaka Kirino (Dark Theme)

Anime is trash...._and so am I_.

![v20 Girls](https://doki.assets.unthrottled.io/misc/v20_girls.png)

# 16.1.0 [Consistent JavaScript Syntax]

- Spent the time to actually colorize the JavaScript & TypeScript tokens to be more consistent with the JetBrains Syntax Highlighting. (More colorful mix!)

![Syntax Updates](https://user-images.githubusercontent.com/15972415/133911128-5d6d72f6-152b-4a21-891b-990323b558ce.png)



# 16.0.0 [KillLaKill Alt. Themes]

**2 New Themes!**

- Ryuko Light
- Satsuki Dark

![v19 Girls](https://doki.assets.unthrottled.io/misc/v19_girls.png)


# 15.3.0 [Auto Restoration]

- Added the **Restore Assets** action that allows you to quickly re-install assets after a VSCode update. Plugin will attempt to restore assets on first detection of VSCode update.
- Enhanced the wallpaper in the Welcome Screen.

# 15.2.0 [Hide Watermark]

- Added the **Hide VSCode Watermark** command that...well... hides the VS Code watermark that shows when all editor tabs are closed.

![Hidden Watermark](https://user-images.githubusercontent.com/15972415/130338907-3105bf84-5715-4488-879a-db58c5c4c1cb.png)


# 15.1.1 [Asset Installation UX]

- Installation progress notification goes away after install. [#107](https://github.com/doki-theme/doki-theme-vscode/issues/107)
- Updated verbage on installation asset success notification. [#106](https://github.com/doki-theme/doki-theme-vscode/issues/106)

# 15.1.0 [Search & Selection Differentiation]

- Made it easier to differentiate the search & selection background colors for all **61** themes. <sup><sup>Some days I question my current life choices....</sup></sup>

![Search & Selection Differentiation](https://user-images.githubusercontent.com/15972415/129452488-70c60425-68fa-4b5d-88e1-207bff582ad0.png)

# 15.0.1 [Modal Window Enhancement]

- Stylized the secondary button in the VS Code modal window to match the theme.

![Just Trust Me, Bro](https://user-images.githubusercontent.com/15972415/129116241-f24404dd-2cb7-4858-8a0b-034e5d914b78.gif)

# 15.0.0 [NekoPara OneeSan Vol.]

## 4 New Themes!!

- Maple (Light/Dark)
- Cinnamon (Dark)
- Azuki (Dark)

![v18 Girls](https://doki.assets.unthrottled.io/misc/v18_girls.png)

# 14.2.0 [Auto-Checksum Fix]

- Plugin automatically fixes VSCode's checksums on bundled/custom asset installation/removal. Just close all instances of VSCode and start it back up to get rid of the annoying `Unsupported` error.

# 14.1.1 [Settings UI Enhancement]

- Updated the VSCode [Settings UI](https://code.visualstudio.com/docs/getstarted/settings) to support installed wallpapers!
![Screenshot from 2021-07-17 14-27-59](https://user-images.githubusercontent.com/15972415/126047756-2410b041-09bb-4783-8a33-f05f47869891.png)


# 14.1.0 [Custom Assets]

Added the ability for you to add your own assets to be used by the themes!
Please see the [README.md](https://github.com/doki-theme/doki-theme-vscode/tree/main#custom-assets) for more details.

| **Custom Sticker** | **Custom Background** |
| --- | --- |
| ![custom_sticker](https://raw.githubusercontent.com/doki-theme/doki-theme-vscode/main/readmeStuff/custom_sticker.gif) | ![custom_background](https://raw.githubusercontent.com/doki-theme/doki-theme-vscode/main/readmeStuff/custom_background.gif) | 

| **Custom Wallpaper** |
| --- |
| ![custom_wallpaper](https://raw.githubusercontent.com/doki-theme/doki-theme-vscode/main/readmeStuff/custom_wallpaper.png)|

# 14.0.0 [NekoPara Release]

## 3 New Themes!!

- Chocola (Dark)
- Vanilla (Dark)
- Coconut (Dark)

![v17 Girls](https://doki.assets.unthrottled.io/misc/v17_girls.png)

# 13.2.0 [Small Enhancements]

- Welcome Window now has background in VS Code 1.58
- Extensions View Header now has background.
- Changelog has theme's current sticker in the bottom right & the sticker shows above images.

# 13.1.0 [Insiders Content Support]

- Changed how stickers/wallpapers are installed, so they show up in VSCode v1.58.+. 
Please re-run your sticker/wallpaper command to see the changes take effect.

# 13.0.1 [Just trust me, bro]

- Changed extension to be enabled in [restricted mode](https://code.visualstudio.com/docs/editor/workspace-trust#_restricted-mode).

# 13.0.0 [Hanekawa, Shima Rin, Nagatoro, Yumeko, & Yuno]

## 5 New Themes

From the Monogatari series:

- Hanekawa Tsubasa (Dark)

From the Yuru Camp series:

- Shima Rin (Dark)

From the Don't Toy With Me, Miss Nagatoro series:

- Hayase Nagatoro (Dark)

From the Kakegurui Series:

- Jabami Yumeko (Dark)

From the Future Diary Series

- Gasai Yuno (Dark)

![v16 Girls](https://doki.assets.unthrottled.io/misc/v16_girls.png)

### Other Stuff

- Added [linked html editing color](https://code.visualstudio.com/updates/v1_52#_html)
- Added asset troubleshooting steps for the linux `snap` VS Code install.

# 12.2.2 [WSL Button Usability]

- Updated the WSL remote button in the status bar to be more visible.

# 12.2.1 [Text Link Consistency]

- Updated the text link color for all themes to be conistent with the other platforms' text link color.

# 12.2.0 [Theme Color Enhancements]

- Combed over the [Theme Colors](https://code.visualstudio.com/api/references/theme-color) provided by VS-Code to give the look and feel more themed colors!

# 12.1.0 [Usability Updates]

- Fixed selection usability issues for all themes [#68](https://github.com/doki-theme/doki-theme-vscode/issues/68)
- Changed the quick input panel to be opaque again. If you want it to be transparent, feel free to customize the [quick picker colors](https://code.visualstudio.com/api/references/theme-color#quick-picker-colors). I left the blurred effect on when you've installed the wallpaper.

# 12.0.0 [Nino, Nakano Miku, Gray, & Tohru]
## 5 New Themes

From the Quintessential Quintuplets series:

- Nakano Nino (Dark)
- Nakano Miku (Dark)

From the Lord El-Melloi II Case Files series:

- Gray (Dark)

From the Daily Life with a Monster girl series:

- Miia (Dark)

Addition to Miss Kobayashi's Dragon Maid:

- Tohru (Light)

## Other stuff

- Added a secondary sticker for [Hatsune Miku](https://github.com/doki-theme/doki-master-theme/issues/62)!
- Grouped all the Type-Moon products under `TypeMoon` (eg: Fate)
- Fixed matched bracket usability.

![v15 Girls](https://doki.assets.unthrottled.io/misc/v15_girls.png)


# 11.2.0 [Glass-Pane Enhancements]

- Made more panels transparent to show your background/sticker.
  - Please be sure to re-install the wallpaper & sticker for this to take effect!

Thank you, @JohnEdwa for your contributions!

![Moar glass, moar waifu](https://user-images.githubusercontent.com/15972415/116890857-ae068e80-abf3-11eb-8bf5-916d66c036ac.png)

# 11.1.3 [Handling non-url characters better]

- Mitigated issues where a user's local file path is not url-friendly, preventing assets from showing up. ([#63](https://github.com/doki-theme/doki-theme-vscode/issues/63)))

# 11.1.2 [Network Error Handling]

- Alerting user that asset installation has failed because of network issues.
- Restored word highlighting ([#62](https://github.com/doki-theme/doki-theme-vscode/issues/62))

# 11.1.1 [Better Glass Pane Experience]

- Fixed annoying background dragging in file tree. Be sure to re-install the wallpaper for this to take effect.

| Before | After |
| --- | --- |
| ![Peek 2021-03-18 17-57](https://user-images.githubusercontent.com/15972415/111708429-d38e3300-8813-11eb-916c-bdbb05388c2f.gif) | ![Peek 2021-03-18 17-53](https://user-images.githubusercontent.com/15972415/111708430-d426c980-8813-11eb-84f5-960b0bb6673d.gif) |


# 11.1.0 [Usability Updates]

- Fixed all theme usability issues found in [#46](https://github.com/doki-theme/doki-theme-vscode/issues/46).

# 11.0.0 [Astolfo, Maika, Rias, & Rei]

## 4 New Themes

From the Fate series:

- Astolfo (Dark)

From the Highschool DxD series:

- Rias: Onyx (a darker theme)
  - 2 Stickers:
    - A Mild One
    - A Cultured One

From the Blend S series:

- Sakuranomiya Maika (Dark)

From the Neon Genesis Evangelion series:

- Ayanami Rei (Dark)

## Other stuff

- Added [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) theming integration.
- Updated activation events to enhance user startup experience.

![v14 Girls](https://doki.assets.unthrottled.io/misc/v14_girls.png)

# 10.0.0 [Glass Pane Wallpapers!]

- Changed the behavior of the wallpapers to look like they are behind a glass pane!
  - Be sure to run the `Install ... Wallpaper` action!
- Sticker and Wallpaper actions are now separate. (Mix and match if you so choose!)

![Screenshot 2021-03-07 095027](https://user-images.githubusercontent.com/15972415/110246286-aba5f200-7f2c-11eb-8ddc-51a4867997fd.png)
![Screenshot 2021-03-07 094953](https://user-images.githubusercontent.com/15972415/110246284-ab0d5b80-7f2c-11eb-8b7b-136c8496a980.png)


# 9.1.0 [Better Python Support]

- Added better syntax coloring for Python code.

| Before | After |
| --- | --- |
| ![Screenshot from 2021-03-03 17-08-15](https://user-images.githubusercontent.com/15972415/109885062-8c187c00-7c43-11eb-9f1d-7557b280e79d.png) | ![Screenshot from 2021-03-03 17-07-25](https://user-images.githubusercontent.com/15972415/109885082-920e5d00-7c43-11eb-889d-7d2055cce7d8.png) |


# 9.0.1 [Wallpaper Anchoring]

- Updated the anchoring of various theme's wallpapers so that you can see your waifu!
  - Be sure to re-install the stickers for this to take effect.

| Before | After |
| --- | --- |
| ![Screenshot from 2021-02-20 06-10-01](https://user-images.githubusercontent.com/15972415/108594985-e14eb680-7342-11eb-8afc-09afe2bc9af0.png) | ![Screenshot from 2021-02-20 06-09-22](https://user-images.githubusercontent.com/15972415/108594986-e3187a00-7342-11eb-819c-30e49ea16cfe.png) |

# 9.0.0 [Zero Two, Sakurajima Mai]

## 4 New Themes

From the Darling in the Franxx series:

- Zero Two (Dark/light)

From the Rascal does not dream of bunny girl senpai series:

- Sakurajima Mai (Dark/light)
  - 2 Stickers:
    - A Mild One
    - A Spicy One

![v13 Girls](https://doki.assets.unthrottled.io/misc/v13_girls.png)

# 8.0.0 [Echidna, Yukino, Kurisu, Asuna, Umi, & Konata]

## 5 New Themes!

Love Live! series:

- Sonoda Umi (Dark)

From the OreGairu series:

- Yukinoshita Yukino (Dark)

Addition to Re:Zero series:

- Echidna (Dark)

From the Steins Gate series:

- Makise Kurisu (Dark)

Addition to the Sword Art Online series:

- Yuuki Asuna (Dark)

![v12 Girls](https://doki.assets.unthrottled.io/misc/v12_girls.png)

## Other Stuff

### Updates

- Konata's theme is now a bit darker to aid in usability

### Miscellaneous

- Update Rin's syntax coloring just a bit.
- Migrated editor scheme color overrides to all themes.
- "Last Name First Name"'d Misato.
- Current line number is now `infoForeground` colored for dark themes.

### [See pull request for more information](https://github.com/doki-theme/doki-theme-vscode/pull/39)

# 7.1.1 [Code Insiders Support]

- Restored support for all extension commands for VSCode-Insiders 1.52.0 `f47aae014cf8567f648e68369d66b4106ae89f08`.

# 7.1.0 [WSL Sticker Installation Support]

- Enabled of stickers when working on a remote WSL VSCode session. [See issue for more details](https://github.com/doki-theme/doki-theme-vscode/issues/32)
- Enhanced Rin & Ishtar's syntax colorings.

# 7.0.1 [Code Insiders Support]

- Restored support for all stickers in VSCode-Insiders 1.52.0.

# 7.0.0 [Platform Consistency]

- Migrated all theme's syntax coloring to look like the Jetbrains themes
  - [Please see the pull request for more information](https://github.com/doki-theme/doki-theme-vscode/pull/29)
- Updated Ram's status bar usability

# 6.0.0 [Fate, Gate, Konosuba]

## 5 New Themes!

Girls from the Fate series:

- Ishtar (Light/Dark)
- Tohsaka Rin (Dark)

From the Gate series:

- Rory Mercury (Dark)

Last addition to the Konosuba series:

- Aqua (Dark)

![v11 Girls](https://doki.assets.unthrottled.io/misc/v11_girls.png)

## Other Stuff

- Updated placeholder text
- Updated Darkness's dark accent foreground.

# 5.0.0 [Kanna Kamui]

- Added Miss Kobayashi's Dragon Maid's `Kanna` as a dark theme!
    - This theme has 2 stickers to choose from!
- Updated all of the dark theme deleted diff colors.

![The New Girl](https://doki.assets.unthrottled.io/misc/v10_girl.png?version=1)

# 4.0.0 [Misato Katsuragi]

- Added Neon Genesis Evangelion's `Misato Katsuragi` as a dark theme!

![The New Woman](https://doki.assets.unthrottled.io/misc/v9_girl.png?version=1)


# 3.2.0 [Many Small Improvements]

- Notification toasts now appear in front of the sticker, so you can actually read it :)
  - Please re-install your sticker to have this take effect!
- Added action buttons to notifications, so you can perform the required step by just clicking a button.
- Changed the comparison/diff colors to theme standards.
- Increased Satsuki's selected foreground readability.
- More small consistency changes.


# 3.1.1 [Non-Functional]

- Updated repository links in package.json
- Replaced extension icon.
- Security patches.

# 3.1.0 [New Sticker Placement]

- Moved the sticker to the bottom right hand corner of the window instead of being in the bottom right hand corner of the code editor window.
  - Please re-install your sticker to have this take effect!

# 3.0.0 [New Themes!]

- Added 5 new themes based on various new characters!
    - High School DxD:
        - Rias Gremory (Dark Theme)
    - Sword Art Online:
        - Yuuki Asuna (Light Theme)
    - Lucky Star:
        - Izumi Konata (Light Theme/2 Stickers)
    - KonoSuba:
        - Darkness (Light/Dark Theme)

![The New Girls](https://doki.assets.unthrottled.io/misc/v8_girls.png?version=1)

## 2.4.2 [Sticker Removal Fix (Revisited)]

- Scrubs CSS file after removal.

## 2.4.1 [Sticker Removal Fix]

- Fixed the issue with the sticker not being removed after installing multiple stickers.

## 2.4.0 [Secondary Sticker Port]

- Brought the secondary stickers from the Intellij themes over to VSCode!
  - Themes that have a secondary sticker now:
    - Monika (Light/Dark)
    - Natsuki (Light/Dark)
    - Sayori (Light/Dark)
    - Yuri (Light/Dark)

## 2.3.0 [Light Theme Adjustments]

- Revisited most of the light themes so they are all consistent with the other products.
  - Themes affected:
    - Light Monika
    - Light Natsuki
    - Light Yuri
    - Light Sayori
    - Beatrice

## 2.2.1 [Small Adjustments]

- You will know when the stickers/wallpapers start and finish installing.
- Small color adjustments.

## 2.2.0 [Offline Mode]

- Your theme's wallpaper is now available offline!
- Small adjustments to the look and feel of the light Emilia theme.


## 2.1.1 [Better Update Experience]

- The plugin will actually tell you if it could not install your specified sticker.
  - Rather than telling you it installed your sticker when it actually did not.

## 2.1.0 [Look and Feel Consistency]

- Made more VS code components have a more consistent look and feel!

## 2.0.2 [Non-Functional]

- Changed how the plugin gets stickers. 
    - I am now able to update the stickers without you having to download a new version.


## 2.0.1 [Code Server Support]

- Stickers/background can be installed on VSCode running on Code Server.

## 2.0.0 [New Themes!]

- Added 5 new themes based on various new characters!
    - Re:Zero:
        - Emilia (Dark/Light Theme)
    - Danganronpa:
        - Mioda Ibuki (Dark/Light Theme)
    - Hatsune Miku (Dark Theme)

![The New Girls](https://doki.assets.unthrottled.io/misc/v7_girls.png?version=1)

## 1.0.1 [Non-Functional]

- Migrated theme build process to centralized management strategy.

## 1.0.0 [Initial Release!]

- 14 Color Themes based on characters from various anime and visual novels.
  - Kill La Kill
    - Ryuko (Dark Theme)
    - Satsuki (Light Theme)
  - KonoSuba
    - Megumin (Dark Theme)
  - Doki-Doki Literature Club
    - Just Monika (Light/Dark Theme)
    - Natsuki (Light/Dark Theme)
    - Sayori (Light/Dark Theme)
    - Yuri (Light/Dark Theme)
  - Re:Zero
    - Beatrice (Light Theme)
    - Ram (Dark Theme)
    - Rem (Dark Theme)
- Each Theme has a corresponding sticker pack which includes:
  - A sticker of the character in the lower right hand corner of you editor window
  - A Customized background of the selected character when all editor windows are closed.
