// build_osho.js - 生成 osho-zen-cards.js
// 运行: node build_osho.js

const fs = require('fs');
const path = require('path');

function e(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function makeCard(c) {
  let lines = ['  {', `    id: ${c.id},`, `    name: "${e(c.name)}",`, `    originalName: "${e(c.originalName)}",`, `    suit: "${c.suit}",`];
  if (c.number !== undefined) lines.push(`    number: ${c.number},`);
  if (c.element) lines.push(`    element: "${c.element}",`);
  if (c.keywords && c.keywords.length > 0) {
    const kw = c.keywords.map(k => `"${e(k)}"`).join(', ');
    lines.push(`    keywords: [${kw}],`);
  } else {
    lines.push('    keywords: [],');
  }
  lines.push(`    uprightBrief: "${e(c.uprightBrief)}",`);
  lines.push(`    reversedBrief: "${e(c.reversedBrief)}",`);
  lines.push(`    imageUrl: "${c.imageUrl}",`);
  lines.push(`    upright: "${e(c.upright)}",`);
  lines.push(`    reversed: "${e(c.reversed)}",`);
  if (c.upright_en && c.reversed_en) {
    lines.push('    translations: {');
    lines.push('      en: {');
    lines.push(`        upright: "${e(c.upright_en)}",`);
    lines.push(`        reversed: "${e(c.reversed_en)}"`);
    lines.push('      }');
    lines.push('    },');
  }
  lines.push('  },');
  return lines.join('\n');
}

// ============ 大阿卡纳 23张 ============
const major = [
  {id:0,name:"愚者",originalName:"The Fool",suit:"major",element:"风",
   keywords:["当下","信任","自由","空白","冒险"],
   uprightBrief:"完全信任当下的冒险",reversedBrief:"恐惧阻止了跳跃",
   upright:"你正站在悬崖边，脚下是虚空。这不是危险——这是自由。愚者提醒你：当下这一刻，你什么都不知道，而这正是礼物。放下对结果的控制，跳进未知。你的心知道路。",
   reversed:"恐惧在对你说话，而不是直觉。你在计算风险，却忘记了生命本身就是风险。愚者邀请你：即使害怕也要行动。不跳，你永远不会知道飞翔是什么感觉。",
   upright_en:"You are standing at the edge of a cliff, with emptiness below. This is not danger—this is freedom. The Fool reminds you: in this very moment, you know nothing, and that is the gift. Drop the need to control the outcome. Jump into the unknown. Your heart knows the way.",
   reversed_en:"Fear is speaking, not intuition. You are calculating risks, forgetting that life itself is a risk. The Fool invites you: act even while afraid. If you don't jump, you'll never know what flying feels like."},
  {id:1,name:"存在",originalName:"Existence",suit:"major",element:"空",
   keywords:["当下","觉知","存在","静心","接受"],
   uprightBrief:"全然活在当下",reversedBrief:"逃避此刻",
   upright:"此刻，你在这里。不在过去，不在未来。存在提醒你：生命只发生在当下。停止追逐下一个时刻，停止重温上一个时刻。深呼吸，感受你正在呼吸。这就是禅——什么都不做，只是存在。",
   reversed:"你的身体在这里，但你的心在别处。你在回忆昨天，在计划明天，唯独没有活在今天。存在邀请你：把注意力带回来。此刻的呼吸，此刻的感受，此刻的你是足够的。",
   upright_en:"This moment, you are here. Not in the past, not in the future. Existence reminds you: life only happens now. Stop chasing the next moment, stop replaying the last. Breathe deeply. Feel yourself breathing. This is Zen—doing nothing, just being.",
   reversed_en:"Your body is here, but your heart is elsewhere. You are remembering yesterday, planning tomorrow, never living today. Existence invites you: bring your attention back. This breath, this feeling, this you—is enough."},
  {id:2,name:"寂静",originalName:"Silence",suit:"major",element:"空",
   keywords:["静心","内在声音","空性","聆听","宁静"],
   uprightBrief:"在寂静中找到答案",reversedBrief:"噪音淹没了直觉",
   upright:"答案不在言语中，在寂静中。你一直在向外寻找，但寂静提醒你：关掉所有的声音——别人的意见、自己的分析、手机的提示——然后聆听。那个沉默中的低语，就是你的真相。每天给自己十分钟，什么都不做，只是坐着。",
   reversed:"你的内在充满了噪音。别人的声音、社会的期待、未解决的问题在你脑中循环播放。寂静邀请你：不要试图「制造」安静，只是观察噪音。当你不再认同那些声音，寂静自然降临。",
   upright_en:"The answer is not in words, but in silence. You have been looking outward, but Silence reminds you: turn off all voices—others' opinions, your own analysis, phone notifications—then listen. That whisper in the silence is your truth. Give yourself ten minutes daily to simply sit.",
   reversed_en:"Your inner world is full of noise. Others' voices, social expectations, unresolved issues loop in your mind. Silence invites you: don't try to 'create' quiet, just watch the noise. When you stop identifying with those voices, silence naturally descends."},
  {id:3,name:"创造力",originalName:"Creativity",suit:"major",element:"火",
   keywords:["创造","表达","灵感","游戏","流动"],
   uprightBrief:"通过创造表达真实的自己",reversedBrief:"创造力被阻塞",
   upright:"创造力不是「有才华的人才有」——它是你存在的本质。创造力提醒你：当你在玩耍、在表达、在流动的时候，你最接近自己。不要问「这有用吗」，问「这让我活着吗」。今天做一件没有任何目的的事，纯粹为了快乐。",
   reversed:"你在等待「灵感到来」——但它不会以你想要的方式到来。创造力邀请你：先行动，灵感会跟上。不要评判自己的作品。创造的过程比结果更重要。拿起笔、乐器、或只是跳舞——让能量流动。",
   upright_en:"Creativity is not 'for talented people only'—it is the essence of your existence. Creativity reminds you: when you are playing, expressing, flowing, you are closest to yourself. Don't ask 'is this useful?' Ask 'does this make me feel alive?' Do one thing today with no purpose, purely for joy.",
   reversed_en:"You are waiting for 'inspiration to arrive'—but it won't come the way you want. Creativity invites you: act first, inspiration will follow. Don't judge your creation. The process matters more than the result. Pick up a pen, an instrument, or just dance—let the energy flow."},
  {id:4,name:"评判",originalName:"Judgment",suit:"major",element:"火",
   keywords:["觉察","不评判","接受","放下","慈悲"],
   uprightBrief:"觉察评判而不认同",reversedBrief:"陷入评判和指责",
   upright:"你正在评判——评判自己，评判别人，评判情况。评判提醒你：这不是坏事，但你可以觉察它而不被它控制。看到评判的念头，然后放下。每个人都在做他们能做的事。慈悲从停止评判开始。今天，每当你发现自己在评判，深呼吸，说：「我看到了这个念头，但我不需要相信它。」",
   reversed:"评判已经变成了攻击。你在指责别人，也在指责自己。评判邀请你：看看评判背后是什么——通常是恐惧或痛苦。你不需要「fix」任何人或事。接受此刻的本来面目，包括你自己。当你停止评判，爱才有空间进入。",
   upright_en:"You are judging—yourself, others, situations. Judgment reminds you: this is not bad, but you can witness it without being controlled by it. See the judging thought, then let go. Everyone is doing the best they can. Compassion begins where judgment ends. Today, whenever you catch yourself judging, breathe and say: 'I see this thought, but I don't have to believe it.'",
   reversed_en:"Judgment has turned into attack. You are blaming others, and yourself. Judgment invites you: look at what's beneath the judgment—usually fear or pain. You don't need to 'fix' anyone or anything. Accept this moment as it is, including yourself. When you stop judging, love has space to enter."},
  {id:5,name:"过去",originalName:"The Past",suit:"major",element:"水",
   keywords:["放下","释放","回忆","学习","宽恕"],
   uprightBrief:"从过去中学习并释放",reversedBrief:"被困在过去的记忆中",
   upright:"过去已经发生了，你不能改变它。但你可以改变你和过去的关系。过去提醒你：回忆是老师，不是监狱。问问自己：这个记忆想教我什么？然后让它走。今天，做一件象征性的释放——写一封信然后烧掉，或说一句「我原谅，包括我自己」。",
   reversed:"你在重播旧的磁带。同样的伤口，同样的故事，同样的痛苦——但那是昨天的你，不是今天的你。过去邀请你：看到你正在用过去定义自己。你不是你的创伤，不是你的错误，不是别人的评价。此刻，你是自由的。选择自由。",
   upright_en:"The past has happened; you cannot change it. But you can change your relationship with it. The Past reminds you: memory is a teacher, not a prison. Ask: what is this memory trying to teach me? Then let it go. Today, do something symbolic—write a letter and burn it, or say 'I forgive, including myself.'",
   reversed_en:"You are replaying old tapes. Same wound, same story, same pain—but that was yesterday's you, not today's. The Past invites you: see that you are using the past to define yourself. You are not your trauma, not your mistakes, not others' opinions. Right now, you are free. Choose freedom."},
  {id:6,name:"未来",originalName:"The Future",suit:"major",element:"风",
   keywords:["信任","未知","可能性","开放","不执着"],
   uprightBrief:"开放地迎接未知",reversedBrief:"焦虑地试图控制未来",
   upright:"未来还没有发生，你不需要现在就解决它。未来提醒你：焦虑是对「可能永远不会发生的事」征税。深呼吸，回到此刻。此刻你是安全的。信任生命会像它一直做的那样继续支持你。列出三件你担心的「未来」，然后划掉它们——它们大多不会发生。",
   reversed:"你在试图控制未来，但未来不喜欢被控制。未来邀请你：区分「计划」和「执着」。计划是有用的，执着是痛苦的。你不是通过担心来保护自己——你是通过信任来保护自己。放下对特定结果的执着，看看会发生什么。",
   upright_en:"The future hasn't happened yet; you don't need to solve it now. The Future reminds you: anxiety is a tax on things that may never happen. Breathe deeply, return to this moment. In this moment you are safe. Trust that life will continue to support you as it always has. List three things you're worrying about, then cross them out—most won't happen.",
   reversed_en:"You are trying to control the future, but the future doesn't like being controlled. The Future invites you: distinguish between 'planning' and 'attachment.' Planning is useful; attachment is suffering. You don't protect yourself by worrying—you protect yourself by trusting. Drop the attachment to a specific outcome and see what happens."},
  {id:7,name:"改变",originalName:"Change",suit:"major",element:"水",
   keywords:["流动","适应","无常","放下","新生"],
   uprightBrief:"拥抱改变，顺流而行",reversedBrief:"抗拒改变，紧抓过去",
   upright:"改变正在发生——它一直在发生。改变提醒你：紧抓不变的东西是痛苦的，因为没有什么是不变的。不要抗拒，顺流而行。问问自己：如果我不害怕改变，我会做什么？然后去做。改变不是失去，是能量的重新安排。今天，主动做一件你一直抗拒的小改变。",
   reversed:"你在抗拒改变，就像河流中的石头试图阻止水流。改变邀请你：看看你在紧抓什么——一个身份？一段关系？一种习惯？紧抓让你痛苦，不是改变本身。放手不是放弃，是信任生命有更好的安排。深呼吸，说：「我愿意改变。」",
   upright_en:"Change is happening—it has always been happening. Change reminds you: clinging to what cannot stay is suffering, because nothing stays. Don't resist; flow with it. Ask: if I weren't afraid of change, what would I do? Then do it. Change is not loss; it's energy rearranging itself. Today, voluntarily make one small change you've been resisting.",
   reversed_en:"You are resisting change, like a rock in a river trying to stop the water. Change invites you: look at what you're clinging to—an identity? A relationship? A habit? Clinging hurts, not the change itself. Letting go is not giving up; it's trusting life has a better arrangement. Breathe and say: 'I am willing to change.'"},
  {id:8,name:"意识",originalName:"Consciousness",suit:"major",element:"空",
   keywords:["觉知","清醒","观察","临在","觉醒"],
   uprightBrief:"成为自己思想的观察者",reversedBrief:"被思想带走，失去觉知",
   upright:"你不是你的思想——你是那个观察思想的人。意识提醒你：大多数痛苦来自于把思想当成真相。今天，试着做一个实验：每隔一小时，问自己「我现在在想什么？」。只是观察，不评判。你会发现：思想来了又走，但你一直在那里。这就是觉知——你真正的自己。",
   reversed:"你被思想淹没了。你在「成为」你的愤怒、你的焦虑、你的故事。意识邀请你：退后一步。看着那个愤怒的人，说：「我看到了愤怒。」看着那个焦虑的人，说：「我看到了焦虑。」当你能够观察它，你就不再被它控制。",
   upright_en:"You are not your thoughts—you are the one who watches the thoughts. Consciousness reminds you: most suffering comes from taking thoughts as truth. Today, try an experiment: every hour, ask 'what am I thinking right now?' Just observe, don't judge. You'll discover: thoughts come and go, but you remain. This is awareness—your true self.",
   reversed_en:"You are drowning in thoughts. You are 'being' your anger, your anxiety, your story. Consciousness invites you: step back. Look at the angry person and say 'I see anger.' Look at the anxious person and say 'I see anxiety.' When you can observe it, you are no longer controlled by it."},
  {id:9,name:"活力",originalName:"Vitality",suit:"major",element:"火",
   keywords:["能量","热情","身体","生命力","健康"],
   uprightBrief:"充满生命力的活在身体中",reversedBrief:"能量枯竭或过度消耗",
   upright:"你的身体是一座寺庙，不是一台机器。活力提醒你：你需要的不是更多的咖啡，而是更多的临在。今天，做一件让身体感到活着的事——跳舞、跑步、伸展、或者只是深呼吸。感受能量在你体内流动。你不需要「得到」能量，你就是能量。只是不要阻塞它。",
   reversed:"你很累——但不是身体上的累，是灵魂上的累。你在勉强自己，忽视身体的信号。活力邀请你：休息不是懒惰，是必要的。问问你的身体需要什么，然后给它。也许是睡眠，也许是哭泣，也许是笑。你的身体知道答案。",
   upright_en:"Your body is a temple, not a machine. Vitality reminds you: you don't need more coffee, you need more presence. Today, do something that makes your body feel alive—dance, run, stretch, or just breathe deeply. Feel the energy flowing through you. You don't need to 'get' energy; you ARE energy. Just don't block it.",
   reversed_en:"You are tired—but not body-tired, soul-tired. You are pushing yourself, ignoring your body's signals. Vitality invites you: rest is not laziness, it's necessary. Ask your body what it needs, then give it. Maybe it's sleep, maybe it's crying, maybe it's laughing. Your body knows."},
  {id:10,name:"慈悲",originalName:"Compassion",suit:"major",element:"水",
   keywords:["慈悲","同理心","宽恕","温柔","理解"],
   uprightBrief:"对自己和他人温柔",reversedBrief:"对自己或他人苛刻",
   upright:"慈悲不是「原谅坏人」——它是看到每个人都在尽力，包括你自己。慈悲提醒你：评判很容易，理解需要勇气。今天，当你发现自己在对某人生气时，问：「这个人小时候发生了什么？」你的心会软化。然后对自己做同样的事——你小时候发生了什么？你一直在尽力。",
   reversed:"你在对自己或他人挥舞刀子。慈悲邀请你：看看那个你无法原谅的人——他们也在受苦。看看那个你无法原谅的自己——你也在受苦。慈悲不是「让他们逃脱」，是让你自己逃脱。放下刀子。你的手需要自由，不是武器。",
   upright_en:"Compassion is not 'forgiving bad people'—it's seeing that everyone is doing their best, including yourself. Compassion reminds you: judging is easy, understanding takes courage. Today, when you catch yourself angry at someone, ask: 'what happened to this person as a child?' Your heart will soften. Then do the same for yourself.",
   reversed_en:"You are wielding a knife at yourself or others. Compassion invites you: look at the person you can't forgive—they are suffering too. Look at the self you can't forgive—you are suffering too. Compassion is not 'letting them off the hook,' it's letting YOURSELF off the hook. Drop the knife. Your hands need to be free, not weapons."},
  {id:11,name:"分离",originalName:"Separation",suit:"major",element:"空",
   keywords:["孤独","连接","合一","孤立","归属"],
   uprightBrief:"觉察分离感，寻找连接",reversedBrief:"沉溺于孤独和孤立",
   upright:"你感到孤独——但这不是因为你一个人，而是因为你忘记了我们是相连的。分离提醒你：分离是一种幻觉。你呼吸的空气，别人也在呼吸。你踩的大地，支撑着每个人。今天，做一个实验：看着陌生人，在心里说「你和我，一样」。看看感觉如何。",
   reversed:"你把自己关在一个透明的盒子里。你能看到别人，但你觉得他们看不到你。分离邀请你：盒子没有锁，门是你自己关上的。伸出手——不需要大的姿态，一个微笑就够了。你不需要被「固定」才能被爱，你现在的样子就值得被爱。",
   upright_en:"You feel lonely—but not because you're alone, because you forgot we are connected. Separation reminds you: separation is an illusion. The air you breathe, others breathe too. The ground you walk on supports everyone. Today, try an experiment: look at a stranger and silently say 'you and I, the same.' See how it feels.",
   reversed_en:"You have locked yourself in a transparent box. You can see others, but you feel they can't see you. Separation invites you: the box has no lock; you closed the door yourself. Reach out—it doesn't need a grand gesture, a smile is enough. You don't need to be 'fixed' to be loved; you are worthy of love as you are."},
  {id:12,name:"整合",originalName:"Integration",suit:"major",element:"土",
   keywords:["完整","接纳阴影","合一","平衡","自我接纳"],
   uprightBrief:"接纳自己的全部",reversedBrief:"拒绝或否认自己的部分",
   upright:"你不喜欢自己的某些部分——你的愤怒、你的嫉妒、你的恐惧。但整合提醒你：拒绝它们不会让它们消失，只会让它们在暗处生长。今天，试着对一个你通常会否认的感觉说「我看到了你，你是我的一部分」。你不需要喜欢你的所有部分，只需要接纳它们是你的。完整意味着包含所有，不是只包含「好」的部分。",
   reversed:"你在扮演一个角色——「好的人」、「强大的人」、「没有问题的人」。但被拒绝的部分正在后台造反。整合邀请你：摘下面具。你不需要完美才能被爱。你的「阴影」不是你的敌人，是你的老师。与它坐下来，问问它想告诉你什么。",
   upright_en:"You don't like certain parts of yourself—your anger, your jealousy, your fear. But Integration reminds you: rejecting them doesn't make them disappear, it only makes them grow in the dark. Today, try saying to a feeling you usually deny: 'I see you, you are part of me.' You don't need to like all your parts, just accept that they are yours. Wholeness means including everything, not just the 'good' parts.",
   reversed_en:"You are playing a role—the 'good person,' the 'strong person,' the 'person with no problems.' But the rejected parts are rebelling in the background. Integration invites you: take off the mask. You don't need to be perfect to be loved. Your 'shadow' is not your enemy; it's your teacher. Sit with it, ask what it wants to tell you."},
  {id:13,name:"重生",originalName:"Rebirth",suit:"major",element:"火",
   keywords:["新生","蜕变","觉醒","第二春","开始"],
   uprightBrief:"旧的自我的死亡，新的诞生",reversedBrief:"害怕改变，紧抓旧身份",
   upright:"你正在死去——旧的自正在死去，新的自己正在诞生。重生提醒你：每一次结束都是一次开始。不要哀悼旧的你，庆祝新的你。今天做一件「旧的你」不会做的事。也许是说「不」，也许是说「我爱你」，也许是独自吃饭。每一次勇敢的小行动都是一次重生。",
   reversed:"你在紧抓一个已经死去的身份。重生邀请你：那个旧的你已经完成了它的旅程。让它走。你不是你的过去，不是你的标签，不是别人的期待。你是此刻正在呼吸的这个人——而这一刻，你是全新的。深呼吸，感受「新」在你的细胞里。",
   upright_en:"You are dying—the old self is dying, the new self is being born. Rebirth reminds you: every ending is a beginning. Don't mourn the old you; celebrate the new you. Today, do something the 'old you' wouldn't do. Maybe saying 'no,' maybe saying 'I love you,' maybe eating alone. Every brave small act is a rebirth.",
   reversed_en:"You are clinging to an identity that has already died. Rebirth invites you: that old self has completed its journey. Let it go. You are not your past, not your labels, not others' expectations. You are this person breathing right now—and in this moment, you are brand new. Breathe deeply; feel the 'new' in your cells."},
  {id:14,name:"平衡",originalName:"Balance",suit:"major",element:"土",
   keywords:["平衡","中道","和谐","不极端","稳定"],
   uprightBrief:"找到内在的平衡点",reversedBrief:"极端或失去平衡",
   upright:"你在摇摆——一会儿过度工作，一会儿完全躺平；一会儿爱得太深，一会儿完全关闭。平衡提醒你：中道不是「什么都不做」，是「知道什么时候够了」。今天，找一个你通常会走极端的地方，试着停在中间。工作后休息，但不要刷手机到凌晨。爱，但不要失去自己。平衡是一种动态的舞蹈，不是静止的状态。",
   reversed:"你失去了重心。平衡邀请你：不要试图「完美平衡」——那是另一个极端。看看哪里倾斜了，然后轻轻调整。也许你需要更多的休息，也许你需要更多的行动。问问你的身体，它知道平衡在哪里。你不需要立刻完美——只需要开始调整。",
   upright_en:"You are swinging—overworking then completely collapsing; loving too deeply then completely shutting down. Balance reminds you: the middle way is not 'doing nothing,' it's 'knowing when enough is enough.' Today, find one area where you usually go to extremes, and try stopping in the middle. Rest after work, but don't scroll until 3am. Love, but don't lose yourself. Balance is a dynamic dance, not a static state.",
   reversed_en:"You've lost your center. Balance invites you: don't try to 'perfectly balance'—that's another extreme. See where the tilt is, then gently adjust. Maybe you need more rest, maybe you need more action. Ask your body; it knows where balance is. You don't need to be perfect immediately—just start adjusting."},
  {id:15,name:"信任",originalName:"Trust",suit:"major",element:"水",
   keywords:["信任","臣服","放松","流动","信仰"],
   uprightBrief:"信任生命的过程",reversedBrief:"控制和焦虑",
   upright:"你在试图控制每一个细节——但生命不是拼图，它是一首即兴爵士乐。信任提醒你：你不需要知道「如何」到达，你只需要知道「去哪里」。今天，做一件你无法完全控制结果的事——发送那条信息，申请那个职位，表达你的感受。然后深呼吸，让生命接管。信任不是「知道它会好」，是「无论它是什么，我都能处理」。",
   reversed:"恐惧正在开车。你在检查、再检查、过度分析每一个决定。信任邀请你：你曾经 survive 过你担心过的每一件事——你比你知道的更强大。放松对结果的控制。生命一直在对你很好，即使它没有按照你的计划。说：「我信任生命，我信任自己。」",
   upright_en:"You are trying to control every detail—but life is not a puzzle, it's improvisational jazz. Trust reminds you: you don't need to know 'how' to get there, you just need to know 'where.' Today, do something where you can't control the outcome completely—send that message, apply for that job, express your feelings. Then breathe deeply and let life take over. Trust is not 'knowing it will be good,' it's 'whatever it is, I can handle it.'",
   reversed_en:"Fear is driving. You are checking, re-checking, over-analyzing every decision. Trust invites you: you have survived every single thing you've ever worried about—you are stronger than you know. Relax your grip on the outcome. Life has been treating you well, even when it didn't follow your plan. Say: 'I trust life. I trust myself.'"},
  {id:16,name:"权力",originalName:"Power",suit:"major",element:"火",
   keywords:["真正的力量","柔软","影响","非暴力","内在力量"],
   uprightBrief:"真正的力量是柔软的",reversedBrief:"滥用权力或感到无力",
   upright:"真正的力量不是控制别人——是控制自己。权力提醒你：你不需要大声说话才能被听到，不需要强硬才能被尊重。今天，试着用柔软来应对一个困难的情况。看看会发生什么。水可以穿过最硬的石头，不是通过对抗，是通过流动。你的温柔不是你的弱点，是你的超能力。",
   reversed:"你在滥用权力，或者觉得自己完全无力。权力邀请你：真正的权力来自于知道自己是谁。你不需要证明任何事给任何人。同时，你也不是受害者——你有选择，即使选择很小。找到那个选择，然后行使它。即使只是选择「我今天要感觉好一点」——这也是权力。",
   upright_en:"True power is not controlling others—it's controlling yourself. Power reminds you: you don't need to speak loudly to be heard, don't need to be tough to be respected. Today, try meeting a difficult situation with softness. See what happens. Water flows through the hardest rock not by fighting it, but by flowing. Your gentleness is not your weakness; it's your superpower.",
   reversed_en:"You are abusing power, or feeling completely powerless. Power invites you: true power comes from knowing who you are. You don't need to prove anything to anyone. Also, you are not a victim—you have choices, even if they're small. Find that choice and exercise it. Even just choosing 'I'm going to feel a little better today'—that's power."},
  {id:17,name:"希望",originalName:"Hope",suit:"major",element:"风",
   keywords:["希望","乐观","未来","信念","光明"],
   uprightBrief:"在黑暗中看到光明",reversedBrief:"绝望或虚假的希望",
   upright:"你在黑暗中，但希望提醒你：黑暗不是永久的。今天，做一件小事来点燃希望——给朋友发信息，走到阳光下，听一首让你感觉好的歌。希望不是「一切都会好」，是「即使一切都不会好，我也能找到光」。你不需要看到整个楼梯，只需要迈出第一步。",
   reversed:"你在紧紧抓住希望，就像抓住救命稻草——但这是「需要希望才能生存」，不是真正的希望。希望邀请你：放下对「好结果」的执着。即使最坏的情况发生，你也会没事的。真正希望的基础是：「无论发生什么，我都能处理。」从那里开始，希望是自然的。",
   upright_en:"You are in darkness, but Hope reminds you: darkness is not permanent. Today, do one small thing to ignite hope—text a friend, step into sunlight, listen to a song that makes you feel good. Hope is not 'everything will be fine,' it's 'even if everything won't be fine, I can find light.' You don't need to see the whole staircase, just take the first step.",
   reversed_en:"You are clutching hope like a lifeline—but this is 'needing hope to survive,' not real hope. Hope invites you: drop the attachment to a 'good outcome.' Even if the worst happens, you'll be okay. True hope is grounded in: 'whatever happens, I can handle it.' Start there, and hope comes naturally."},
  {id:18,name:"反思",originalName:"Reflection",suit:"major",element:"水",
   keywords:["内省","镜子","真相","观察","深度"],
   uprightBrief:"诚实地面对自己",reversedBrief:"逃避自我反思",
   upright:"你在向外看，但答案在镜子里。反思提醒你：别人是你的镜子——他们触发的你，是你自己的一部分。今天，每当有人让你生气或嫉妒，问：「这反映了我的什么？」不要用来攻击自己，用来了解自己。自我反思不是自我批评，是自我发现。",
   reversed:"你在逃避镜子。反思邀请你：你害怕看到什么？也许你害怕看到你比你知道的更强大。也许你害怕看到你一直在对自己的谎言。深呼吸。你足够勇敢去看到真相。真相可能会伤害一会儿，但谎言会伤害一辈子。选择真相。",
   upright_en:"You are looking outward, but the answer is in the mirror. Reflection reminds you: others are your mirror—what triggers you in them is part of yourself. Today, whenever someone makes you angry or jealous, ask: 'what does this reflect about me?' Not to attack yourself, but to understand yourself. Self-reflection is not self-criticism; it's self-discovery.",
   reversed_en:"You are avoiding the mirror. Reflection invites you: what are you afraid to see? Maybe you're afraid to see that you're stronger than you know. Maybe you're afraid to see the lies you've been telling yourself. Breathe. You are brave enough to see the truth. The truth may hurt for a while; the lie hurts forever. Choose truth."},
  {id:19,name:"太阳",originalName:"The Sun",suit:"major",element:"火",
   keywords:["喜悦","光明","纯真","活力","温暖"],
   uprightBrief:"像太阳一样无条件地发光",reversedBrief:"阳光被云层遮挡",
   upright:"你是太阳——不是因为你总是快乐，而是因为你可以发光，即使有云层。太阳提醒你：你的喜悦不需要被「赢得」——它一直在那里，在你的最深处。今天，做一件让你纯粹快乐的事，不需要任何理由。跳舞、唱歌、大笑——像小孩子一样，不担心别人怎么想。你被允许快乐，仅仅因为你还活着。",
   reversed:"乌云在你上方，但太阳邀请你：云层不是永久的，它们只是经过。你的喜悦被遮蔽了，但没有消失。今天，做一件小事来拨开云层——走到阳光下，笑一个笑话，抱一个人。记住：即使你看不到太阳，它也在那里。你也是。",
   upright_en:"You ARE the sun—not because you're always happy, but because you can shine even with clouds. The Sun reminds you: your joy doesn't need to be 'earned'—it's always there, in your deepest core. Today, do something that brings you pure joy, for no reason at all. Dance, sing, laugh—like a child, not worrying what others think. You are allowed to be happy, simply because you're alive.",
   reversed_en:"Clouds are above you, but The Sun invites you: clouds are not permanent, they just pass through. Your joy is obscured, not gone. Today, do one small thing to part the clouds—step into sunlight, laugh at a joke, hug someone. Remember: even when you can't see the sun, it's still there. So are you."},
  {id:20,name:"觉醒",originalName:"Awakening",suit:"major",element:"空",
   keywords:["觉醒","开悟","临在","真相","自由"],
   uprightBrief:"从梦中醒来，看到真相",reversedBrief:"抗拒觉醒，想继续做梦",
   upright:"你一直在做梦——关于你是谁，关于世界是什么，关于什么是可能的。觉醒提醒你：梦不是真的，但你认为「真实」的东西可能也是梦。今天，问自己：「如果我认为我知道的一切都是错的，会怎样？」不要回答，只是让这个问题在空气中漂浮。觉醒不是到达某个地方，是意识到你已经在那里。",
   reversed:"你在紧抓你的梦——因为醒来意味着不确定。觉醒邀请你：不确定比确定的谎言更好。你不需要知道所有的答案。事实上，不知道是觉醒的开始。放下「知道」，看看会发生什么。你可能会发现，你一直寻找的答案在你停止寻找时出现。",
   upright_en:"You have been dreaming—about who you are, about what the world is, about what's possible. Awakening reminds you: the dream is not real, but what you think is 'real' might also be a dream. Today, ask yourself: 'what if everything I think I know is wrong?' Don't answer, just let the question hang in the air. Awakening is not arriving somewhere; it's realizing you are already there.",
   reversed_en:"You are clinging to your dream—because waking up means uncertainty. Awakening invites you: uncertainty is better than certain lies. You don't need to know all the answers. In fact, not knowing is the beginning of awakening. Drop 'knowing' and see what happens. You may discover that the answer you've been seeking appears when you stop seeking."},
  {id:21,name:"圆满",originalName:"Wholeness",suit:"major",element:"空",
   keywords:["圆满","完整","合一","无缺","到家"],
   uprightBrief:"你已经是完整的",reversedBrief:"感觉不完整，在外部寻找",
   upright:"你在寻找完整——但你已经是完整的。圆满提醒你：你不需要「得到」什么才能完整，你只需要停止感觉自己不完整。今天，试着说：「我已经是完整的。」不是因为你相信它，而是为了看看否认它的感觉。你一直在寻找的，你已经是了。家不在某个地方，在你这里。现在。这一刻。",
   reversed:"你在感觉自己有缺陷，需要被「修理」。圆满邀请你：你不需要被修理，因为你没有坏。你可能需要愈合，但愈合不是「变得不同」，是「接受自己本来的样子」。深呼吸，把手放在心上，说：「我已经足够了。」即使你不相信，说它。你的心知道这是真的。",
   upright_en:"You are seeking wholeness—but you are already whole. Wholeness reminds you: you don't need to 'get' something to be complete, you just need to stop feeling incomplete. Today, try saying: 'I am already whole.' Not because you believe it, but to see what it feels like to deny it. What you've been seeking, you already are. Home is not a place; it's here. Now. This moment.",
   reversed_en:"You are feeling defective, needing to be 'fixed.' Wholeness invites you: you don't need fixing, because you're not broken. You may need healing, but healing is not 'becoming different,' it's 'accepting yourself as you are.' Breathe, put your hand on your heart, say: 'I am already enough.' Even if you don't believe it, say it. Your heart knows it's true."},
  {id:22,name:"师父",originalName:"The Master",suit:"major",element:"空",
   keywords:["师父","指导","智慧","临在","传递"],
   uprightBrief:"找到或成为自己的师父",reversedBrief:"盲目追随或抗拒指导",
   upright:"师父不是「告诉你该做什么的人」——师父是「帮助你听到自己内在声音的人」。师父提醒你：你已经有了所有的答案，你只是需要帮助来听到它们。今天，如果你感到迷失，找一个你信任的人——不是告诉他们该做什么，而是帮助他们帮助你听到自己的声音。或者，成为自己的师父：安静地坐着，问一个问题，然后聆听。",
   reversed:"你在盲目追随，或者完全抗拒帮助。师父邀请你：真正的师父不会创造追随者，他们会创造更多的师父。如果你在跟随某人，确保他们在帮助你成长，而不是让你依赖。如果你在抗拒帮助，问问为什么。你不需要知道所有的答案——寻求帮助是力量的标志，不是弱点。",
   upright_en:"A Master is not 'someone who tells you what to do'—a Master is 'someone who helps you hear your own inner voice.' The Master reminds you: you already have all the answers, you just need help hearing them. Today, if you feel lost, find someone you trust—not to tell you what to do, but to help you hear your own voice. Or, be your own Master: sit quietly, ask a question, then listen.",
   reversed_en:"You are blindly following, or completely resisting help. The Master invites you: a true Master doesn't create followers, they create more Masters. If you're following someone, make sure they're helping you grow, not making you dependent. If you're resisting help, ask why. You don't need to know all the answers—asking for help is a sign of strength, not weakness."}
];

// 小阿卡纳数据
const waterCourt = [
  {id:23,name:"水王",orig:"King of Water",num:14,kw:["情感成熟","同理心","滋养","直觉","慈悲"],ub:"以成熟和情感智慧领导",rb:"情感操纵或不成熟",up:"你已经在情感上成熟了——你能够感受深刻的情感，同时不失去自己。水王提醒你：真正的情感智慧不是「不感觉」，是「感觉但不被淹没」。今天，做一件需要情感勇气的事——说「我很抱歉」，或「我需要帮助」，或「我爱你」。你的情感是你的超能力，不是你的负担。",rev:"你在用情感操纵，或者完全关闭了情感。水王邀请你：情感没有错，错的是你与它们的的关系。感觉你的感觉，但不要让你的感觉为你做决定。如果你是那个关闭的人，今天允许自己感觉一件小事——一首歌的歌词，一个记忆，一阵风。情感是活着的证据。",ue:"You are emotionally mature—you can feel deeply without losing yourself. King of Water reminds you: true emotional wisdom is not 'not feeling,' it's 'feeling without drowning.' Today, do something that takes emotional courage—say 'I'm sorry,' or 'I need help,' or 'I love you.' Your emotions are your superpower, not your burden.",re:"You are using emotions to manipulate, or you've completely shut down. King of Water invites you: there's nothing wrong with emotions, what's wrong is your relationship with them. Feel your feelings, but don't let your feelings make your decisions. If you're the shut-down one, allow yourself to feel one small thing today—a song lyric, a memory, a breeze. Emotions are proof of being alive."},
  {id:24,name:"水王后",orig:"Queen of Water",num:13,kw:["同理心","直觉","滋养","敏感","接纳"],ub:"以同理心和直觉滋养他人",rb:"过度敏感或情感依赖",up:"你的同理心是你的礼物——你能感受到别人的感受，这让你成为一个伟大的朋友、伴侣、人类。水王后提醒你：同理心不是「承受别人的痛苦」，是「陪伴别人在痛苦中」。今天，当某人正在受苦时，不要试图「修复」他们，只是坐在那里。你的存在比你的建议更有疗效。",rev:"你在吸收别人的情感，就像海绵吸水——但海绵需要拧干。水王后邀请你：设定界限不是自私，是生存。你能感受到别人的感受是美丽的，但你需要先照顾好自己。今天，做一件「只为自己」的事。你不能被空杯子倒水。",ue:"Your empathy is your gift—you can feel what others feel, and that makes you a great friend, partner, human. Queen of Water reminds you: empathy is not 'carrying others' pain,' it's 'accompanying others in their pain.' Today, when someone is suffering, don't try to 'fix' them, just sit there. Your presence is more healing than your advice.",re:"You are absorbing others' emotions like a sponge—but sponges need to be wrung out. Queen of Water invites you: setting boundaries is not selfish, it's survival. Feeling what others feel is beautiful, but you need to take care of yourself first. Today, do one thing 'just for you.' You can't pour from an empty cup."},
  {id:25,name:"水骑士",orig:"Knight of Water",num:12,kw:["情感冒险","浪漫","直觉","跟随心","流动"],ub:"跟随心的指引去冒险",rb:"情感不稳定或逃避",up:"你的心在说话——你在听吗？水骑士提醒你：跟随你的心不是「不理性」，是「最高的理性」。今天，做一件你的心一直想做的事，即使它没有「意义」。给某人写一封真诚的信，去一个你一直想去的地方，开始一个你一直想开始的项目。心知道路，即使头脑不知道。",rev:"你在逃离你的心，或者跟着它跑到悬崖边。水骑士邀请你：心是好的导航员，但不是好的司机——你需要用你的头来检查地图。感觉你的感觉，然后在行动之前等一会儿。冲动的决策通常是后悔的母亲。深呼吸，感觉，然后等待。答案会来。",ue:"Your heart is speaking—are you listening? Knight of Water reminds you: following your heart is not 'irrational,' it's 'the highest rationality.' Today, do something your heart has always wanted to do, even if it doesn't 'make sense.' Write a sincere letter to someone, go to a place you've always wanted to go, start a project you've always wanted to start. The heart knows the way, even when the mind doesn't.",re:"You are running away from your heart, or following it off a cliff. Knight of Water invites you: the heart is a good navigator but a bad driver—you need your head to check the map too. Feel your feelings, then wait a while before acting. Impulsive decisions are usually the mother of regret. Breathe, feel, then wait. The answer will come."},
  {id:26,name:"水侍从",orig:"Page of Water",num:11,kw:["情感开放","好奇","直觉","纯真","新情感"],ub:"以开放的心探索情感",rb:"情感不成熟或封闭",up:"你的心是开放的——像一本刚打开的书，每一页都是新的。水侍从提醒你：你不需要「保护」你的心，你需要使用它。今天，做一件需要情感勇气的小事——对陌生人微笑，表达一个真实的感受，哭如果我想哭。情感的纯真不是幼稚，是勇敢。",rev:"你在关闭你的心，因为过去受伤了。水侍从邀请你：伤口是心打开过的证据，不是关闭的理由。你不需要「更安全」——你需要「更勇敢」。今天，做一件小事来测试你的心的恢复力——信任某人一点，表达一个感受。你的心比你知道的更强大。",ue:"Your heart is open—like a book just opened, every page is new. Page of Water reminds you: you don't need to 'protect' your heart, you need to use it. Today, do one small thing that takes emotional courage—smile at a stranger, express a true feeling, cry if you want to cry. Emotional innocence is not immaturity, it's bravery.",re:"You are closing your heart because it got hurt in the past. Page of Water invites you: a wound is evidence that your heart was open, not a reason to close it. You don't need to be 'safer'—you need to be 'braver.' Today, do one small thing to test your heart's resilience—trust someone a little, express a feeling. Your heart is stronger than you know."}
];

const waterNum = [
  {id:27,name:"水一",orig:"Ace of Water",ub:"情感的新开始，爱的流动",rb:"情感封闭或过度依赖",up:"一个新的情感章节正在开始。水一提醒你：你值得被爱，首先是被你自己。今天，做一件表达自爱的事——买你喜欢的食物，说一句友善的话给自己，或者只是承认「我值得好事情发生在我身上」。爱从你这里开始，然后流向别人。",rev:"你在紧抓安全感，但爱不喜欢被紧抓。水一邀请你：张开你的手。你无法「让」某人爱你，你只能「成为」值得爱的人。从成为你自己的最好的朋友开始。当你爱自己，别人爱你是自然的结果。"},
  {id:28,name:"水二",orig:"Two of Water",ub:"伙伴关係，合作，吸引",rb:"关系不平衡或沟通不畅",up:"一面镜子出现在你面前——某人反映了你的某些部分。水二提醒你：每一个关系都是自我的延伸。今天，看看你的人际关系：它们教了你什么关于你自己的事？不要用来评判，用来了解。然后，做一件建立连接的事——打一个电话，发一条真诚的信息。",rev:"你在关系中没有被看到或被听到。水二邀请你：不要等待别人来「理解」你，理解你自己。然后，清晰地表达你的需求。你值得被理解，但首先你需要理解自己。说：「这是我需要的。」然后看看谁愿意倾听。"},
  {id:29,name:"水三",orig:"Three of Water",ub:"友谊，庆祝，社区",rb:"在社交中感到孤立",up:"你并不孤单——你的部落在这里。水三提醒你：快乐乘以分享就是双倍的快乐。今天，联系一个你很久没联系的朋友，或者计划一个小型聚会。你不需要「大」的社交，你需要「真」的社交。质量胜过数量，永远。",rev:"你在感觉孤立，即使在人群中。水三邀请你：孤立不是关于别人，是关于你。你在等待别人来让你感觉被包括，但你可以通过包括自己来开始。今天，做一件让自己感觉「属于」的事——加入一个团体，开始一个对话，或者只是对自己说：「我属于这里。」"},
  {id:30,name:"水四",orig:"Four of Water",ub:"沉思，重新评估情感",rb:"情感停滞或无聊",up:"你在暂停——这不是懒惰，是整合。水四提醒你：在喝更多水之前，你需要感受你已经有的水。今天，给自己情感上的休息时间。不要试图「解决」任何情感问题，只是坐着和它们在一起。答案会在静止中来到。",rev:"你在情感上停滞了——同样的关系，同样的模式，同样的抱怨。水四邀请你：改变不需要是大的，小的改变就可以打破停滞。今天，做一件你在情感上「通常不会做」的事。也许是表达一个感受，也许是结束一个不再服务你的关系。"},
  {id:31,name:"水五",orig:"Five of Water",ub:"情感失落，悲伤，但还有希望",rb:"沉溺于失落或宽恕",up:"你正在悲伤——这没关系。水五提醒你：悲伤是爱付出的代价，也是爱存在的证据。今天，允许自己感觉悲伤，但不要独自一人。联系某人，说：「我今天感觉不好。」真正爱你的人不会因为你感觉不好而离开。",rev:"你在沉溺于一个失落，但它已经过去了。水五邀请你：看看你还在的杯子，而不是打碎的杯子。是的，你失去了什么，但你还有什么。今天，列一个「我还在拥有的」清单。从那里开始，重建。"},
  {id:32,name:"水六",orig:"Six of Water",ub:"怀旧，童年，善意",rb:"被困在过去或天真",up:"一个甜蜜的记忆浮现在你心中。水六提醒你：过去有美好的部分，但它们属于过去。今天，做一个善意的举动——给某人一张卡片，帮助一个陌生人，或者只是对自己温柔一点。善意从你这里开始，然后回到你这里。",rev:"你在用怀旧来逃避现在。水六邀请你：过去已经过去了。那些「美好的旧时光」是那时候的，不是现在的。今天，做一件创造「新的美好记忆」的事。你不需要回到过去才能快乐，你可以在现在创造快乐。"},
  {id:33,name:"水七",orig:"Seven of Water",ub:"幻想，选择，直觉",rb:"幻象或逃避现实",up:"你的想象力正在奔跑——这是好事！水七提醒你：幻想是现实的种子。今天，允许自己梦想大一点。不要问「这可能吗」，问「如果可能呢？」。然后，选择一件事开始。梦想没有错，但只有加上行动，梦想才会变成现实。",rev:"你在幻想中迷失了，用「也许」来逃避「现在」。水七邀请你：回到地球。你的梦想是美丽的，但它们需要你在地球上才能实现。今天，做一件将梦想变成现实的小事——研究、计划、或者采取第一步。梦想家加上行动者等于创造者。"},
  {id:34,name:"水八",orig:"Eight of Water",ub:"离开，寻找更深的意義",rb:"害怕离开或未知",up:"你在离开——不是因为你在逃避，是因为你在寻找更深的真相。水八提醒你：知道什么时候「够了」是智慧，不是失败。今天，诚实地看看你的生活：有什么你一直在紧抓但已经不再服务你的？然后，温柔地，让它走。",rev:"你在紧抓一个已经「死了」的情况。水八邀请你：尊重你自己的旅程。有时候，离开不是放弃，是前进。你不需要「完成」才能离开。今天，如果你知道你需要离开，就离开。你的未来在前面，不在后面。"},
  {id:35,name:"水九",orig:"Nine of Water",ub:"情感满足，愿望实现",rb:"情感不满或空虚",up:"你的心正在唱歌——你已经在情感上满足了。水九提醒你：满足不是「得到你想要的一切」，是「想要你已经有的一切」。今天，做一件庆祝的事——和你爱的人吃一顿饭，买一件小礼物给自己，或者只是深呼吸和微笑。你已经有足够多了。",rev:"你在寻找情感满足在外部——但它在里面。水九邀请你：停止寻找「更多」，开始欣赏「已经」。你已经有爱，有朋友，有经历。今天，列一个「我的情感财富」清单。看看你已经有多丰富了。满足从感恩开始。"},
  {id:36,name:"水十",orig:"Ten of Water",ub:"情感圆满，家庭和谐",rb:"情感破裂或疏离",up:"你被爱包围着——即使你有时候不觉得。水十提醒你：家庭不一定要是血缘的，它可以是你选择的。今天，联系一个你感觉「像家人」的人，说「你对我很重要」。你不需要血缘来属于某处。",rev:"你在感觉和家庭或你爱的人断开连接。水十邀请你：断开连接通常不是关于他们，是关于你。你在等待他们来改变，但改变可以从你这里开始。今天，做一件修复关系的小事——发一条信息，打一个电话，或者只是原谅。你值得拥有和谐。"}
];

// 由于篇幅限制，火/云/彩虹的数据在下方用类似结构生成
// 这里只生成框架，实际数据通过类似方式填充

const fireCourt = [
  {id:37,name:"火王",orig:"King of Fire",num:14,kw:["领导力","愿景","行动","灵感","创造"],ub:"以愿景和热情领导",rb:"专制或缺乏方向",up:"你是领导者——不是因为你说了算，是因为你激发了别人最好的部分。火王提醒你：真正的领导力不是控制，是赋能。今天，做一件帮助别人成功的事。你的火可以点燃别人的火，这是你最大的力量。",rev:"你在试图控制而不是领导。火王邀请你：真正的力量是柔软的。你不需要「赢」每一个情况。今天，试着退后一步，让别人领导。看看会发生什么。当你不试图控制，你实际上有更多的人跟随你。",ue:"You are a leader—not because you're in charge, because you bring out the best in others. King of Fire reminds you: true leadership is not control, it's empowerment. Today, do something that helps someone else succeed. Your fire can light others' fires—that's your greatest power.",re:"You are trying to control rather than lead. King of Fire invites you: true power is soft. You don't need to 'win' every situation. Today, try stepping back and letting someone else lead. See what happens. When you stop trying to control, you actually have more followers."},
  {id:38,name:"火王后",orig:"Queen of Fire",num:13,kw:["热情","创造力","独立","灵感","自信"],ub:"以热情和创造力激励他人",rb:"自我中心或创造力阻塞",up:"你的热情是有感染力的——当人们接近你时，他们感觉更有活力。火王后提醒你：你的创造力不是竞争，是表达。今天，做一件纯粹为了表达的事。跳舞、写作、绘画、或者只是热情地说话。你的火点燃别人的火，世界需要更多的火。",rev:"你的火变成了烟——你在燃烧，但没有光。火王后邀请你：你在为谁创造？如果是为别人的认可，停下来。真正的创造力来自于你自己的喜悦，不是别人的掌声。今天，做一件没有任何观众也会做的事。",ue:"Your enthusiasm is contagious—when people are around you, they feel more alive. Queen of Fire reminds you: your creativity is not competition, it's expression. Today, do something purely for expression. Dance, write, paint, or just speak passionately. Your fire lights others' fires; the world needs more fire.",re:"Your fire has turned to smoke—you're burning but not lighting anything. Queen of Fire invites you: who are you creating for? If it's for others' approval, stop. True creativity comes from your own joy, not others' applause. Today, do something you'd do even without an audience."},
  {id:39,name:"火骑士",orig:"Knight of Fire",num:12,kw:["行动","冒险","冲动","热情","快速"],ub:"带着热情快速行动",rb:"鲁莽或缺乏方向",up:"你在行动——终于！火骑士提醒你：等待「完美时机」是一个陷阱，因为完美的时机不存在。今天，采取一个你一直在推迟的行动。不要过度思考，只是做。能量会跟着行动来，不是反过来。",rev:"你在冲得太快，没有看路。火骑士邀请你：热情是伟大的，但方向更重要。今天，在你采取下一个大行动之前，停下来问问：「这真的服务于我的最高善吗？」如果不是，改变方向。快速但愚蠢的行动比慢速但明智的行动更糟糕。",ue:"You are taking action—finally! Knight of Fire reminds you: waiting for the 'perfect timing' is a trap, because perfect timing doesn't exist. Today, take one action you've been postponing. Don't overthink it, just do it. Energy follows action, not the other way around.",re:"You are rushing too fast without looking at the road. Knight of Fire invites you: enthusiasm is great, but direction matters more. Today, before you take the next big action, stop and ask: 'does this really serve my highest good?' If not, change direction. Fast but foolish action is worse than slow but wise action."},
  {id:40,name:"火侍从",orig:"Page of Fire",num:11,kw:["灵感","新项目","热情","探索","消息"],ub:"带着新鲜的热情开始新事物",rb:"缺乏动力或延迟",up:"一个新项目的火花在你里面点燃了。火侍从提醒你：你不需要知道「如何」完成它，你只需要开始。今天，采取一个小小的第一步。不需要大，不需要完美，只需要开始。火花可以变成火焰，但首先它需要被点燃。",rev:"你的火正在熄灭——或者它从来没有真正点燃。火侍从邀请你：你在等待「灵感」来，但灵感不会来，它只会在你行动的时候来。今天，做一件与你的新想法相关的小事。即使它很糟糕，至少你在行动。行动带来灵感，不是反过来。",ue:"A spark of a new project has ignited within you. Page of Fire reminds you: you don't need to know 'how' to finish it, you just need to start. Today, take one small first step. Doesn't need to be big, doesn't need to be perfect, just needs to start. A spark can become a flame, but first it needs to be lit.",re:"Your fire is going out—or it never really lit. Page of Fire invites you: you're waiting for 'inspiration' to come, but inspiration won't come, it only comes when you act. Today, do one small thing related to your new idea. Even if it's terrible, at least you're acting. Action brings inspiration, not the other way around."}
];

// 实际完整数据太多，这里用函数生成所有牌
// 完整版本会在最终文件中体现

console.log("This script is a placeholder. The full osho-zen-cards.js needs to be written directly.");
console.log("Due to the large size, please use the Python approach or write the file in sections.");
