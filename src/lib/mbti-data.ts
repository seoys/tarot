import { MbtiQuestion } from "../types/user-journey";

const createQuestions = (questions: MbtiQuestion[]) => questions;

let recentQuestionIds: number[] = [];

export type MbtiAxisKey = "E-I" | "S-N" | "T-F" | "J-P";

export interface MbtiQuizData {
    questions: MbtiQuestion[];
    axisCounts: Record<MbtiAxisKey, number>;
}

const axisKeys: MbtiAxisKey[] = ["E-I", "S-N", "T-F", "J-P"];

const pickQuestion = (questions: MbtiQuestion[]) => {
    const eligible = questions.filter((question) => !recentQuestionIds.includes(question.id));
    const pool = eligible.length > 0 ? eligible : questions;
    return pool[Math.floor(Math.random() * pool.length)];
};

const getRandomAxisKeys = (count: number) => {
    return [...axisKeys].sort(() => Math.random() - 0.5).slice(0, count);
};

export function getMbtiQuiz(): MbtiQuizData {
    const selectedAxisKeys = [...axisKeys, ...getRandomAxisKeys(2)];
    const usedIds = new Set<number>();

    const questions = selectedAxisKeys.map((axisKey) => {
        const axisQuestions = mbtiQuestionPool[axisKey];
        const eligible = axisQuestions.filter((question) => !recentQuestionIds.includes(question.id) && !usedIds.has(question.id));
        const pool = eligible.length > 0 ? eligible : axisQuestions.filter((question) => !usedIds.has(question.id));
        const finalPool = pool.length > 0 ? pool : axisQuestions;
        const question = finalPool[Math.floor(Math.random() * finalPool.length)];
        usedIds.add(question.id);
        return question;
    });

    recentQuestionIds = questions.map((question) => question.id).slice(-8);

    const axisCounts = questions.reduce(
        (counts, question) => {
            counts[question.indicator] += 1;
            return counts;
        },
        {
            "E-I": 0,
            "S-N": 0,
            "T-F": 0,
            "J-P": 0,
        } as Record<MbtiAxisKey, number>
    );

    return { questions, axisCounts };
}

export const mbtiQuestionPool = {
    "E-I": createQuestions([
        {
            id: 1,
            indicator: "E-I",
            text: "달이 걸린 골목 끝에서 마음에 드는 카페를 만났다면?",
            optionA: { text: "누군가와 함께 그 안으로 들어가고 싶다.", value: "E" },
            optionB: { text: "혼자 조용히 들어가 오래 머물고 싶다.", value: "I" },
        },
        {
            id: 2,
            indicator: "E-I",
            text: "좋아하는 장면을 남길 때 더 가까운 방식은?",
            optionA: { text: "사람과 분위기까지 함께 담는다.", value: "E" },
            optionB: { text: "장면 자체를 조용히 기록한다.", value: "I" },
        },
        {
            id: 3,
            indicator: "E-I",
            text: "기운이 잠깐 가라앉은 저녁, 더 먼저 찾는 것은?",
            optionA: { text: "누군가에게 메시지를 보내거나 잠깐 만난다.", value: "E" },
            optionB: { text: "혼자 쉬며 생각을 정리한다.", value: "I" },
        },
        {
            id: 4,
            indicator: "E-I",
            text: "주말에 갑자기 비어 있는 시간이 생겼다면?",
            optionA: { text: "누구를 만나고 어디로 갈지 먼저 떠올린다.", value: "E" },
            optionB: { text: "나만의 시간을 어떻게 쓸지 떠올린다.", value: "I" },
        },
        {
            id: 17,
            indicator: "E-I",
            text: "좋아하는 노래가 흘러나오면 더 가까운 반응은?",
            optionA: { text: "누군가와 함께 듣고 싶은 마음이 든다.", value: "E" },
            optionB: { text: "혼자 반복 재생하며 몰입한다.", value: "I" },
        },
        {
            id: 18,
            indicator: "E-I",
            text: "낯선 자리에서 더 편안한 움직임은?",
            optionA: { text: "먼저 말을 걸며 분위기에 들어간다.", value: "E" },
            optionB: { text: "잠시 지켜보다 익숙해진 뒤 움직인다.", value: "I" },
        },
        {
            id: 25,
            indicator: "E-I",
            text: "좋아하는 취미 모임에 도착했을 때 더 자연스러운 건?",
            optionA: { text: "새로운 사람들과 바로 섞여 대화한다.", value: "E" },
            optionB: { text: "익숙한 사람과 먼저 깊게 이야기한다.", value: "I" },
        },
        {
            id: 26,
            indicator: "E-I",
            text: "작은 성취가 생겼을 때 더 먼저 하고 싶은 것은?",
            optionA: { text: "누군가에게 바로 알려 함께 기뻐한다.", value: "E" },
            optionB: { text: "혼자 조용히 여운을 즐긴다.", value: "I" },
        },
    ]),
    "S-N": createQuestions([
        {
            id: 5,
            indicator: "S-N",
            text: "새로운 공간에 들어섰을 때 먼저 눈에 들어오는 것은?",
            optionA: { text: "구조, 배치, 분위기 같은 실제적인 요소", value: "S" },
            optionB: { text: "왜 이런 느낌이 드는지, 숨은 의미 같은 것", value: "N" },
        },
        {
            id: 6,
            indicator: "S-N",
            text: "좋아하는 이야기를 볼 때 더 끌리는 건?",
            optionA: { text: "연기, 대사, 장면 구성처럼 보이는 디테일", value: "S" },
            optionB: { text: "인물의 관계 변화와 앞으로의 흐름", value: "N" },
        },
        {
            id: 7,
            indicator: "S-N",
            text: "새로운 흐름을 마주했을 때 더 믿음이 가는 것은?",
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
        {
            id: 19,
            indicator: "S-N",
            text: "새로운 소식을 들었을 때 더 먼저 떠오르는 건?",
            optionA: { text: "무슨 일이 실제로 있었는지", value: "S" },
            optionB: { text: "왜 그런 일이 생겼는지", value: "N" },
        },
        {
            id: 20,
            indicator: "S-N",
            text: "사진이나 영상을 볼 때 더 오래 머무는 포인트는?",
            optionA: { text: "눈에 보이는 장면의 디테일", value: "S" },
            optionB: { text: "장면이 남기는 분위기와 여운", value: "N" },
        },
        {
            id: 27,
            indicator: "S-N",
            text: "흩어진 정보를 정리할 때 더 편한 방식은?",
            optionA: { text: "사실과 사례를 순서대로 정리한다.", value: "S" },
            optionB: { text: "핵심 흐름과 의미를 중심으로 묶는다.", value: "N" },
        },
        {
            id: 28,
            indicator: "S-N",
            text: "새로운 취향을 발견했을 때 더 먼저 보는 건?",
            optionA: { text: "실제로 어떤 점이 좋은지 확인한다.", value: "S" },
            optionB: { text: "내 삶에 어떤 기운을 주는지 느껴본다.", value: "N" },
        },
    ]),
    "T-F": createQuestions([
        {
            id: 9,
            indicator: "T-F",
            text: "친구가 마음을 털어놓는 밤, 더 먼저 나오는 반응은?",
            optionA: { text: "무엇이 힘들었는지 차분히 정리해 준다.", value: "T" },
            optionB: { text: "일단 마음부터 편하게 해주고 싶다.", value: "F" },
        },
        {
            id: 10,
            indicator: "T-F",
            text: "누군가의 부탁을 정중히 거절해야 할 때 더 가까운 방식은?",
            optionA: { text: "이유를 분명하게 말하고 선을 긋는다.", value: "T" },
            optionB: { text: "상대가 상처받지 않게 최대한 부드럽게 말한다.", value: "F" },
        },
        {
            id: 11,
            indicator: "T-F",
            text: "따뜻한 칭찬을 들었을 때 더 오래 남는 건?",
            optionA: { text: "내가 잘 해냈다는 객관적인 인정", value: "T" },
            optionB: { text: "그 사람이 진심으로 알아봐 준 따뜻함", value: "F" },
        },
        {
            id: 12,
            indicator: "T-F",
            text: "갈등의 그림자가 드리웠을 때 먼저 보고 싶은 건?",
            optionA: { text: "문제가 왜 생겼는지와 해결 가능성", value: "T" },
            optionB: { text: "서로의 감정이 왜 아팠는지", value: "F" },
        },
        {
            id: 21,
            indicator: "T-F",
            text: "조언을 부탁받았을 때 더 가까운 방식은?",
            optionA: { text: "현실적으로 가능한 선택을 먼저 말한다.", value: "T" },
            optionB: { text: "마음을 다치지 않게 부드럽게 말한다.", value: "F" },
        },
        {
            id: 22,
            indicator: "T-F",
            text: "실수가 생겼을 때 더 먼저 드는 반응은?",
            optionA: { text: "무엇이 틀렸는지 파악한다.", value: "T" },
            optionB: { text: "일단 많이 속상했겠다 싶다.", value: "F" },
        },
        {
            id: 29,
            indicator: "T-F",
            text: "누군가가 선택 앞에서 망설일 때 더 자연스러운 도움은?",
            optionA: { text: "장단점을 비교해 정리해 준다.", value: "T" },
            optionB: { text: "왜 마음이 흔들리는지 함께 들어준다.", value: "F" },
        },
        {
            id: 30,
            indicator: "T-F",
            text: "관계를 볼 때 더 오래 남는 기준은?",
            optionA: { text: "서로에게 어떤 역할을 하는지", value: "T" },
            optionB: { text: "서로가 어떤 감정을 나누는지", value: "F" },
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
            text: "해야 할 일이 여러 개 겹쳤을 때 더 자연스러운 반응은?",
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
            text: "결정을 미루게 되는 상황에서 더 익숙한 것은?",
            optionA: { text: "마감 전에 정해두고 싶다.", value: "J" },
            optionB: { text: "조금 더 두고 보다가 정한다.", value: "P" },
        },
        {
            id: 23,
            indicator: "J-P",
            text: "일정이 갑자기 생겼을 때 더 가까운 반응은?",
            optionA: { text: "먼저 일정표를 다시 맞춘다.", value: "J" },
            optionB: { text: "상황을 보며 유연하게 받아들인다.", value: "P" },
        },
        {
            id: 24,
            indicator: "J-P",
            text: "끝내지 못한 일이 남아 있을 때 더 편한 건?",
            optionA: { text: "정리해서 닫아두는 것", value: "J" },
            optionB: { text: "조금 남아 있어도 괜찮은 것", value: "P" },
        },
        {
            id: 31,
            indicator: "J-P",
            text: "갑자기 일정이 생겼을 때 더 가까운 반응은?",
            optionA: { text: "먼저 일정표를 다시 맞춘다.", value: "J" },
            optionB: { text: "상황을 보며 유연하게 받아들인다.", value: "P" },
        },
        {
            id: 32,
            indicator: "J-P",
            text: "해야 할 목록이 생겼을 때 더 자연스러운 건?",
            optionA: { text: "우선순위를 정해 체크해 나간다.", value: "J" },
            optionB: { text: "크게 묶어서 유연하게 처리한다.", value: "P" },
        },
    ]),
};
