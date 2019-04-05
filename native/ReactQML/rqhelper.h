#ifndef RQHELPER_H
#define RQHELPER_H

#include <QGuiApplication>
#include <QQuickWindow>
#include <QWindow>

class RQHelper {
public:
  static void hideTitlebar(QQuickWindow *window = nullptr);
};

#endif // RQHELPER_H
