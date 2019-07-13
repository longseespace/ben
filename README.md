# Ben [![Build Status](https://travis-ci.com/longseespace/ben.svg?branch=develop)](https://travis-ci.com/longseespace/ben)
Fast, _native*_, cross-platform Slack client, develop with [React QML][react-qml] 

![Screenshot](docs/screenshot.png?raw=true "Screenshot")

_*native in the sense that it's not another Electron app, nor using a webview_

## Features
🚧 **NOTE:** This is a work-in-progress and definitely not feature-complete! 🚧

- Cross-platform: one codebase, deploy everywhere
- Hackable: the app is mainly in TypeScript, using front-end technologies (redux, react-redux, redux-persist etc.)
- Better developer experience: supports Hot Module Replacement, React Devtool, Redux Devtool

## Build Instruction for macOS

0. Setup environment:
- Install XCode 10 (with updated Command Line Tool `xcode-select --install`)
- Install Qt 5.10.1
  - **Note**: must be version 5.10.1
  - Install any additional Kits you wish to use (iOS, iOS Simulator, Android etc.)
- Install [qpm][qpm]
- Install NodeJS & yarn

1. Front-end bundle:
```bash
# install deps
yarn install

# build for macOS
yarn build
```

The JS bundle and app's assets should be available at `./native/dist` folder

2. Native build:
```bash
cd native

# install deps
qpm install

# generate Makefile
mkdir -p output
qmake -o "output/" -spec macx-clang CONFIG+=x86_64 CONFIG+=release PRODUCTION=true "Ben.pro"

# build
make -C "output/" -j7 all

# generate dmg
macdeployqt "./output/Ben.app" -dmg -qmldir="."
```

You should find `Ben.app` and `Ben.dmg` in `output` folder

[react-qml]: https://github.com/longseespace/react-qml
[qpm]: https://www.qpm.io
