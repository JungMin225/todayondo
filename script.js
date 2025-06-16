const scene = document.querySelector('.scene')
const char = document.querySelector('.char')
const text = document.querySelector('.text')
const choicesBox = document.querySelector('.choices')
const ondoFill = document.getElementById('ondoFill')
const conversation = document.querySelector('.conversation');

// 온도 수치
let ondo = 50;
let negCount = 0;
let posCount = 0;

// 씬 맵 (ID 기반)
const scenes = {
  start: {
    bg: 'img/room_gpt.png',
    char: 'img/Haeun_sad.gif',
    text: '"으아!!! 또 다시 아침이 와버렸어!!!"',
    choices: [],
    next: 'intro'
  },
  intro: {
    char: '',
    text: '[하은은 디자인과에 재학 중인 21살 대학생으로 고민이 많다.]',
    choices: [],
    next: 'haeun_monologue1'
  },
  haeun_monologue1: {
    char: 'img/Haeun_sad.gif',
    text: '"어제는 과제에 알바에 가족에... 오늘은 그냥 아무 일 없이 지나가면 좋겠다 ㅠㅠ"',
    choices: [],
    next: 'voice1'
  },
  voice1: {
    char: '',
    text: '[카톡!]',
    sound: 'audio/kakaoTalk.mp3',
    choices: [],
    next: 'haeun_reaction1'
  },
  haeun_reaction1: {
    char: 'img/Haeun_mad.png',
    text: '"... 누구야 이 아침부터!!!"',
    choices: [],
    next: 'chahan_request'
  },
  chahan_request: {
    char: 'img/Chahan.gif',
    text: '"[카톡] 차한이: 하은 씨, PPT 다시 수정해주실 수 있으십니까?"',
    choices: [],
    next: 'haeun_monologue2'
  },
  haeun_monologue2: {
    char: 'img/Haeun.gif',
    text: '"교양 팀플 조장이잖아? 내일 1시 제출인데... 왜 지금 수정해달라고 하지?"',
    choices: [],
    next: 'haeun_monologue3'
  },
  haeun_monologue3: {
    char: 'img/Haeun.gif',
    text: '[하은은 고민에 빠져든다]',
    choices: [],
    next: 'haeun_monologue4'
  },
  haeun_monologue4: {
    char: 'img/Haeun.gif',
    text: '"내 디자인도 괜찮은데... 왜 다시 해달라는 걸까?"',
    choices: [],
    next: 'voice2'
  },
  voice2: {
    char: '',
    text: '[카톡!]',
    sound: 'audio/kakaoTalk.mp3',
    choices: [],
    next: 'chahan_feedback'
  },
  chahan_feedback: {
    char: 'img/Chahan.gif',
    text: '"[카톡] 차한이: 무채색으로 통일하는 것이 좋을 것 같습니다. 지금은 가독성이 떨어집니다."',
    choices: [],
    next: 'haeun_choice'
  },
  haeun_choice: {
    char: 'img/Haeun.gif',
    text: '"내 디자인도 괜찮은데... 하아 바빠서 곤란한데 카톡은 뭐라고 보내지?"',
    choices: [{
        text: '[카톡] 한이님 좋은 의견 감사합니다! 밤 새 다시 해보겠습니다!',
        change: +10,
        next: 'voice3'
      },
      {
        text: '[카톡] 네, 그럼 다는 아니어도 최대한 맞춰보겠습니다. 도와주실 수 있나요?',
        change: 0,
        next: 'voice4'
      },
      {
        text: '[카톡] 꼭 바꿔야 하나요? 제가 만든 스타일도 괜찮은데요.',
        change: -10,
        next: 'voice5'
      }
    ]
  },
  voice3: {
    char: '',
    text: '[온도가 올라갔습니다.]',
    choices: [],
    next: 'chahan_accept'
  },
  chahan_accept: {
    char: 'img/Chahan.gif',
    text: '"[카톡] 차한이: 네, 감사합니다. 수정본은 내일 아침까지 공유 부탁드립니다."',
    choices: [],
    next: 'haeun_think_accept'
  },
  haeun_think_accept: {
    char: 'img/Haeun_mad.png',
    text: '"... 나도 내 하루가 있는데. 벌써 스트레스 받네."',
    choices: [],
    next: 'chapter1_end'
  },
  voice4: {
    char: '',
    text: '[온도를 유지하였습니다.]',
    choices: [],
    next: 'chahan_cooperate'
  },
  chahan_cooperate: {
    char: 'img/Chahan.gif',
    text: '"[카톡] 차한이: 네, 응해주셔서 감사합니다. 중간 시안이라도 먼저 공유해주시면 이후 합류하겠습니다."',
    choices: [],
    next: 'haeun_think_cooperate'
  },
  haeun_think_cooperate: {
    char: 'img/Haeun.gif',
    text: '"그래, 팀플이니까 최대한 맞춰보자!"',
    choices: [],
    next: 'chapter1_end'
  },
  voice5: {
    char: '',
    text: '[온도가 내려갔습니다.]',
    choices: [],
    next: 'chahan_criticize'
  },
  chahan_criticize: {
    char: 'img/Chahan_mad.png',
    text: '"[카톡] 차한이: 개인적인 스타일보다 전달력이 우선이라고 생각합니다. 그럼 아쉽지만 이대로 발표 진행하겠습니다."',
    choices: [],
    next: 'haeun_think_criticize'
  },
  haeun_think_criticize: {
    char: 'img/Haeun.gif',
    text: '"그래도 팀플인데 좀 맞출 걸 그랬나..."',
    choices: [],
    next: 'chapter1_end'
  },
  chapter1_end: {
    char: 'img/Haeun.gif',
    text: '"그나저나 지금 몇 시... 으악 학교 늦겠다!! 학교 가야겠다."',
    choices: [],
    next: null
  },



  // chapter2
  chapter2_start: {
    bg: 'img/Univ_GPT.png',
    char: 'img/Haeun_sad.gif',
    text: '"헉… 헉… 도착했다…! 제발 출석만 되면 돼…"',
    choices: [],
    next: 'chapter2_intro'
  },
  chapter2_intro: {
    char: '',
    text: '"거기 학생, 이름이 뭐죠? 출석만 하고 얼른 자리에 앉으세요."',
    choices: [],
    next: 'yes'
  },
  yes: {
    char: 'img/Haeun.gif',
    text: '"넵!"',
    choices: [],
    next: 'Teach1'
  },
  Teach1: {
    char: '',
    text: '[교수님께서 열정적으로 수업을 진행하신다.]',
    choices: [],
    next: 'haeun_voice1'
  },
  haeun_voice1: {
    char: 'img/Haeun_sad.gif',
    text: '"아침부터 카톡에 과제에 달리기까지… 오늘은 좀 조용했으면 좋겠다."',
    choices: [],
    next: 'Teach2'
  },
  Teach2: {
    char: '',
    text: '"오늘 수업은 여기까지입니다. 다음 주에 다시 뵙는 걸로 합시다."',
    choices: [],
    next: 'haeun_grab_bag'
  },
  haeun_grab_bag: {
    char: '',
    text: '[하은은 강의실 문을 나서며 가방을 메려 한다.]',
    choices: [],
    next: 'haerin_call'
  },
  haerin_call: {
    char: 'img/haerin.gif',
    text: '"하은 선배!! 혹시 지금 시간 좀 되세요?"',
    choices: [],
    next: 'haeun_think_haerin'
  },
  haeun_think_haerin: {
    char: '',
    text: '[혜린은 하은의 과 후배이다. 많이 친하진 않지만 혜린은 하은에게 종종 부탁을 해오고는 한다.]',
    choices: [],
    next: 'haerin_request'
  },
  haerin_request: {
    char: 'img/haerin.gif',
    text: '" 혹시 제 과제 좀 같이 봐주실 수 있을까요? 딱 10분이면 돼요."',
    choices: [],
    next: 'haeun_umm'
  },
  haeun_umm: {
    char: 'img/haeun.gif',
    text: '(어떡하지? 집에 빨리 가서 쉬고싶은데 10분 안으로 끝날까?)',
    choices: [{
        text: '"제가 버스를 놓치면 안 돼서 딱 10분만 봐드릴게요!"',
        change: 0,
        next: 'choose1'
      },
      {
        text: '아니요. 제가 급한 일이 있어서요.',
        change: -10,
        next: 'choose2'
      },
      {
        text: '(가방을 다시 내려놓으며) "네! 봐드릴게요!"',
        change: +10,
        next: 'choose3'
      }
    ],
  },
  choose1: {
    char: '',
    text: '[온도를 유지하였습니다.]',
    choices: [],
    next: 'haerin_cooperate'
  },
  haerin_cooperate: {
    char: 'img/haerin.gif',
    text: '"정말요? 매번 감사해요ㅠ.ㅠ 다음에 제가 꼭 밥 살게요!"',
    choices: [],
    next: 'chap2_haeun_think_1'
  },
  chap2_haeun_think_1: {
    char: 'img/haeun.gif',
    text: '(이럴 때 조금 거짓말 하는 거지 뭐)',
    choices: [],
    next: 'chapter2_end'
  },
  choose2: {
    char: '',
    text: '[온도가 내려갔습니다.]',
    choices: [],
    next: 'haerin_criticize'
  },
  haerin_criticize: {
    char: 'img/haerin.gif',
    text: '"아... 넵! 급한 일은 어쩔 수 없으니까요 ㅠ.ㅠ"',
    choices: [],
    next: 'chap2_haeun_think_2'
  },
  chap2_haeun_think_2: {
    char: 'img/haeun.gif',
    text: '(내가 피곤한데 어쩔 수 없잖아...)',
    choices: [],
    next: 'chapter2_end'
  },
  choose3: {
    char: '',
    text: '[온도가 올라갔습니다.]',
    choices: [],
    next: 'haerin_accept'
  },
  haerin_accept: {
    char: 'img/haerin.gif',
    text: '"감사해요 선배! 선배 밖에 없어요 정말!"',
    choices: [],
    next: 'chap2_haeun_think_3'
  },
  chap2_haeun_think_3: {
    char: 'img/haeun.gif',
    text: '(하... 괜히 도와준다고 했나. 더 피곤한 것 같네)',
    choices: [],
    next: 'chapter2_end'
  },
  chapter2_end: {
    char: 'img/Haeun.gif', // 하은 고민하는 표정
    text: '"얼른 학교 탈출해야지!!"',
    choices: [],
    next: null
  },



  // chapter 3
  chapter3_start: {
    bg: 'img/Cafe_GPT.png', // 방 배경 흐리게
    char: 'img/Haeun.gif',
    text: '[하은은 학업과 함께 오후 타임 카페 알바를 병행 중이다.]',
    choices: [],
    next: 'chapter3_intro'
  },
  chapter3_intro: {
    char: 'img/Haeun.gif',
    text: '"어서오세요~!!"',
    choices: [],
    next: 'cafe_question'
  },
  cafe_question: {
    char: '',
    text: '"[손님 1] 아가씨, 여기는 뭐가 맛있어?"',
    choices: [],
    next: 'cafe_user_input'
  },
  cafe_question2: {
    char: 'img/Haeun_sad.gif',
    text: '(손님 저도 여기 메뉴 다 못 먹어봤어요... ㅠㅠ)',
    choices: [],
    next: 'cafe_user_input'
  },
  cafe_user_input: {
    char: 'img/Haeun.gif',
    text: '[직접 추천해주세요:]',
    input: true, // 입력 모드 플래그
    choices: [],
    next: 'cafe_user_response'
  },

  // ▶ 입력 후 랜덤 응답 씬
  cafe_user_response: {
    char: '',
    text: '아메리카노 500잔 제조 중...', // 코드에서 채워줌
    choices: [],
    next: 'cafe_tired'
  },
  cafe_tired: {
    char: 'img/Haeun_sad.gif',
    text: '"손님이 왜 이렇게 많아!!!!!!!!!!!!!! \n 제발 마감 시간..."',
    choices: [],
    next: 'cafe_snacktime'
  },
  cafe_snacktime: {
    char: '',
    text: '"[알바생 1]오늘도 수고 많으셨어요 하은씨."',
    choices: [],
    next: 'cafe_call'
  },
  cafe_call: {
    char: '',
    text: '[따르르릉]',
    choices: [],
    next: 'mom_call'
  },
  mom_call: {
    char: 'img/Haeun.gif',
    text: '"어? 엄마 전화네?"',
    choices: [],
    next: 'mom_call2'
  },
  mom_call2: {
    char: 'img/Haeun.gif',
    text: '"여보세요~ 엄마 무슨 일이야?"',
    choices: [],
    next: 'mom_call3'
  },
  mom_call3: {
    char: 'img/Mom.png',
    text: '"하은이 너 요즘 뭐하고 지내니? \n 요즘 공부는 안 하고 인스타에 사진만 올리는 거 아니니?"',
    choices: [],
    next: 'mom_call4'
  },
  mom_call4: {
    char: 'img/Haeun.gif',
    text: '(엄마는 왜 단편적인 것만 보고 그러시는 걸까...)',
    choices: [{
        text: '“아... 그냥 사진 하나 올린 거 가지고 그래...”',
        change: -10,
        next: 'chapter3_end'
      },
      {
        text: '“엄마 걱정하는 거 알아. 근데 나도 나름 계획대로 살고있어~”',
        change: 0,
        next: 'chapter3_end'
      },
      {
        text: '“미안해. 좀 더 학업에 집중하도록 할게”',
        change: +10,
        next: 'chapter3_end'
      }
    ]
  },
  chapter3_end: {
    char: 'img/Haeun_sad.gif',
    text: '"엄마 말도 틀리진 않지만… 가끔은 내 기분도 좀 봐줬으면…"',
    choices: [],
    next: null
  },




  // chapter 4
chapter4_start: {
  bg:  'img/room_dark.png',
  char:'',     
  text:'"[따르릉... 따르릉릉]"',
  choices:[],
  next:'jimin_intro'
},
jimin_intro: {
  char:'img/Jimin.png',
  text:'"[전화] 지민: 하은아… 얘기가 조금 무거운데 들어줄 수 있어?"',
  choices:[],
  next:'jimin_monologue1'
},
jimin_monologue1: {
  char:'img/Jimin.png',
  text:'"요즘 나 너무 외로워… 다 귀찮고…"',
  choices:[],
  next:'jimin_monologue2'
},
jimin_monologue2: {
  char:'img/Jimin.png',
  text:'"그래도 너는 항상 밝고 긍정적이잖아. 넌 뭐든 괜찮지?"',
  choices:[],
  next:'jimin_monologue3'
},
jimin_monologue3: {
  char:'img/Jimin.png',
  text:'"내가 하는 건 다 잘 안 되는 거 같아..."',
  choices:[],
  next:'haeun_choice3'
},
haeun_choice3: {
  char:'img/Haeun.gif',
  text:'"나도 오늘 힘든 일 많았는데... 지민이는 자기 얘기만 하네. 내가 뭐라고 답해줄까?"',
  choices:[
    { 
      text:'정말 힘들었겠다… 네 기분 이해하려고 노력할게. 언제든지 말해줘.',    
      change:+10, 
      next:'jimin_response1' 
    },
    { 
      text:'그만해. 내가 감정 쓰레기통이야? ',                 
      change:-10, 
      next:'jimin_response2' 
    },
    { 
      text:'지민아 나도 오늘은 살짝 지쳐서, 다음에 얘기해도 될까?',                
      change:  0, 
      next:'jimin_response3' 
    }
  ]
},
jimin_response1: {
  char:'img/Jimin.png',
  text:'"고마워… 너라서 다행이야."',
  choices:[],
  next:'chapter4_end'
},
jimin_response2: {
  char:'img/Jimin.png',
  text:'"아… 그렇구나. 알겠어."',
  choices:[],
  next:'chapter4_end'
},
jimin_response3: {
  char:'img/Jimin.png',
  text:'"헉 그랬구나... 다음에 얘기하자 하은아"',
  choices:[],
  next:'chapter4_end'
},
chapter4_end: {   
  char:'img/Haeun.gif',     
  text:'"오늘 하루를 나는 어떻게 보냈더라?"',
  choices:[],
  next: 'ending'
},

ending: {
  choices: [], next: null
},


// ▶ 엔딩1: “나는 괜찮은 사람이었다” 엔딩
end_ending1: {
  bg:   'img/ending1_pixel.png',   
  char: 'img/Haeun.gif',  
  text: [
    '“누구도 상처받지 않았고, 나는 다정한 사람이었다. 그게 나쁜 건 아닌데… 왜 이리 마음이 허전하지?”',
    '“나도 무리하기 어려운 사람이 될 수 있을까? 착한 사람이 아닌, 있는 그대로의 내가 되어도 괜찮을까.”',
    '',
    '“괜찮다”는 말을 너무 많이 했던 것 같아'  // 자막처럼
  ].join('\n'),
  choices: [],
  next: null
},

// ▶ 엔딩2: “내가 우선이기만 해도 되는걸까?” 엔딩
end_ending2: {
  bg:   'img/ending3_pixel.png',      // (예: 붉은 계열의 긴장감 있는 배경)
  char: 'img/Haeun.gif',     // 땀 흘리며 고민하는 모습
  text: [
    '“오늘은 피하지도 않았고, 양보하지도 않았다. 그게 후련하기도 했어.”',
    '“근데 다른 사람들의 표정은 어땠지? 내 마음을 지키려다, 아예 마음이 딱딱해지는 기분이야. 난 그냥 나를 지키려던 것뿐인데…”',
    '',
    '“내가 남을 더 생각했더라면 어땠을까”'
  ].join('\n'),
  choices: [],
  next: null
},

// ▶ 엔딩3: “나를 좋아하는 법을 배우는 중” 엔딩
end_ending3: {
  bg:   'img/ending2_pixel.png',      // (예: 햇살 든 공원 배경)
  char: 'img/Haeun.gif',     // 잔디에 누워 있는 하은
  text: [
    '“이상하게 나의 마음을 솔직하게 말하니까 마음이 더 편했어.”',
    '“참는 것도, 질러버리는 것도 아닌… 이게 나의 온도였어.”',
    '',
    '“너무 신경 쓰지 않아도 되는구나. 나를 지키면서도 다른 사람과 잘 지낼 수 있어”'
  ].join('\n'),
  choices: [],
  next: null
}


};

// 각 엔딩 분기 함수
function goToFinalEnding() {
  if (ondo <= 20 || negCount >= 2) {
    showScene('end_ending2');
  } else if (ondo >= 80 || posCount >= 2) {
    showScene('end_ending1');
  } else {
    showScene('end_ending3');
  }
}

// 배경 세팅
function setSceneBackground(src) {
  const origin = document.querySelector('.scene-bg');
  if (origin) origin.remove();
  const img = document.createElement('img');
  img.src = src;
  img.className = 'scene-bg';
  scene.prepend(img);
}

// 온도바 업데이트
function updateOndoBar() {
  ondoFill.style.width = `${Math.max(0, Math.min(100, ondo))}%`;
}

// 씬 렌더링
function showScene(id) {
  // 분기 엔딩 placeholder
  if (id === 'ending') {
    goToFinalEnding();
    return;
  }

  const data = scenes[id];
  if (!data) return;

  // 1) 배경
  if (data.bg) setSceneBackground(data.bg);

  // 2) 캐릭터
  if (data.char) {
    char.style.display = '';
    char.style.backgroundImage = `url(${data.char})`;
  } else {
    char.style.display = 'none';
  }

  // 3) 대사
  text.innerText = data.text;

  // 4) 사운드
  if (data.sound) new Audio(data.sound).play();

  // 5) 온도바
  updateOndoBar();

  // 6) 입력/선택/다음 처리
  choicesBox.innerHTML = '';
  conversation.onclick = null;

  // --- 입력 모드 ---
  if (data.input) {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = '메뉴를 입력하세요…';
    inp.className = 'textInput';

    const send = document.createElement('button');
    send.className = 'choiceBtn';
    send.innerText = '추천!';
    send.onclick = e => {
      e.stopPropagation();
      if (!inp.value.trim()) return alert('메뉴를 입력해주세요!');
      const replies = [
        '이름이 뭐 이리 길어?!',
        '그걸로 줘.',
        '그거 맛있겠군.',
        '내가 그런 거나 먹을 사람으로 보여?!!',
        '젊은 사람이 센스가 없어 이이...'
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      text.innerText = `"${reply}"`;
      choicesBox.innerHTML = '';
      // 다음 버튼
      const nxt = document.createElement('button');
      nxt.className = 'choiceBtn';
      nxt.innerText = '▶ 다음';
      nxt.onclick = ev => {
        ev.stopPropagation();
        showScene(data.next);
      };
      choicesBox.appendChild(nxt);
    };

    choicesBox.append(inp, send);
    return;
  }

  // --- 선택지 모드 ---
  if (data.choices && data.choices.length) {
    data.choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'choiceBtn';
      btn.innerText = `› ${c.text}`;
      btn.onclick = e => {
        e.stopPropagation();
        ondo += c.change;
        if (c.change < 0) negCount++;
        if (c.change > 0) posCount++;
        updateOndoBar();
        showScene(c.next);
      };
      choicesBox.appendChild(btn);
    });
    return;
  }

  if (data.next) {
    conversation.onclick = () => showScene(data.next);
  }

  if ((!data.choices || data.choices.length === 0) && !data.next) {
    if (id === 'chapter1_end') {
      const btn = document.createElement('button');
      btn.innerText = '▶ 다음';
      btn.className = 'choiceBtn';
      btn.onclick = (e) => {
        e.stopPropagation();
        showScene('chapter2_start');
      };
      choicesBox.appendChild(btn);
    }
  
    if (id === 'chapter2_end') {
      const btn = document.createElement('button');
      btn.innerText = '▶ 다음';
      btn.className = 'choiceBtn';
      btn.onclick = (e) => {
        e.stopPropagation();
        showScene('chapter3_start');
      };
      choicesBox.appendChild(btn);
    }
  
    if (id === 'chapter3_end') {
      const btn = document.createElement('button');
      btn.innerText = '▶ 다음';
      btn.className = 'choiceBtn';
      btn.onclick = (e) => {
        e.stopPropagation();
        showScene('chapter4_start');
      };
      choicesBox.appendChild(btn);
    }
  }
}

// 초기 실행
showScene('start');