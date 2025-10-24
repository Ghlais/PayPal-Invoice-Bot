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



import { Client, GatewayIntentBits, Partials, Events } from 'discord.js';
import { PREFIX, DISCORD_TOKEN, DEFAULT_CURRENCY, STORE_NAME, STORE_URL, MANAGER_ROLE_IDS } from './config.js';
import { Owners, Managers, Products, Invoices } from './db.js';
import { buildPayPalLink, newInvoiceCode } from './utils/paypal.js';
import { helpEmbed, invoiceEmbed, productListEmbed } from './embed.js';
import { LogBus } from './logger.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const isOwner = (userId) => Owners.isOwner(userId);
const isManagerUser = (userId) => Managers.isManager(userId);
const hasManagerRole = (member) => MANAGER_ROLE_IDS.length && member?.roles?.cache?.some(r => MANAGER_ROLE_IDS.includes(r.id));
const canAdmin = (msg) => isOwner(msg.author.id) || isManagerUser(msg.author.id) || hasManagerRole(msg.member);

client.once(Events.ClientReady, async c => {
  console.log(`Logged in as ${c.user.tag}`);
  for (const [id, g] of c.guilds.cache) {
    try {
      await LogBus.invoice(g, { customerTag: 'bootstrap', productName: 'init', amount: 0, currency: 'USD', invoiceCode: 'init', link: 'https://example.com' });
      await LogBus.product(g, { action: 'add', name: 'init', price: 0, currency: 'USD', by: 'system' });
      await LogBus.admin(g, { type: 'bootstrap', target: 'logs', by: 'system' });
    } catch {}
  }
  if (Owners.list().length === 0) {
    console.log('No owners set yet. Use !اضافة_مالك @user or run with --init');
  }
});

client.on(Events.MessageCreate, async (msg) => {
  if (msg.author.bot || !msg.guild) return;
  if (!msg.content.startsWith(PREFIX)) return;
  const [cmd, ...rest] = msg.content.slice(PREFIX.length).trim().split(/\s+/);

  try {
    if (['مساعدة','help','الاوامر'].includes(cmd)) {
      return msg.reply({ embeds: [helpEmbed(PREFIX)] });
    }
    if (['معلومات','info'].includes(cmd)) {
      return msg.reply({ content: `**${STORE_NAME}**\n${STORE_URL}\n\n\`${PREFIX}مساعدة\` لعرض الأوامر` });
    }
    if (['المنتجات','products'].includes(cmd)) {
      const list = Products.all();
      return msg.reply({ embeds: [productListEmbed(list, PREFIX)] });
    }
    if (['فاتورة','invoice'].includes(cmd)) {
      if (rest.length < 1) return msg.reply('استخدم: !فاتورة <المبلغ> [الوصف]');
      const amount = Number(rest.shift());
      if (Number.isNaN(amount) || amount <= 0) return msg.reply('المبلغ غير صالح');
      const description = rest.join(' ') || 'خدمة مخصصة';
      const code = newInvoiceCode();
      const link = buildPayPalLink({ amount, currency: DEFAULT_CURRENCY, itemName: description, invoiceCode: code });
      Invoices.create({ code, userId: msg.author.id, productId: null, amount, currency: DEFAULT_CURRENCY, description, link });
      const { embed, row } = invoiceEmbed({
        customerTag: msg.author.tag, productName: 'مخصص', amount, currency: DEFAULT_CURRENCY, invoiceCode: code, link
      });
      await LogBus.invoice(msg.guild, { customerTag: msg.author.tag, productName: 'مخصص', amount, currency: DEFAULT_CURRENCY, invoiceCode: code, link });
      await LogBus.invoice(msg.guild, { customerTag: msg.author.tag, productName: product.name, amount, currency: product.currency || DEFAULT_CURRENCY, invoiceCode: code, link });
      return msg.reply({ embeds: [embed], components: [row] });
    }
    if (['فاتورة_منتج','buy_invoice','شراء_منتج','شراء'].includes(cmd)) {
      if (rest.length < 1) return msg.reply('استخدم: !شراء_منتج <معرف> [الكمية]');
      const id = Number(rest.shift());
      const qty = Number(rest.shift() || '1');
      if (!id || qty <= 0) return msg.reply('بيانات غير صالحة');
      const product = Products.get(id);
      if (!product) return msg.reply('المنتج غير موجود');
      const amount = Number(product.price) * qty;
      const code = newInvoiceCode();
      const name = `${product.name} × ${qty}`;
      const link = buildPayPalLink({ amount, currency: product.currency || DEFAULT_CURRENCY, itemName: name, invoiceCode: code });
      Invoices.create({ code, userId: msg.author.id, productId: id, amount, currency: product.currency || DEFAULT_CURRENCY, description: name, link });
      const { embed, row } = invoiceEmbed({
        customerTag: msg.author.tag, productName: product.name, amount, currency: product.currency || DEFAULT_CURRENCY, invoiceCode: code, link
      });
      await LogBus.invoice(msg.guild, { customerTag: msg.author.tag, productName: 'مخصص', amount, currency: DEFAULT_CURRENCY, invoiceCode: code, link });
      return msg.reply({ embeds: [embed], components: [row] });
    }

    // Admin & Owner
    if (['اضافة_مالك','add_owner'].includes(cmd)) {
      if (!canAdmin(msg)) return msg.reply('هذا الامر للمالك والمسؤول فقط');
      const user = msg.mentions.users.first();
      if (!user) return msg.reply('اذكر المستخدم المراد إضافته');
      Owners.add(user.id);
      try { await LogBus.admin(msg.guild, { type: 'اضافة_مالك', target: `<@${user.id}>`, by: `<@${msg.author.id}>` }); } catch {}
      return msg.reply(`تم إضافة <@${user.id}> إلى قائمة الملاك`);
    }
    if (['ازالة_مالك','remove_owner'].includes(cmd)) {
      if (!canAdmin(msg)) return msg.reply('هذا الامر للمالك والمسؤول فقط');
      const user = msg.mentions.users.first();
      if (!user) return msg.reply('اذكر المستخدم المراد إزالته');
      Owners.remove(user.id);
      try { await LogBus.admin(msg.guild, { type: 'ازالة_مالك', target: `<@${user.id}>`, by: `<@${msg.author.id}>` }); } catch {}
      return msg.reply(`تم إزالة <@${user.id}> من قائمة الملاك`);
    }
    if (['قائمة_الملاك','owners'].includes(cmd)) {
      if (!canAdmin(msg)) return msg.reply('هذا الامر للمالك والمسؤول فقط');
      const list = Owners.list();
      if (!list.length) return msg.reply('لا يوجد ملاك مسجلين');
      return msg.reply(list.map(o => `<@${o.user_id}>`).join('\n'));
    }

    if (['اضافة_مسؤول','add_manager'].includes(cmd)) {
      if (!canAdmin(msg)) return msg.reply('هذا الامر للمالك والمسؤول فقط');
      const user = msg.mentions.users.first();
      if (!user) return msg.reply('اذكر المستخدم المراد إضافته');
      Managers.add(user.id);
      try { await LogBus.admin(msg.guild, { type: 'اضافة_مسؤول', target: `<@${user.id}>`, by: `<@${msg.author.id}>` }); } catch {}
      return msg.reply(`تم إضافة <@${user.id}> كمسؤول`);
    }
    if (['ازالة_مسؤول','remove_manager'].includes(cmd)) {
      if (!canAdmin(msg)) return msg.reply('هذا الامر للمالك والمسؤول فقط');
      const user = msg.mentions.users.first();
      if (!user) return msg.reply('اذكر المستخدم المراد إزالته');
      Managers.remove(user.id);
      try { await LogBus.admin(msg.guild, { type: 'ازالة_مسؤول', target: `<@${user.id}>`, by: `<@${msg.author.id}>` }); } catch {}
      return msg.reply(`تم إزالة <@${user.id}> من المسؤولين`);
    }
    if (['قائمة_المسؤولين','managers'].includes(cmd)) {
      if (!canAdmin(msg)) return msg.reply('هذا الامر للمالك والمسؤول فقط');
      const list = Managers.list();
      if (!list.length) return msg.reply('لا يوجد مسؤولين مسجلين');
      return msg.reply(list.map(o => `<@${o.user_id}>`).join('\n'));
    }

    if (['اضافة_منتج','add_product'].includes(cmd)) {
      if (!canAdmin(msg)) return msg.reply('هذا الامر للمالك والمسؤول فقط');
      const idxDash = msg.content.indexOf('-');
      const argsPart = msg.content.slice(PREFIX.length + cmd.length).trim();
      const beforeDash = (idxDash > -1 ? argsPart.slice(0, argsPart.indexOf('-')) : argsPart).trim();
      const afterDash = (idxDash > -1 ? argsPart.slice(argsPart.indexOf('-') + 1) : '').trim();
      const parts = beforeDash.split(/\s+/);
      const price = Number(parts.pop());
      const name = parts.join(' ');
      if (!name || Number.isNaN(price)) return msg.reply('استخدم: !اضافة_منتج <اسم> <السعر> - <الوصف الاختياري>');
      const currency = DEFAULT_CURRENCY;
      const info = { name, price, currency, description: afterDash };
      const res = Products.add(info);
      try { await LogBus.product(msg.guild, { action: 'add', name, price, currency, by: `<@${msg.author.id}>` }); } catch {}
      return msg.reply(`تمت إضافة المنتج #${res.lastInsertRowid} • ${name} بسعر $${price.toFixed(2)} ${currency}`);
    }
    if (['حذف_منتج','remove_product'].includes(cmd)) {
      if (!canAdmin(msg)) return msg.reply('هذا الامر للمالك والمسؤول فقط');
      const id = Number(rest[0]);
      if (!id) return msg.reply('استخدم: !حذف_منتج <المعرف>');
      Products.remove(id);
      try { await LogBus.product(msg.guild, { action: 'remove', id, by: `<@${msg.author.id}>` }); } catch {}
      return msg.reply(`تم حذف المنتج #${id}`);
    }

  } catch (err) {
    try { await LogBus.error(msg.guild, { error: err.stack || err }); } catch {}

    console.error(err);
    return msg.reply('حدث خطأ غير متوقع');
  }
});

if (process.argv.includes('--init')) {
  try {
    // ضع آي دي مالكك هنا مرة واحدة ثم شغل npm run init
    // Owners.add('OWNER_USER_ID');
  } catch (e) {console.error(e);}
}

client.login(DISCORD_TOKEN);



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