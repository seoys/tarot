import { MbtiQuestion } from "../types/user-journey";

export const mbtiQuestions: MbtiQuestion[] = [
    // E vs I (Extraversion vs Introversion)
    {
        id: 1,
        indicator: "E-I",
        text: "힘든 하루를 마치고 집에 돌아온 당신, 가장 먼저 하고 싶은 일은?",
        optionA: { text: "친한 친구에게 전화를 걸어 오늘 있었던 일을 수다로 푼다.", value: "E" },
        optionB: { text: "일단 씻고 침대에 누워 누구의 방해도 없는 나만의 시간을 쉰다.", value: "I" },
    },
    {
        id: 2,
        indicator: "E-I",
        text: "친구가 갑자기 '오늘 저녁에 새로 알게 된 친구 2명도 같이 봐도 돼?' 라고 물었을 때 당신은?",
        optionA: { text: "'당연하지! 새로운 사람 언제나 환영!'", value: "E" },
        optionB: { text: "'아... 오늘은 그냥 우리끼리 보면 안 될까?'", value: "I" },
    },
    {
        id: 3,
        indicator: "E-I",
        text: "스트레스를 심하게 받았을 때 당신에게 필요한 처방전은?",
        optionA: { text: "시끌벅적한 곳에 가서 에너지를 발산하거나 사람들을 만나기", value: "E" },
        optionB: { text: "혼자만의 공간에서 좋아하는 음악을 듣거나 잠자기", value: "I" },
    },

    // S vs N (Sensing vs Intuition)
    {
        id: 4,
        indicator: "S-N",
        text: "요리를 하려고 레시피를 찾아봤습니다. 당신의 요리 스타일은?",
        optionA: { text: "계량스푼을 꺼내어 레시피에 적힌 정량과 순서를 정확히 따른다.", value: "S" },
        optionB: { text: "대충 눈대중으로 넣고, 내 감에 맞춰 재료를 추가하거나 응용한다.", value: "N" },
    },
    {
        id: 5,
        indicator: "S-N",
        text: "영화 예고편을 보고 났을 때 당신이 주로 하는 생각은?",
        optionA: { text: "'CG 화려하다', '주인공 연기 잘하네' 등 직관적인 장면과 팩트 위주.", value: "S" },
        optionB: { text: "'장면 뒤에 숨겨진 의미가 뭘까?', '결말에 엄청난 반전이 있을 것 같아' 등의 유추.", value: "N" },
    },
    {
        id: 6,
        indicator: "S-N",
        text: "사과(Apple)라는 단어를 들으면 가장 먼저 떠오르는 것은?",
        optionA: { text: "빨갛다, 달콤하다, 과일, 아삭하다.", value: "S" },
        optionB: { text: "백설공주, 뉴턴, 아이폰, 회사 로고.", value: "N" },
    },

    // T vs F (Thinking vs Feeling)
    {
        id: 7,
        indicator: "T-F",
        text: "친구가 지각을 해서 화가 난 상황. 친구가 '오다가 넘어져서 약국 들렀다 왔어'라고 한다면?",
        optionA: { text: "'많이 안 다쳤어? 피 안 나? 어디 봐봐 ㅠㅠ'", value: "F" },
        optionB: { text: "'다친 건 괜찮아? 근데 미리 늦을 것 같다고 연락이라도 해주지.'", value: "T" },
    },
    {
        id: 8,
        indicator: "T-F",
        text: "힘든 일을 끝내고 온 당신에게 친구가 '고생했어, 넌 참 멋진 사람이야'라고 말해줍니다. 기분 좋은 포인트는?",
        optionA: { text: "친구가 내 마음을 알아주고 응원해 주었다는 따뜻한 진심.", value: "F" },
        optionB: { text: "내가 성공적으로 일을 마쳤다는 객관적인 성취에 대한 인정.", value: "T" },
    },
    {
        id: 9,
        indicator: "T-F",
        text: "물건을 살 때 당신이 더 중요하게 고려하는 것은?",
        optionA: { text: "'이거 사면 내 기분이 너무 좋을 것 같아! 디자인이 내 취향이야.'", value: "F" },
        optionB: { text: "'가성비 좋고 스펙도 이 정도면 훌륭해. 합리적인 소비야.'", value: "T" },
    },

    // J vs P (Judging vs Perceiving)
    {
        id: 10,
        indicator: "J-P",
        text: "친구가 '내일 밥먹자! 어디갈래?' 라고 물었을 때 당신의 대답은?",
        optionA: { text: "'내일 1시에 홍대역 9번 출구에서 만나서, 예약해둔 파스타집 가자!'", value: "J" },
        optionB: { text: "'일단 만나서 그날 땡기는 거 먹자! 여기저기 돌아다녀보지 뭐.'", value: "P" },
    },
    {
        id: 11,
        indicator: "J-P",
        text: "인터넷 쇼핑으로 옷을 샀는데 배송이 며칠 늦어진다는 문자가 왔습니다.",
        optionA: { text: "'뭐야, 주말에 입으려고 일정 다 맞춰서 주문한 건데 화난다!'", value: "J" },
        optionB: { text: "'어쩔 수 없지 뭐. 언젠간 오겠거니 하고 잊어버리고 있는다.'", value: "P" },
    },
    {
        id: 12,
        indicator: "J-P",
        text: "스마트폰 앱 알림이나 읽지 않은 메일함을 볼 때 당신은?",
        optionA: { text: "빨간 숫자(알림 뱃지)가 떠 있는 걸 참을 수 없어 다 눌러서 없앤다.", value: "J" },
        optionB: { text: "알림 뱃지가 999+가 되어도 일일이 지우지 않고 크게 신경 쓰지 않는다.", value: "P" },
    },
];
