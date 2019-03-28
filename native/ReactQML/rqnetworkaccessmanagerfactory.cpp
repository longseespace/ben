#include "rqnetworkaccessmanagerfactory.h"

#include <QDir>
#include <QNetworkAccessManager>
#include <QNetworkDiskCache>
#include <QStandardPaths>

QNetworkAccessManager *RQNetworkAccessManagerFactory::create(QObject *parent) {
  QNetworkAccessManager *nam = new QNetworkAccessManager(parent);
  auto cache = new QNetworkDiskCache(parent);
  auto osCacheDir =
      QStandardPaths::writableLocation(QStandardPaths::CacheLocation);
  auto cacheDir = QDir(osCacheDir + "/react-qml-httpcache");
  cache->setCacheDirectory(cacheDir.absolutePath());
  nam->setCache(cache);
  return nam;
}
