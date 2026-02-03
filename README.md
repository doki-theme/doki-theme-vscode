[![Gitter](https://badges.gitter.im/doki-theme-vscode/community.svg)](https://gitter.im/doki-theme-vscode/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# Theme Preview

![Takanashi Rikka Theme](./screenshots/chuunibyou/rikka_dark_code.png)

<div align="center"> 
    <h3>Code Font <a href="https://rubjo.github.io/victor-mono/">Victor Mono</a></h3>
</div>


# Feature Preview

![Ryuko's Theme Usage](./readmeStuff/vscode_doki_install_v2.gif)

Steps demonstrated:
1. Choose Ryuko's Color Theme
1. Enable Ryuko's wallpaper
1. Restart VSCode
1. Demonstrate glass pane feature

## Screen Samples!

# [Complete Theme Album.](albums/complete_theme_album.md)

## About!

Cute themes based on cute anime characters. With over **60** themes, the one you like the best is probably here.

You can choose themes based on characters from these various Anime, Manga, or Visual Novels:

<details>
<summary>All Featured Titles</summary>

- AzurLane
- Blend S
- Charlotte
- Chuunibyou, Love, & Other Delusions
- Code Geass
- Daily life with a monster girl
- DanganRonpa
- Darling in the Franxx
- Doki-Doki Literature Club
- Don't Toy With Me, Miss Nagatoro
- EroManga Sensei
- Fate
- Future Diary
- Gate
- Guilty Crown
- Haikyu!!
- High School DxD
- Jahy-sama Will Not Be Discouraged!
- Kakegurui
- Kill La Kill
- KonoSuba
- Love Live!
- Lucky Star
- Miss Kobayashi's Dragon Maid
- Monogatari
- NekoPara
- Neon Genesis Evangelion
- One Punch Man
- OreGairu
- OreImo
- Quintessential Quintuplets
- Rascal does not dream of bunny girl senpai
- Re:Zero
- Rising of the Shield Hero
- Sewayaki Kitsune no Senko-san
- Shokugeki no Soma
- Steins Gate
- Sword Art Online
- That Time I Got Reincarnated as a Slime
- Toaru Majutsu no Index
- Yuru Camp
</details>

---

# Documentation

- [Theme Preview](#theme-preview)
- [Feature Preview](#feature-preview)
  - [Screen Samples!](#screen-samples)
- [Complete Theme Album.](#complete-theme-album)
  - [About!](#about)
- [Documentation](#documentation)
- [Configuration](#configuration)
  - [Background Images](#background-images)
      - [Settings](#settings)
  - [Hide Watermark](#hide-watermark)
  - [Stickers](#stickers)
  - [Custom Assets](#custom-assets)
  - [Asset Restoration](#asset-restoration)
  - [Suggestive Content](#suggestive-content)
  - [Remove Assets](#remove-assets)
  - [Show Changelog](#show-changelog)
- [Miscellaneous](#miscellaneous)
  - [Contributing](#contributing)
  - [Theme Requests](#theme-requests)
  - [Enjoying the plugin?](#enjoying-the-plugin)
  - [Contributions?](#contributions)
  - [Even more Doki-Theme!](#even-more-doki-theme)

# Configuration

## Background Images

**Background Wallpaper** is probably one of the best features of the plugin.
This feature will set the background image to the current theme's official wallpaper.

**Important!!** Installing theme assets requires me to corrupt VS-Code by modifying CSS. You will have to use the "Remove Sticker/Background" command to restore VS Code back to supported status before uninstalling. You can close VSCode and start it back up remove the annoying `Unsupported` warning. The plugin automatically fixes VSCode's checksums.

**Glass Pane effect**

![Zero Two Code](./readmeStuff/wallpaper_code.png)
![Zero Two Code](./readmeStuff/wallpaper_background.png)

#### Settings

For convenience, the wallpaper & background image are both installed when you run the `Install Wallpaper` command. If you want the background image on and the wallpaper off, then you can adjust it using the settings listed below.

- `doki.background.enabled`: Whether you want an image in your empty editor background when running the 'Install Wallpaper' command.
- `doki.wallpaper.enabled`: Whether you want an image on top of your code editor, when running the 'Install Wallpaper' command.

You'll have to put these changes in the `settings.json` in your VSCode. 

You can also use the [settings UI](https://code.visualstudio.com/docs/getstarted/settings) just search for `Doki` and you should find the relevant settings.

https://user-images.githubusercontent.com/15972415/172961532-d8403999-15f0-4030-9f69-1da50002dfd9.mp4

## Hide Watermark

Tired of the the VSCode watermark cramping your style? 
You have the ability to hide it using **Hide VSCode Watermark**, so you can fully enjoy your art.

**Important!!** Hiding the watermark requires me to corrupt VS-Code by modifying CSS. You will have to use the "Remove Sticker/Background" command to restore VS Code back to supported status before uninstalling. You can close VSCode and start it back up remove the annoying `Unsupported` warning. The plugin automatically fixes VSCode's checksums.

![Hidden Watermark](./readmeStuff/hide_watermark.gif)

## Stickers

**Show sticker** allows you to control the presence of the cute sticker in the bottom right-hand corner of your IDE.

**Important!!** Installing theme assets requires me to corrupt VS-Code by modifying CSS. You will have to use the "Remove Sticker/Background" command to restore VS Code back to supported status before uninstalling. You can close VSCode and start it back up remove the annoying `Unsupported` warning. The plugin automatically fixes VSCode's checksums.

![Ibuki's Dark Sticker](./readmeStuff/sticker.png)

## Custom Assets

Hey alright, you have the ability to set the image to be used for all the doki-themes. Allowed image types: jpg, png, gif. You'll have to put these changes in the `settings.json` in your VSCode. 

You can also use the [settings UI](https://code.visualstudio.com/docs/getstarted/settings) just search for `Doki` and you should find the relevant settings.

**Note**: All path values _must_ be an absolute path that resolves to a file on the machine running VSCode. Assets **will not** be installed until the configuration references a file on your system.

**Custom Sticker**

```json
"doki.sticker.path": "C:\\Users\\alex\\Downloads\\aqua_celebration.gif",
```

![Custom Sticker](./readmeStuff/custom_sticker.gif)

**Custom Sticker Positioning**

Any valid CSS that you can use to modify the position of the sticker.
As an FYI, stickers are displayed on a psuedo element the size of the window & applied as the background of that element. So you'll probably want to play around with `background-position` & `background-size`, or whatever your heart desires!

**Custom Background**

This is the empty editor screen (all tabs closed), the one with the VS Code watermark.

```json
"doki.background.path": "C:\\Users\\alex\\Downloads\\chocola_celebration.gif",
```

![Custom Background](./readmeStuff/custom_background.gif)

**Custom Wallpaper**

This shows up on your editor and other places. 
**Note**: you'll want to make your image partially transparent. 
Cus I was too lazy to play make all the backgrounds partially transparent to show the opaque background image. Didn't feel like peeling that onion and deviating from my color schemes.

```json
"doki.wallpaper.path": "C:\\Users\\alex\\Downloads\\ishtar.png",
```

![Custom Background](./readmeStuff/custom_wallpaper.png)

This is what happens when you don't make your custom wallpaper transparent.

![Not transparent wallpaper](./readmeStuff/not_transparent_image.png)

You cannot see anything! 

**Custom Wallpaper/Background Anchor**

Value to be used for css 'background-position' for both the background & wallpaper (eg: center, right, left, etc.)

```json
"doki.background.anchor": "center",
```

**Custom Status Bar Name**

I can't get every theme build, so I suppose you want to customize and make your own.
I get that, so you have the ability to change the name that shows up next to the heart in the status bar.

![Custom Status Bar Name](./readmeStuff/custom_name.png)

## Asset Restoration

Unfortunately, every time VSCode updates, you will lose your installed asset changes. 
Thankfully, this plugin will remember what assets you installed, and attempt to restore them on the first detection of a VSCode update. 

If the restoration does not work the first time, you can fix the issue then run the **Restore Assets** command to quickly get you back to coding! 

## Suggestive Content

<div align="center">
    <img src="https://doki.assets.unthrottled.io/misc/suggestive/cultured.gif" ></img>
</div>

So I thought it was a good idea to add a bit of culture to this plugin.
<sup><sup>Ya boi is horny on main.</sup></sup>

I will give you a bit of a warning before you install suggestive content.
Some of us are professional Otaku, who want to remain, well...professional.
Don't worry if you choose to continue, I won't ask you again for that specific theme.

Applies for the following content:

- Rias Onyx: Secondary Content


## Remove Assets

Removes both the sticker and wallpaper from your vscode and restores the original supported status.

## Show Changelog

Did you know I keep a changelog?
[You can find it here!](CHANGELOG.md)

I've also supplied a `Show Changelog` action that will bring up the changes in your VSCode!

![Show changelog](./readmeStuff/changelog.png)

# Miscellaneous

## Contributing

If you want to get your workstation set up to work on the plugin,
then you'll want to check out the [CONTRIBUTING.md](./CONTRIBUTING.md) for instructions on what is needed.

## Theme Requests

If you want your main squeeze to be featured in the Doki Theme suite, feel free to [submit a theme request](https://github.com/doki-theme/doki-master-theme/issues).

## Enjoying the plugin?

Great! I am glad you like it!

Be sure to ⭐ and share it with other weebs!

Also, giving it a good [review on the extension marketplace](https://marketplace.visualstudio.com/items?itemName=unthrottled.doki-theme) will help this plugin become visible to more otaku!

## Contributions?

I think your voice needs to be heard! You probably have good ideas, so feel free to submit your feedback as [an issue](https://github.com/doki-theme/doki-theme-vscode/issues/new).

Help make this plugin better!

## [Even more Doki-Theme!](https://doki-theme.unthrottled.io/products)

---

<div align="center">
    <img src="https://doki.assets.unthrottled.io/misc/logo_v2.png" ></img>
</div>
