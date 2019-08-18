set -e

echo 'Patching libqtlabsplatformplugin.dylib...'
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cp -f $DIR/libqtlabsplatformplugin_dylib /usr/local/Cellar/qt/5\.13\.0/qml/Qt/labs/platform/libqtlabsplatformplugin\.dylib
echo 'Done'