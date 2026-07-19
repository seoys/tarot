import { MbtiQuestion } from "../types/user-journey";

const createQuestions = (questions: MbtiQuestion[]) => questions;

export const mbtiQuestionPool = {
    "E-I": createQuestions([
        {
            id: 1,
            indicator: "E-I",
            text: "길가다 우연히 마음에 드는 카페를 발견했다면?",
            optionA: { text: "혼자보다 누군가와 같이 들어가고 싶다.", value: "E" },
            optionB: { text: "조용히 혼자 들어가 오래 머물고 싶다.", value: "I" },
        },
        {
            id: 2,
            indicator: "E-I",
            text: "좋아하는 사진을 찍어두는 방식에 더 가까운 것은?",
            optionA: { text: "같이 있는 사람까지 담아 분위기를 남긴다.", value: "E" },
            optionB: { text: "장면 자체를 조용히 기록해 둔다.", value: "I" },
        },
        {
            id: 3,
            indicator: "E-I",
            text: "힘든 날 저녁, 에너지를 회복하는 방법은?",
            optionA: { text: "메시지를 보내거나 잠깐이라도 사람을 만난다.", value: "E" },
            optionB: { text: "혼자 쉬면서 생각을 정리한다.", value: "I" },
        },
        {
            id: 4,
            indicator: "E-I",
            text: "주말 계획이 갑자기 비었을 때 더 먼저 드는 생각은?",
            optionA: { text: "누구를 만날까, 어디를 갈까 바로 떠올린다.", value: "E" },
            optionB: { text: "오늘은 나만의 시간을 어떻게 쓸지 떠올린다.", value: "I" },
        },
    ]),
    "S-N": createQuestions([
        {
            id: 5,
            indicator: "S-N",
            text: "새로운 장소에 들어갔을 때 먼저 눈에 들어오는 것은?",
            optionA: { text: "구조, 배치, 분위기 같은 실제적인 요소", value: "S" },
            optionB: { text: "왜 이런 느낌이 드는지, 숨은 의미 같은 것", value: "N" },
        },
        {
            id: 6,
            indicator: "S-N",
            text: "좋아하는 드라마를 볼 때 더 끌리는 건?",
            optionA: { text: "연기, 대사, 장면 구성처럼 보이는 디테일", value: "S" },
            optionB: { text: "인물의 관계 변화와 앞으로의 흐름", value: "N" },
        },
        {
            id: 7,
            indicator: "S-N",
            text: "새로운 정보를 접했을 때 더 신뢰가 가는 방식은?",
            optionA: { text: "구체적인 사례와 확인된 사실", value: "S" },
            optionB: { text: "전체 흐름과 가능성의 그림", value: "N" },
        },
        {
            id: 8,
            indicator: "S-N",
            text: "선물을 고를 때 더 가까운 기준은?",
            optionA: { text: "실제로 쓸 수 있고 만족도가 분명한 것", value: "S" },
            optionB: { text: "받는 사람의 취향과 상징성이 느껴지는 것", value: "N" },
        },
    ]),
    "T-F": createQuestions([
        {
            id: 9,
            indicator: "T-F",
            text: "친구가 속상한 일을 털어놓을 때 더 먼저 나오는 반응은?",
            optionA: { text: "무엇이 힘들었는지 차분히 정리해 준다.", value: "T" },
            optionB: { text: "일단 마음부터 편하게 해주고 싶다.", value: "F" },
        },
        {
            id: 10,
            indicator: "T-F",
            text: "누군가의 부탁을 거절해야 할 때 더 가까운 방식은?",
            optionA: { text: "이유를 분명하게 말하고 선을 긋는다.", value: "T" },
            optionB: { text: "상대가 상처받지 않게 최대한 부드럽게 말한다.", value: "F" },
        },
        {
            id: 11,
            indicator: "T-F",
            text: "칭찬을 들었을 때 더 오래 남는 건?",
            optionA: { text: "내가 잘 해냈다는 객관적인 인정", value: "T" },
            optionB: { text: "그 사람이 진심으로 알아봐 준 따뜻함", value: "F" },
        },
        {
            id: 12,
            indicator: "T-F",
            text: "갈등이 생겼을 때 우선 보고 싶은 건?",
            optionA: { text: "문제가 왜 생겼는지와 해결 가능성", value: "T" },
            optionB: { text: "서로의 감정이 왜 아팠는지", value: "F" },
        },
    ]),
    "J-P": createQuestions([
        {
            id: 13,
            indicator: "J-P",
            text: "여행을 준비할 때 더 편한 방식은?",
            optionA: { text: "일정과 동선을 먼저 정리해두는 것", value: "J" },
            optionB: { text: "그때그때 끌리는 대로 움직이는 것", value: "P" },
        },
        {
            id: 14,
            indicator: "J-P",
            text: "해야 할 일이 여러 개 생겼을 때 더 자연스러운 반응은?",
            optionA: { text: "먼저 순서를 정하고 하나씩 처리한다.", value: "J" },
            optionB: { text: "상황 보면서 유연하게 바꿔가며 한다.", value: "P" },
        },
        {
            id: 15,
            indicator: "J-P",
            text: "기분 전환이 필요할 때 더 가까운 선택은?",
            optionA: { text: "계획한 루틴을 지켜 안정감을 얻는다.", value: "J" },
            optionB: { text: "즉흥적으로 새로운 곳에 가본다.", value: "P" },
        },
        {
            id: 16,
            indicator: "J-P",
            text: "결정을 미루는 상황에서 더 익숙한 것은?",
            optionA: { text: "마감 전에 정해두고 싶다.", value: "J" },
            optionB: { text: "조금 더 두고 보다가 정한다.", value: "P" },
        },
    ]),
};
