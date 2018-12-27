#![allow(non_snake_case)]
extern crate qmetaobject;
use qmetaobject::*;

// qrc!(resource,
//     "" {
//         "main.qml",
//     },
// );

fn main() {
    // resource
    // resource();

    // then load engine
    let mut engine = QmlEngine::new();
    engine.load_file("qrc:///main.qml".into());
    engine.exec();
}
