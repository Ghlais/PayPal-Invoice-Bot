//                                                                                                
//                                                                                                
//            GGGGGGGGGGGGGhhhhhhh             lllllll                     iiii                   
//         GGG::::::::::::Gh:::::h             l:::::l                    i::::i                  
//       GG:::::::::::::::Gh:::::h             l:::::l                     iiii                   
//      G:::::GGGGGGGG::::Gh:::::h             l:::::l                                            
//     G:::::G       GGGGGG h::::h hhhhh        l::::l   aaaaaaaaaaaaa   iiiiiii     ssssssssss   
//    G:::::G               h::::hh:::::hhh     l::::l   a::::::::::::a  i:::::i   ss::::::::::s  
//    G:::::G               h::::::::::::::hh   l::::l   aaaaaaaaa:::::a  i::::i ss:::::::::::::s 
//    G:::::G    GGGGGGGGGG h:::::::hhh::::::h  l::::l            a::::a  i::::i s::::::ssss:::::s
//    G:::::G    G::::::::G h::::::h   h::::::h l::::l     aaaaaaa:::::a  i::::i  s:::::s  ssssss 
//    G:::::G    GGGGG::::G h:::::h     h:::::h l::::l   aa::::::::::::a  i::::i    s::::::s      
//    G:::::G        G::::G h:::::h     h:::::h l::::l  a::::aaaa::::::a  i::::i       s::::::s   
//     G:::::G       G::::G h:::::h     h:::::h l::::l a::::a    a:::::a  i::::i ssssss   s:::::s 
//      G:::::GGGGGGGG::::G h:::::h     h:::::hl::::::la::::a    a:::::a i::::::is:::::ssss::::::s
//       GG:::::::::::::::G h:::::h     h:::::hl::::::la:::::aaaa::::::a i::::::is::::::::::::::s 
//         GGG::::::GGG:::G h:::::h     h:::::hl::::::l a::::::::::aa:::ai::::::i s:::::::::::ss  
//            GGGGGG   GGGG hhhhhhh     hhhhhhhllllllll  aaaaaaaaaa  aaaaiiiiiiii  sssssssssss    
//                                                                                                
//                                                                                                
//                                                                                                
//                                                                                                
//                                                                                                
//                                                                                                
//                                                                                                



import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const dbPath = path.join(process.cwd(), 'data.sqlite');
fs.mkdirSync(process.cwd(), { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS owners (
  user_id TEXT PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS managers (
  user_id TEXT PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_code TEXT NOT NULL,
  user_id TEXT NOT NULL,
  product_id INTEGER NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  description TEXT,
  paypal_link TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

export const Owners = {
  add: (userId) => db.prepare('INSERT OR IGNORE INTO owners (user_id) VALUES (?)').run(userId),
  remove: (userId) => db.prepare('DELETE FROM owners WHERE user_id = ?').run(userId),
  list: () => db.prepare('SELECT user_id FROM owners').all(),
  isOwner: (userId) => !!db.prepare('SELECT 1 FROM owners WHERE user_id = ?').get(userId),
};

export const Managers = {
  add: (userId) => db.prepare('INSERT OR IGNORE INTO managers (user_id) VALUES (?)').run(userId),
  remove: (userId) => db.prepare('DELETE FROM managers WHERE user_id = ?').run(userId),
  list: () => db.prepare('SELECT user_id FROM managers').all(),
  isManager: (userId) => !!db.prepare('SELECT 1 FROM managers WHERE user_id = ?').get(userId),
};

export const Products = {
  add: ({ name, price, currency, description }) =>
    db.prepare('INSERT INTO products (name, price, currency, description) VALUES (?, ?, ?, ?)')
      .run(name, price, currency, description || ''),
  remove: (id) => db.prepare('DELETE FROM products WHERE id = ?').run(id),
  get: (id) => db.prepare('SELECT * FROM products WHERE id = ?').get(id),
  all: () => db.prepare('SELECT * FROM products ORDER BY id ASC').all(),
};

export const Invoices = {
  create: ({ code, userId, productId, amount, currency, description, link }) =>
    db.prepare('INSERT INTO invoices (invoice_code, user_id, product_id, amount, currency, description, paypal_link) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(code, userId, productId, amount, currency, description || '', link),
  findByCode: (code) => db.prepare('SELECT * FROM invoices WHERE invoice_code = ?').get(code),
  listByUser: (userId) => db.prepare('SELECT * FROM invoices WHERE user_id = ? ORDER BY id DESC LIMIT 20').all(userId),
  listRecent: () => db.prepare('SELECT * FROM invoices ORDER BY id DESC LIMIT 20').all(),
};




//                                                                                                
//                                                                                                
//            GGGGGGGGGGGGGhhhhhhh             lllllll                     iiii                   
//         GGG::::::::::::Gh:::::h             l:::::l                    i::::i                  
//       GG:::::::::::::::Gh:::::h             l:::::l                     iiii                   
//      G:::::GGGGGGGG::::Gh:::::h             l:::::l                                            
//     G:::::G       GGGGGG h::::h hhhhh        l::::l   aaaaaaaaaaaaa   iiiiiii     ssssssssss   
//    G:::::G               h::::hh:::::hhh     l::::l   a::::::::::::a  i:::::i   ss::::::::::s  
//    G:::::G               h::::::::::::::hh   l::::l   aaaaaaaaa:::::a  i::::i ss:::::::::::::s 
//    G:::::G    GGGGGGGGGG h:::::::hhh::::::h  l::::l            a::::a  i::::i s::::::ssss:::::s
//    G:::::G    G::::::::G h::::::h   h::::::h l::::l     aaaaaaa:::::a  i::::i  s:::::s  ssssss 
//    G:::::G    GGGGG::::G h:::::h     h:::::h l::::l   aa::::::::::::a  i::::i    s::::::s      
//    G:::::G        G::::G h:::::h     h:::::h l::::l  a::::aaaa::::::a  i::::i       s::::::s   
//     G:::::G       G::::G h:::::h     h:::::h l::::l a::::a    a:::::a  i::::i ssssss   s:::::s 
//      G:::::GGGGGGGG::::G h:::::h     h:::::hl::::::la::::a    a:::::a i::::::is:::::ssss::::::s
//       GG:::::::::::::::G h:::::h     h:::::hl::::::la:::::aaaa::::::a i::::::is::::::::::::::s 
//         GGG::::::GGG:::G h:::::h     h:::::hl::::::l a::::::::::aa:::ai::::::i s:::::::::::ss  
//            GGGGGG   GGGG hhhhhhh     hhhhhhhllllllll  aaaaaaaaaa  aaaaiiiiiiii  sssssssssss    
//                                                                                                
//                                                                                                
//                                                                                                
//                                                                                                
//                                                                                                
//                                                                                                
//                                                                                                