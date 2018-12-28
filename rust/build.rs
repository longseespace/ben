extern crate fs_extra;

use std::env;
use std::process::Command;
use std::path::*;
use std::str::*;

use fs_extra::dir::*;

fn main() {
    let dev_mode = cfg!(debug_assertions);
    if !dev_mode {
        let out_dir = env::var("OUT_DIR").unwrap();
        let manifest_dir = env::var("CARGO_MANIFEST_DIR").unwrap();
        let res_path = Path::new(&manifest_dir).join("resources");
        let res_out_path = Path::new(&out_dir).join("resources");

        let mut copy_options = CopyOptions::new(); //Initialize default values for CopyOptions
        copy_options.overwrite = true;

        let copy_res = copy(&res_path, &out_dir, &copy_options);

        match copy_res {
            Ok(code) => code,
            Err(err) => {
                panic!("failed to copy resources dir: {}", err)
            }
        };

        let output = Command::new("sh")
            .current_dir(&res_out_path)
            .arg("build_lib.sh")
            .output()
            .unwrap_or_else(|e| panic!("failed to execute process: {}", e));

        if !output.status.success() {
            panic!("Cannot build qrc resource:\n{:#?}\n{:#?}",
                   to_utf(&output.stdout),
                   to_utf(&output.stderr));
        }

        let qml_path = Path::new(&manifest_dir).join("resources").join("qml");
        let bundle_path = Path::new(&manifest_dir).join("resources").join("qml").join("bundle.qrc");

        println!("cargo:rerun-if-changed={}", qml_path.display());
        println!("cargo:rerun-if-changed={}", bundle_path.display());
        println!("cargo:rustc-link-search=native={}", res_out_path.display());
        println!("cargo:rustc-link-lib=static=qrc");
    }
}

fn to_utf(buf: &[u8]) -> &str {
    match from_utf8(buf) {
        Ok(v) => v,
        Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
    }
}
