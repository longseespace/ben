#include "rqhelper.h"
#ifdef Q_OS_MACOS
#include <Cocoa/Cocoa.h>
#include <QGuiApplication>
#include <QWindow>
#include <QWindowList>
#include <QtCore>
#include <QtDebug>
#include <QtMac>

void RQHelper::hideTitlebar(QQuickWindow *qwindow) {
  QWindow *win;

  if (!win) {
    QWindowList windows = QGuiApplication::allWindows();
    win = windows.first();
  } else {
    win = reinterpret_cast<QWindow *>(qwindow);
  }

  auto winId = win->winId();

  NSView *nview = reinterpret_cast<NSView *>(winId);
  NSWindow *nwindow = nview.window;

  nwindow.titleVisibility = NSWindowTitleHidden;
  nwindow.titlebarAppearsTransparent = YES;
  [nwindow setMovable:NO];
  nwindow.movableByWindowBackground = YES;
  nwindow.styleMask |= NSWindowStyleMaskFullSizeContentView;
}

#endif
