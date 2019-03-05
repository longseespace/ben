#ifndef RQKEYCHAIN_H
#define RQKEYCHAIN_H

#include <QHash>
#include <QJSValue>
#include <QObject>
#include <keychain.h>

class RQKeychain : public QObject {
  Q_OBJECT
public:
  explicit RQKeychain(QObject *parent = nullptr);

  Q_INVOKABLE void readPassword(const QString &service, const QString &key,
                                QJSValue callback);
  Q_INVOKABLE void writePassword(const QString &service, const QString &key,
                                 const QString &value, QJSValue callback);
  Q_INVOKABLE void deletePassword(const QString &service, const QString &key,
                                  QJSValue callback);

private slots:
  void onJobFinish(QKeychain::Job *job);
  void onJobDestroyed();

private:
  QHash<QKeychain::Job *, QJSValue> m_callback_map;
};

#endif // RQKEYCHAIN_H
