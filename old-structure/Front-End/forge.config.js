module.exports = {
  packagerConfig: {
    arch: 'all',
    asar: true,
    overwrite: true,
    out: 'release-builds',
    icon: './src/favicon.ico'
  },
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "angulon"
      }
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "darwin"
      ]
    },
    // {
    //   "name": "@electron-forge/maker-deb",
    //   "config": {}
    // },
    // {
    //   "name": "@electron-forge/maker-rpm",
    //   "config": {}
    // }
  ]
}
