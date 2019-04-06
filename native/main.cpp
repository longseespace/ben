#include "qtquickcontrolsapplication.h"
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickStyle>
#include <qsingleinstance.h>

#ifdef PRODUCTION
#define PRODUCTION_BUILD true
#else
#define PRODUCTION_BUILD false
#endif

int main(int argc, char *argv[]) {
  // Disable qml cache, or it would crash in development
  qputenv("QML_DISABLE_DISK_CACHE", PRODUCTION_BUILD ? "false" : "true");

  // This has the app draw at HiDPI scaling on HiDPI displays, usually two
  // pixels for every one logical pixel
  QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

  // This has QPixmap images use the @2x images when available
  // See this bug for more details on how to get this right:
  // https://bugreports.qt.io/browse/QTBUG-44486#comment-327410
  QCoreApplication::setAttribute(Qt::AA_UseHighDpiPixmaps);

  // QtQuickControlsApplication is basically an alias of
  // - <QWidget/QApplication> (on desktop)
  // - <QtGui/QGuiApplication> (on other platform)
  QtQuickControlsApplication app(argc, argv);

  // Do not automatically quit on last window closed in development
  // We need this for hot-reloading
  // in macOS, always set this to false
#ifdef Q_OS_MAC
  app.setQuitOnLastWindowClosed(false);
#else
  app.setQuitOnLastWindowClosed(PRODUCTION_BUILD);
#endif
  // setup app basic metadata
  app.setOrganizationName("Podzim");
  app.setOrganizationDomain("podzim.co");
  app.setApplicationName("Ben");

  QQmlApplicationEngine engine;
  engine.addImportPath(QStringLiteral("qrc:/"));

  engine.rootContext()->setContextProperty("PRODUCTION_BUILD",
                                           PRODUCTION_BUILD);

  engine.rootContext()->setContextProperty(
      "ENTRY_URL", PRODUCTION_BUILD ? QUrl("qrc:/index.qml")
                                    : QUrl("http://localhost:8081/index.qml"));

  engine.rootContext()->setContextProperty("HMR_URL",
                                           QUrl("ws://localhost:8081/hot"));

  engine.rootContext()->setContextProperty("SUPPORT_HMR", !PRODUCTION_BUILD);

  engine.load(QUrl(QLatin1String("qrc:/react-qml/main.qml")));

  // This allow only 1 instance of the app
  QSingleInstance instance;
  return instance.singleExec();
}
