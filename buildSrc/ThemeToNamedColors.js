const path = require('path');

const currentDirectory = require.main.path;
const repoDirectory = path.resolve(currentDirectory, '..');

const satsukiThemePath = path.resolve(repoDirectory, 'src','themes','Ryuko.theme.json')

const fs = require('fs');
const satsukiJson = JSON.parse(fs.readFileSync(satsukiThemePath, 'utf-8'))

const satsukiDefinitionPath = path.resolve(repoDirectory,'themes','definitions','killLaKill','ryuko','ryuko.doki.json')
const satsukiDefinition = JSON.parse(fs.readFileSync(satsukiDefinitionPath, 'utf-8'));
const satuskiColors = satsukiDefinition.colors;

const defColorToName = Object.keys(satuskiColors)
.map(k => ({key: k, value: satuskiColors[k]}))
.reduce((acc, k) => {
    const key = k.key;
    const value = k.value.toUpperCase();
    if(!acc[value]){
        acc[value] = []
    }

    acc[value].push(key)
    return acc;
}, {});

const templatedColors = Object.keys(satsukiJson.colors)
.map(key => ({key, value: satsukiJson.colors[key]}))
.map(kV => {
    const hexColor = kV.value.toUpperCase();
    const mappedValue = 
    defColorToName[hexColor.substring(0, 7)] ||
    defColorToName[hexColor]
    if(!mappedValue) {
        throw new Error(`Unable to find named color for ${hexColor} for property ${kV.key}`)
    }
    const namedColor = mappedValue[0]

    const templatedValue = `&${namedColor}&${hexColor.substring(7) || ''}`

    return {key: kV.key, value: templatedValue}
}).reduce((accum, kV) => {
    accum[kV.key] = kV.value;
    return accum;
}, {});


console.log(JSON.stringify(templatedColors))