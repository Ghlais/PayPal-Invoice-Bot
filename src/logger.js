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


import { ChannelType, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { LOG_CATEGORY_NAME, LOG_CHANNEL_INVOICES, LOG_CHANNEL_PRODUCTS, LOG_CHANNEL_ADMIN, LOG_CHANNEL_ERRORS } from './config.js';

/** Ensure a category exists and return it */
async function ensureCategory(guild, name) {
  let cat = guild.channels.cache.find(ch => ch.type === ChannelType.GuildCategory && ch.name === name);
  if (!cat) {
    cat = await guild.channels.create({
      name,
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] }
      ]
    });
  }
  return cat;
}

/** Ensure a text channel under the category */
async function ensureChannel(guild, name) {
  const category = await ensureCategory(guild, LOG_CATEGORY_NAME);
  let ch = guild.channels.cache.find(c => c.type === ChannelType.GuildText && c.name === name);
  if (!ch) {
    ch = await guild.channels.create({
      name,
      type: ChannelType.GuildText,
      parent: category.id
    });
  } else if (ch.parentId !== category.id) {
    await ch.setParent(category.id);
  }
  return ch;
}

export const LogBus = {
  async invoice(guild, payload) {
    const ch = await ensureChannel(guild, LOG_CHANNEL_INVOICES);
    const e = new EmbedBuilder()
      .setTitle('فاتورة جديدة')
      .setColor(0x2b9348)
      .addFields(
        { name: 'العميل', value: payload.customerTag, inline: true },
        { name: 'المنتج', value: payload.productName || 'مخصص', inline: true },
        { name: 'المبلغ', value: `$${Number(payload.amount).toFixed(2)} ${payload.currency}`, inline: true },
        { name: 'المعرف', value: payload.invoiceCode, inline: true },
        { name: 'الرابط', value: payload.link }
      )
      .setTimestamp(Date.now());
    await ch.send({ embeds: [e] });
  },
  async product(guild, payload) {
    const ch = await ensureChannel(guild, LOG_CHANNEL_PRODUCTS);
    const e = new EmbedBuilder()
      .setTitle(payload.action === 'add' ? 'إضافة منتج' : 'حذف منتج')
      .setColor(payload.action === 'add' ? 0x5865F2 : 0xdc2626)
      .setDescription(payload.action === 'add'
        ? `تمت إضافة **${payload.name}** بسعر $${payload.price.toFixed(2)} ${payload.currency}`
        : `تم حذف المنتج #${payload.id}`
      )
      .addFields({ name: 'بواسطة', value: payload.by }).setTimestamp(Date.now());
    await ch.send({ embeds: [e] });
  },
  async admin(guild, payload) {
    const ch = await ensureChannel(guild, LOG_CHANNEL_ADMIN);
    const e = new EmbedBuilder()
      .setTitle('عملية إدارية')
      .setColor(0xf59e0b)
      .addFields(
        { name: 'نوع العملية', value: payload.type },
        { name: 'المستهدف', value: payload.target },
        { name: 'بواسطة', value: payload.by }
      ).setTimestamp(Date.now());
    await ch.send({ embeds: [e] });
  },
  async error(guild, payload) {
    const ch = await ensureChannel(guild, LOG_CHANNEL_ERRORS);
    const e = new EmbedBuilder()
      .setTitle('خطأ')
      .setColor(0xef4444)
      .setDescription('حدث خطأ غير متوقع')
      .addFields({ name: 'التفاصيل', value: '```' + String(payload.error).slice(0,1800) + '```' })
      .setTimestamp(Date.now());
    await ch.send({ embeds: [e] });
  }
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