#include "rqkeychain.h"
#include "qtkeychain/keychain.h"
#include <QQmlEngine>
#include <QtCore>

using namespace QKeychain;

static const QMap<QKeychain::Error, QString> kErrorMap = {
    {Error::NoError, "NoError"},
    {Error::EntryNotFound, "EntryNotFound"},
    {Error::CouldNotDeleteEntry, "CouldNotDeleteEntry"},
    {Error::AccessDeniedByUser, "AccessDeniedByUser"},
    {Error::AccessDenied, "AccessDenied"},
    {Error::NoBackendAvailable, "NoBackendAvailable"},
    {Error::NotImplemented, "NotImplemented"},
    {Error::OtherError, "OtherError"},
};

RQKeychain::RQKeychain(QObject *parent)
    : QObject(parent), m_callback_map(), m_insecure_fallback(false) {}

void RQKeychain::setInsecureFallback(bool insecureFallback) {
  m_insecure_fallback = insecureFallback;
}

void RQKeychain::readPassword(const QString &service, const QString &key,
                              QJSValue callback) {
  if (!callback.isCallable()) {
    return;
  }

  // job is auto-deleted, don't worry
  ReadPasswordJob *job = new ReadPasswordJob(service);
  job->setInsecureFallback(m_insecure_fallback);
  job->setKey(key);
  job->connect(job, &Job::finished, this, &RQKeychain::onJobFinish);
  job->connect(job, &QObject::destroyed, this, &RQKeychain::onJobDestroyed);

  m_callback_map.insert(static_cast<Job *>(job), callback);

  job->start();
}

void RQKeychain::writePassword(const QString &service, const QString &key,
                               const QString &value, QJSValue callback) {
  if (!callback.isCallable()) {
    return;
  }

  // job is auto-deleted, don't worry
  WritePasswordJob *job = new WritePasswordJob(service);
  job->setInsecureFallback(m_insecure_fallback);
  job->setKey(key);
  job->setTextData(value);
  job->connect(job, &Job::finished, this, &RQKeychain::onJobFinish);
  job->connect(job, &QObject::destroyed, this, &RQKeychain::onJobDestroyed);

  m_callback_map.insert(static_cast<Job *>(job), callback);

  job->start();
}

void RQKeychain::deletePassword(const QString &service, const QString &key,
                                QJSValue callback) {
  if (!callback.isCallable()) {
    return;
  }

  // job is auto-deleted, don't worry
  DeletePasswordJob *job = new DeletePasswordJob(service);
  job->setInsecureFallback(m_insecure_fallback);
  job->setKey(key);
  job->connect(job, &Job::finished, this, &RQKeychain::onJobFinish);
  job->connect(job, &QObject::destroyed, this, &RQKeychain::onJobDestroyed);

  m_callback_map.insert(static_cast<Job *>(job), callback);

  job->start();
}

void RQKeychain::onJobFinish(Job *job) {
  QJSValue callback = m_callback_map.value(job);

  if (!callback.isCallable()) {
    return;
  }

  if (job->error()) {
    // simulate js error
    QVariantMap error;
    error.insert("name", kErrorMap.value(job->error()));
    error.insert("message", job->errorString());

    auto js_error = callback.engine()->toScriptValue(error);

    callback.call({js_error});
    return;
  }

  // if job is a ReadPasswordJob
  ReadPasswordJob *read_job = dynamic_cast<ReadPasswordJob *>(job);
  if (read_job) {
    callback.call({false, read_job->textData()});
  }

  // if job is a WritePasswordJob
  WritePasswordJob *write_job = dynamic_cast<WritePasswordJob *>(job);
  if (write_job) {
    callback.call({false});
  }

  // if job is a DeletePasswordJob
  DeletePasswordJob *delete_job = dynamic_cast<DeletePasswordJob *>(job);
  if (delete_job) {
    callback.call({false});
  }
}

void RQKeychain::onJobDestroyed() {
  Job *job = static_cast<Job *>(sender());
  m_callback_map.remove(job);
}

// qml registration
void registerRQKeychain() {
  qmlRegisterUncreatableType<RQKeychain>(
      "ReactQML", 1, 0, "RQKeychain",
      "Type RQKeychain cannot be created from QML");
}

Q_COREAPP_STARTUP_FUNCTION(registerRQKeychain)
