extern crate qmetaobject;
use qmetaobject::*;

qrc!(resource,
    "" {
        "main.qml",
    },
);

fn main() {
    // resource
    resource();

    // then load engine
    let mut engine = QmlEngine::new();
    let dev_mode = cfg!(debug_assertions);
    engine.set_property("DEV_MODE".into(), QVariant::from(dev_mode));

    engine.load_file("qrc:///main.qml".into());
    engine.exec();
}
