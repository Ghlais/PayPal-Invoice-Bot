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



import 'dotenv/config';

export const PREFIX = process.env.PREFIX || '!';
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const STORE_NAME = process.env.STORE_NAME || 'Zyno Store';
export const STORE_URL = process.env.STORE_URL || 'https://discord.gg';
export const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY || 'USD';
export const PAYPAL_BUSINESS_EMAIL = process.env.PAYPAL_BUSINESS_EMAIL;
export const MANAGER_ROLE_IDS = (process.env.MANAGER_ROLE_IDS || '')
  .split(',').map(s => s.trim()).filter(Boolean);

if (!DISCORD_TOKEN) { console.error('Missing DISCORD_TOKEN in .env'); process.exit(1); }
if (!PAYPAL_BUSINESS_EMAIL) { console.error('Missing PAYPAL_BUSINESS_EMAIL in .env'); process.exit(1); }

export const LOG_CATEGORY_NAME = process.env.LOG_CATEGORY_NAME || 'x3-logs';
export const LOG_CHANNEL_INVOICES = process.env.LOG_CHANNEL_INVOICES || 'log-invoices';
export const LOG_CHANNEL_PRODUCTS = process.env.LOG_CHANNEL_PRODUCTS || 'log-products';
export const LOG_CHANNEL_ADMIN = process.env.LOG_CHANNEL_ADMIN || 'log-admin';
export const LOG_CHANNEL_ERRORS = process.env.LOG_CHANNEL_ERRORS || 'log-errors';




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