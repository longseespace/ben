set -e

yarn build
export QMAKESPEC=macx-clang
export TRAVIS_BUILD_DIR=$PWD

QMAKE=/Users/long/Qt5.13.0/5.13.0/clang_64/bin/qmake
MACDEPLOYQT=/Users/long/Qt5.13.0/5.13.0/clang_64/bin/macdeployqt

# first, clean
rm -rf "$TRAVIS_BUILD_DIR/release"

# then, build
mkdir -p "$TRAVIS_BUILD_DIR/release"
$QMAKE -v
$QMAKE -o "$TRAVIS_BUILD_DIR/release" -r -Wall -Wlogic -Wparser CONFIG+=qtquickcompiler CONFIG+=release PRODUCTION=true "$TRAVIS_BUILD_DIR/native"
make -C "$TRAVIS_BUILD_DIR/release" -j8 all
$MACDEPLOYQT "$TRAVIS_BUILD_DIR/release/Ben.app" -dmg -qmldir="$TRAVIS_BUILD_DIR/native/dist"