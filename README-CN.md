[![Gitter](https://badges.gitter.im/doki-theme-vscode/community.svg)](https://gitter.im/doki-theme-vscode/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# 主题效果

![Takanashi Rikka Theme](./screenshots/chuunibyou/rikka_dark_code.png)

<div align="center"> 
    <h3>代码字体 <a href="https://rubjo.github.io/victor-mono/">Victor Mono</a></h3>
</div>

# 功能一览

![Ryuko's Theme Usage](./readmeStuff/vscode_doki_install_v2.gif)

示范步骤:

1. 选择缠流子(Ryoko)主题
2. 开启缠流子(Ryoko)的壁纸
3. 重启 VSCode
4. 关掉所有标签页，看看玻璃板特效

# [完整的效果预览请点这里](albums/complete_theme_album.md)

## 关于 DOKI-THEME！

基于可爱的~~老婆~~动漫角色的可爱主题。超过**60**个主题，你推可能就在这里。

你可以选择以下动漫、漫画或 gal 中的角色主题：

<details>
<summary>系列一览</summary>

- AzurLane - 碧蓝航线
- Blend S - 调教咖啡厅
- Charlotte - 夏洛特
- Chuunibyou, Love, & Other Delusions - 中二病也要谈恋爱
- Code Geass - 叛逆的鲁鲁修
- Daily life with a monster girl - 魔物娘的相伴日常
- DanganRonpa - 弹丸论破
- Darling in the Franxx - Darling in the Franxx
- Doki-Doki Literature Club - 心跳文学部
- Don't Toy With Me, Miss Nagatoro - 不要欺负我，长瀞同学
- EroManga Sensei - 埃罗芒阿老师
- Fate - Fate 系列
- Future Diary - 未来日记
- Gate - GATE 奇幻自卫队
- Guilty Crown - 罪恶王冠
- Haikyu!! - 排球少年!!
- High School DxD - 恶魔高校 D×D
- Jahy-sama Will Not Be Discouraged! - 贾希大人不气馁！
- Kakegurui - 狂赌之渊
- Kill La Kill - 斩服少女
- KonoSuba - 为美好的世界献上祝福！
- Love Live! - Love Live! 学园偶像计划
- Lucky Star - 幸运星
- Miss Kobayashi's Dragon Maid - 小林家的龙女仆
- Monogatari - 物语系列
- NekoPara - 猫娘乐园
- Neon Genesis Evangelion - 新世纪福音战士
- One Punch Man - 一拳超人
- OreGairu - 我的青春恋爱物语果然有问题
- OreImo - 我的妹妹不可能那么可爱
- Quintessential Quintuplets - 五等分的新娘
- Rascal does not dream of bunny girl senpai - 青春猪头少年不会梦到兔女郎学姐
- Re:Zero - Re0:从零开始的异世界生活
- Rising of the Shield Hero - 盾之勇者成名录
- Sewayaki Kitsune no Senko-san - 贤惠幼妻仙狐小姐
- Shokugeki no Soma - 食戟之灵
- Steins Gate - 命运石之门
- Sword Art Online - 刀剑神域
- That Time I Got Reincarnated as a Slime - 关于我转生变成史莱姆这档事
- Toaru Majutsu no Index - 魔法禁书目录
- Yuru Camp - 摇曳露营
</details>

---

# 文档

- [配置](#configuration)
  - [背景图片](#background-images)
  - [隐藏 VSCode 水印](#hide-watermark)
  - [贴纸](#stickers)
  - [自定义资源](#custom-assets)
  - [资源恢复](#asset-restoration)
  - [Suggestive Content](#suggestive-content)
  - [移除资源](#remove-assets)
  - [更新日志](#show-changelog)
- [杂项](#miscellaneous)
  - [做出贡献](#contributing)
  - [主题请求](#theme-requests)
  - [觉得好用？](#enjoying-the-plugin)
  - [提出建议](#contributions)
  - [更多 Doki Theme！](#even-more-doki-theme)

# 配置

## 背景图片

**背景壁纸** 可能是本插件最好的功能之一。这个功能会把背景图片设置为当前主题的官方壁纸。

**重要！！** 安装主题资源会需要我用 CSS 魔改 VS-Code。在卸载本插件前，你需要使用“Remove Sticker/Background”命令将 VS Code 恢复到原状态。你可以关闭 VSCode 并重新启动它，以消除烦人的 `Unsupported` 警告。插件会自动修复 VSCode 的校验和。

**玻璃板效果**

![Zero Two Code](./readmeStuff/wallpaper_code.png)
![Zero Two Code](./readmeStuff/wallpaper_background.png)

#### 设置

为了方便，当你运行 `Install Wallpaper` 命令时，壁纸和背景图片都会被安装。如果你想要背景图片，但不想要壁纸，你可以使用下面列出的设置进行调整。

- `doki.background.enabled`: 当运行 `Install Wallpaper` 命令时，是否想要在空编辑器背景中显示图片。
- `doki.wallpaper.enabled`: 当运行 `Install Wallpaper` 命令时，是否想要在代码编辑器上显示图片。

你需要在 VSCode 的 `settings.json` 中设置这些值。

你也可以在[设置面板](https://code.visualstudio.com/docs/getstarted/settings)搜索 `Doki` 来找到相关设置。

https://user-images.githubusercontent.com/15972415/172961532-d8403999-15f0-4030-9f69-1da50002dfd9.mp4

## 隐藏 VSCode 水印

觉得 VSCode 的水印很烦？你可以使用 **Hide VSCode Watermark** 来隐藏它，享受味儿更浓的 VSCode。

**重要！！** 隐藏水印需要我用 CSS 魔改 VS-Code。在卸载本插件前，你需要使用“Remove Sticker/Background”命令将 VS Code 恢复到原状态。你可以关闭 VSCode 并重新启动它，以消除烦人的 `Unsupported` 警告。插件会自动修复 VSCode 的校验和。

![Hidden Watermark](./readmeStuff/hide_watermark.gif)

## 贴纸

**Show sticker** 允许你控制 IDE 右下角的可爱贴纸的显示。

**重要！！** 安装主题资源会需要我用 CSS 魔改 VS-Code。在卸载本插件前，你需要使用“Remove Sticker/Background”命令将 VS Code 恢复到原状态。你可以关闭 VSCode 并重新启动它，以消除烦人的 `Unsupported` 警告。插件会自动修复 VSCode 的校验和。
![Ibuki's Dark Sticker](./readmeStuff/sticker.png)

## 自定义资源

你可以在所有的 Doki 主题中设置自定义图片。允许的图片类型：jpg、png、gif。你需要在 VSCode 的 `settings.json` 中设置这些值。

你可以在[设置面板](https://code.visualstudio.com/docs/getstarted/settings)搜索 `Doki` 来找到相关设置。

**注意**：所有路径值都 _必须_ 是绝对路径，指向运行 VSCode 的机器上的文件。在配置好资源的引用之前，自定义资源 **不会** 生效。

**自定义贴纸**

```json
"doki.sticker.path": "C:\\Users\\alex\\Downloads\\aqua_celebration.gif",
```

![Custom Sticker](./readmeStuff/custom_sticker.gif)

**自定义贴纸位置**

你可以使用任何有效的 CSS 代码来修改贴纸的位置。
Tips: 贴纸是显示在一个伪元素上的，大小与窗口一样，并作为该元素的背景应用。所以你可能尝试一下 `background-position` 和 `background-size`，或者其他你喜欢的玩法！

**自定义背景**

当你的编辑器是空的时候（所有标签页都关闭），会显示这个空编辑器背景（所有标签都关闭），上面有 VS Code 的水印。

```json
"doki.background.path": "C:\\Users\\alex\\Downloads\\chocola_celebration.gif",
```

![Custom Background](./readmeStuff/custom_background.gif)

**自定义壁纸**

这个壁纸会显示在你的编辑器和其他地方。

**注意**：你应该需要自行调整图片的透明度。因为如果我在插件层面上处理透明度（比如让所有背景图片都半透明），那你就无法实现一个不透明的背景图片了。

```json
"doki.wallpaper.path": "C:\\Users\\alex\\Downloads\\ishtar.png",
```

![Custom Background](./readmeStuff/custom_wallpaper.png)

这是一个没有把自定义壁纸设置为半透明的例子。

![Not transparent wallpaper](./readmeStuff/not_transparent_image.png)

~~没准也有人喜欢这样呢~~
You cannot see anything!

**自定义壁纸/背景锚点**
**Custom Wallpaper/Background Anchor**

它的值应当是 css 中 'background-position' 的值，用于背景和壁纸的位置（比如：center、right、left 等）。

```json
"doki.background.anchor": "center",
```

**自定义状态栏上显示的名字**

我不可能为全天下所有的~~老婆~~角色都做主题，所以我猜你可能想要自定义并制作自己的主题。
我懂，所以你可以更改显示在状态栏旁边的心形旁边的名字。

![Custom Status Bar Name](./readmeStuff/custom_name.png)

## 资源恢复

很遗憾，每次 VSCode 更新时，你都会丢失安装的资源更改。
好在，这个插件会记住你安装的资源，并在第一次检测到 VSCode 更新时尝试恢复它们。

如果第一次恢复失败，你可以修复问题，然后运行 **Restore Assets** 命令。

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

## 移除资源

**Remove Sticker/Background** 会移除你的 VSCode 的贴纸和壁纸，并恢复原来的状态。

## 更新日志

你知道我有在维护一个更新日志吗？
[你可以在这里找到它！](CHANGELOG.md)

我还提供了一个 `Show Changelog` 命令，可以在你的 VSCode 中查看更新日志！

![Show changelog](./readmeStuff/changelog.png)

# 杂项

## 做出贡献

如果你想为本插件做出贡献，你可以查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 来了解所需的步骤。

## 主题请求

没在本插件找到~~你的老婆~~你推？你可以在[这里](https://github.com/doki-theme/doki-master-theme/issues)提出你的主题请求。

## 觉得好用？

很好！我很高兴你喜欢！

别忘了给它一个 ⭐ 并分享给其他宅宅们！

同时，在插件市场上[给它一个好评](https://marketplace.visualstudio.com/items?itemName=unthrottled.doki-theme)也会帮助这个插件被更多的宅宅们看到！

## 提出建议

我很乐意听到你的想法！你可能有很不错的主意，所以请随时提交 [issue](https://github.com/doki-theme/doki-theme-vscode/issues/new).

帮我让这个插件变得更好！

## [更多 Doki Theme！](https://doki-theme.unthrottled.io/products)

---

<div align="center">
    <img src="https://doki.assets.unthrottled.io/misc/logo_v2.png" ></img>
</div>
