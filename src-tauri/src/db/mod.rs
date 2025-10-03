extern crate rocksdb;
use rocksdb::{IteratorMode, DB};

fn default_namespace(namespace: Option<&str>) -> &str {
    namespace.unwrap_or("db")
}

fn make_db_path(namespace: Option<&str>) -> String {
    let namespace = default_namespace(namespace);

    let home_dir = dirs::home_dir().unwrap();
    // create folder .pntools
    let mut path = home_dir.join(".pntools");
    std::fs::create_dir_all(path.clone()).unwrap();
    // create file db
    path = path.join(format!("db.{}", namespace));
    // return path
    path.to_str().unwrap().to_string()
}

fn open_db(namespace: Option<&str>) -> DB {
    let path = make_db_path(namespace);
    let db = DB::open_default(path).unwrap();
    return db;
}

pub fn put(k: &str, v: &str, namespace: Option<&str>) {
    let path = make_db_path(namespace);
    let db = DB::open_default(path).unwrap();
    db.put(k, v).unwrap();
    // println!("SET key: {}, value: {}", k, v);
}

pub fn get(k: &str, namespace: Option<&str>) -> String {
    let path = make_db_path(namespace);
    let db = DB::open_default(path).unwrap();
    let value = db.get(k).unwrap();
    match value {
        Some(v) => {
            let s = String::from_utf8(v).unwrap();
            // println!("GET SOME key: {}, value: {}", k, s);
            return s;
        }
        None => {
            // println!("GET NONE key: {}, value: None", k);
            return String::from("None");
        }
    }
}

// get all keys
pub fn get_all(namespace: Option<&str>) -> Vec<String> {
    let db = open_db(namespace);
    let mut keys: Vec<String> = Vec::new();
    let iterator = db.iterator(IteratorMode::Start);
    for result in iterator {
        let (key, _) = result.unwrap();
        let key_str = String::from_utf8_lossy(&key);
        // println!("Key: {}", key_str);
        keys.push(key_str.to_string());
    }
    return keys;
}

// remove by key
pub fn remove_key(k: &str, namespace: Option<&str>) {
    let path = make_db_path(namespace);
    let db = DB::open_default(path).unwrap();
    db.delete(k).unwrap();
    // println!("REMOVE key: {}", k);
}
