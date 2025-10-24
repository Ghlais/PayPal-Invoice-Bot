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



import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { STORE_NAME, STORE_URL } from './config.js';

export function helpEmbed(prefix = '!') {
  const e = new EmbedBuilder()
    .setTitle('بوت الفواتير 🤖')
    .setDescription('بوت إنشاء فواتير PayPal مع إدارة المنتجات')
    .addFields(
      { name: 'أوامر التسوق', value: `\`${prefix}المنتجات\` • عرض قائمة المنتجات\n\`${prefix}شراء_منتج [معرف] [كمية]\` • شراء منتج محدد\n\`${prefix}فاتورة_منتج [معرف] [كمية]\` • إنشاء فاتورة لمنتج\n\`${prefix}فاتورة [مبلغ] [وصف]\` • إنشاء فاتورة مخصصة` },
      { name: 'أوامر الإدارة للمالك والمسؤول', value: `\`${prefix}اضافة_منتج [الاسم] [السعر] [- الوصف]\`\n\`${prefix}حذف_منتج [معرف]\`\n\`${prefix}اضافة_مالك [@المستخدم]\`\n\`${prefix}ازالة_مالك [@المستخدم]\`\n\`${prefix}قائمة_الملاك\`\n\`${prefix}اضافة_مسؤول [@المستخدم]\`\n\`${prefix}ازالة_مسؤول [@المستخدم]\`\n\`${prefix}قائمة_المسؤولين\`` },
      { name: 'أوامر عامة', value: `\`${prefix}مساعدة\`\n\`${prefix}معلومات\`` },
    )
    .setFooter({ text: `${STORE_NAME} | ${STORE_URL}` });
  return e;
}

export function invoiceEmbed({ customerTag, productName, amount, currency, invoiceCode, link }) {
  const e = new EmbedBuilder()
    .setColor(0x36a64f)
    .setTitle(`تم إنشاء فاتورة ${STORE_NAME} ✅`)
    .addFields(
      { name: 'العميل', value: customerTag, inline: true },
      { name: 'المنتج', value: productName || 'مخصص', inline: true },
      { name: 'المبلغ', value: `$${Number(amount).toFixed(2)} ${currency}`, inline: true },
      { name: 'PayPal رابط الدفع', value: `[اضغط هنا للدفع](${link})` },
      { name: 'معرف الفاتورة', value: invoiceCode }
    )
    .setFooter({ text: `${STORE_NAME} • بعد الدفع يرجى إرسال لقطة شاشة لتأكيد العملية` });
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(link).setLabel('ادفع الآن 💳')
  );
  return { embed: e, row };
}

export function productListEmbed(products, prefix='!') {
  const e = new EmbedBuilder().setTitle('قائمة المنتجات').setColor(0x5865F2);
  if (!products.length) {
    e.setDescription('لا توجد منتجات مضافة بعد');
  } else {
    e.setDescription(products.map(p => `**#${p.id}** • ${p.name} — $${p.price.toFixed(2)} ${p.currency}\n${p.description ? `> ${p.description}` : ''}`).join('\n\n'));
    e.addFields({ name: 'للشراء', value: `اكتب \`${prefix}شراء_منتج <المعرف> <الكمية>\`` });
  }
  return e;
}



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