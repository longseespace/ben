#![allow(non_snake_case)]
extern crate qmetaobject;
use qmetaobject::*;

qrc!(my_ressource,
    "" {
        "main.qml",
    },
);

fn main() {
    // resource
    my_ressource();

    // then load engine
    let mut engine = QmlEngine::new();
    engine.load_file("main.qml".into());
    engine.exec();
}
