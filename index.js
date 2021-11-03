/**
 * WechatBot
 *  - https://github.com/gengchen528/wechatBot
 */
const { Wechaty } = require('wechaty');
const schedule = require('./schedule/index');
const config = require('./config/index');
const untils = require('./utils/index');
const superagent = require('./superagent/index');

// 延时函数，防止检测出类似机器人行为操作
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 二维码生成
function onScan(qrcode, status) {
  require('qrcode-terminal').generate(qrcode); // 在console端显示二维码
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('');

  console.log(qrcodeImageUrl);
}

// 登录
async function onLogin(user) {
  console.log(`贴心小助理${user}登录了`);
  const date = new Date()
  console.log(`当前容器时间:${date}`);
  if (config.AUTOREPLY) {
    console.log(`已开启机器人自动聊天模式`);
  }

  // 登陆后创建定时任务
  // await initDay();
}



const question = ['你好','在吗','打卡小程序进不去','1000元打卡失败','打卡了还是失败','学习机赠品','机构','发货','售后','打卡'];
const answer = ['您好老师，目前是下班时间我不在线，您先留言。稍后看到后我会第一时间回复您。',
'您好老师，目前是下班时间我不在线，您先留言。稍后看到后我会第一时间回复您。',
'您好，老师。现在是下班时间我暂时不在线。小程序偶尔出现问题，您等下再试试。如果还是不行，您先留言，我这边记录好后您明天继续接着打卡。',
'您好，1000元的奖学金计划是科大讯飞公司组织制定，您联系学习机人工客服处理，电话：4000199199',
'您好，1000元的奖学金计划是科大讯飞公司组织制定，您联系学习机人工客服处理，电话：4000199199',
'您好，11月1日--11月17日下单学习机赠送以下赠品：<br/>1、价值299的跳舞毯<br/>2、价值960的碎屏险<br/>3、Ai学习机定制手提包<br/>4、连续打卡30天送悟空蛋<br/>5、连续打卡120天送机智侠<br/>',
'您好老师，现在是下班时间我暂时不在线，您可以先给我留言，我看到会第一时间处理，或者您可以拨打我的电话：18982007257与我取得联系~',
'您好，平台下单后会正常发货；学习机周一至周六下午13点截单，13点前的订单当天发，13点后的订单第二天下午发。周日不发货。<br/>其余产品周一至周六下午15点截单，15点前的订单当天发，15点以后第二天下午发发。周日不发货。<br/><br/>如果您这边查询不到订单号，请您不要着急，工作人员会尽快上传单号。',
'您好，我们的售后微信是：<br/>tyyxsh03<br/>请您添加后备注您的代理ID噢~',
'您好，1000元的奖学金计划是科大讯飞公司组织制定，您联系学习机人工客服处理，电话：4000199199',
];

// 登出
function onLogout(user) {
  console.log(`小助手${user} 已经登出`);
}

// 监听对话
async function onMessage(msg) {
  const contact = msg.talker(); // 发消息人
  const content = msg.text().trim(); // 消息内容
  const room = msg.room(); // 是否是群消息
  const alias = await contact.alias() || await contact.name(); // 发消息人备注
  const isText = msg.type() === bot.Message.Type.Text;
  if (msg.self()) {
    return;
  }
  
  if (room && isText) {
    // 如果是群消息 目前只处理文字消息
    const topic = await room.topic();
    console.log(`群名: ${topic} 发消息人: ${await contact.name()} 内容: ${content}`);
  } else if (isText) {
    // 如果非群消息 目前只处理文字消息
    console.log(`发消息人: ${alias} 消息内容: ${content}`);
    // await contact.say('222222');
    // if(content=='在吗' || content=="你好") {
    //   await contact.say("您好老师，目前是下班时间我不在线，您先留言。稍后看到后我会第一时间回复您。")
    // }
    // if(content=="打卡小程序进不去") {

    // }
    // if(question.includes(content)) {
    //   let index = question.findIndex(v=>v==content);
    //   await contact.say(answer[index]);
    // }


    let matchWords;
    question.forEach(async (item,index)=>{
      if(content.indexOf(item)!=-1) {
        await contact.say(answer[index]);
        matchWords +=1;
      }else {
        matchWords = 0;
      }
    })

    await matchWords==0&&contact.say(answer[matchWords]);
    matchWords = null;

    
    










    // if (content.substr(0, 1) == '?' || content.substr(0, 1) == '？') {
    //   let contactContent = content.replace('?', '').replace('？', '');
    //   if (contactContent) {
    //     let res = await superagent.getRubbishType(contactContent);
    //     await delay(2000);
    //     await contact.say(res);
    //   }
    // } else if (config.AUTOREPLY && config.AUTOREPLYPERSON.indexOf(alias) > -1) {
    //   // 如果开启自动聊天且已经指定了智能聊天的对象才开启机器人聊天\
    //   if (content) {
    //     let reply;
    //     if (config.DEFAULTBOT == '0') {
    //       // 天行聊天机器人逻辑
    //       reply = await superagent.getReply(content);
    //       console.log('天行机器人回复：', reply);
    //     } else if (config.DEFAULTBOT == '1') {
    //       // 图灵聊天机器人
    //       reply = await superagent.getTuLingReply(content);
    //       console.log('图灵机器人回复：', reply);
    //     } else if (config.DEFAULTBOT == '2') {
    //       // 天行对接的图灵聊
    //       reply = await superagent.getTXTLReply(content);
    //       console.log('天行对接的图灵机器人回复：', reply);
    //     }
    //     try {
    //       await delay(2000);
    //       await contact.say(reply);
    //     } catch (e) {
    //       console.error(e);
    //     }
    //   }
    // }
  }
}

// 创建微信每日说定时任务
async function initDay() {
  console.log(`已经设定每日说任务`);
  
  schedule.setSchedule(config.SENDDATE, async () => {
    console.log('你的贴心小助理开始工作啦！');
    let logMsg;
    let contact =
      (await bot.Contact.find({ name: config.NICKNAME })) ||
      (await bot.Contact.find({ alias: config.NAME })); // 获取你要发送的联系人
    let one = await superagent.getOne(); //获取每日一句
    let weather = await superagent.getTXweather(); //获取天气信息
    let today = await untils.formatDate(new Date()); //获取今天的日期
    let memorialDay = untils.getDay(config.MEMORIAL_DAY); //获取纪念日天数
    let sweetWord = await superagent.getSweetWord();
    
    // 你可以修改下面的 str 来自定义每日说的内容和格式
    // PS: 如果需要插入 emoji(表情), 可访问 "https://getemoji.com/" 复制插入
    let str = `${today}\n我们在一起的第${memorialDay}天\n\n元气满满的一天开始啦,要开心噢^_^\n\n今日天气\n${weather.weatherTips}\n${weather.todayWeather}\n每日一句:\n${one}\n\n每日土味情话：\n${sweetWord}\n\n————————最爱你的我`;
    try {
      logMsg = str;
      await delay(2000);
      await contact.say(str); // 发送消息
    } catch (e) {
      logMsg = e.message;
    }
    console.log(logMsg);
  });
}

const bot = new Wechaty({
  name: 'WechatEveryDay',
  puppet: 'wechaty-puppet-wechat', // 如果有token，记得更换对应的puppet
  // puppetOptions: {
  //   token: '如果有token，填入wechaty获取的token，并把注释放开'
  // }
});

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);

bot
  .start()
  .then(() => console.log('开始登陆微信'))
  .catch((e) => console.error(e));
