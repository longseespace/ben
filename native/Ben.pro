# qpm
include(vendor/vendor.pri)

# mac
macx {
  QT += macextras
  LIBS += -framework Cocoa
}
QTPLUGIN += qsqlite

QT += qml quick quickcontrols2 websockets svg network sql
android|ios|qnx|winrt|isEmpty(QT.widgets.name): CONFIG += no_desktop
!no_desktop: QT += widgets

CONFIG(debug, debug|release) {
  DEFINES += DEBUG
}

isEqual(PRODUCTION, "true") {
  message("Production Build")
  DEFINES += PRODUCTION
  RESOURCES += dist/bundle.qrc
}

QMAKE_TARGET_COMPANY = Podzim
QMAKE_TARGET_PRODUCT = Ben
QMAKE_TARGET_COPYRIGHT = Copyright 2019 Podzim. All rights reserved.
TARGET = Ben

HEADERS += \
  qtquickcontrolsapplication.h \
  ReactQML/rq.h \
  ReactQML/rqnetworkaccessmanagerfactory.h


SOURCES += main.cpp \
  ReactQML/rq.cpp \
  ReactQML/rqnetworkaccessmanagerfactory.cpp

RESOURCES += main.qrc

# icon
ICON = Ben.icns
