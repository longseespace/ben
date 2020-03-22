#ifndef RQ_H
#define RQ_H

#include "rqnetworkaccessmanagerfactory.h"

#include <QObject>
#include <QQmlComponent>
#include <QQmlContext>
#include <QQmlEngine>
#include <QQuickWindow>

class RQ : public QObject {
    Q_OBJECT
  public:
    explicit RQ(QQmlEngine *engine);
    ~RQ();

    static QObject *qmlInstance(QQmlEngine *engine, QJSEngine *scriptEngine);

    Q_INVOKABLE void clearCache();
    Q_INVOKABLE QObject *createTimer();
    Q_INVOKABLE QObject *createWebSocket();
    Q_INVOKABLE void setBadgeLabelText(const QString &text);
    Q_INVOKABLE void hideTitleBar(QQuickWindow *window);

  private slots:
    void onQmlWarnings(const QList<QQmlError> &warnings);

  signals:
    void errors(const QVariantList &errors);
    void reloadStarted();
    void reloadFinished();

  private:
    QQmlEngine *m_engine;
    QQmlContext *m_timer_context;
    QQmlComponent *m_timer_component;

    QQmlContext *m_ws_context;
    QQmlComponent *m_ws_component;

    RQNetworkAccessManagerFactory *m_nam;
};

#endif // RQ_H
