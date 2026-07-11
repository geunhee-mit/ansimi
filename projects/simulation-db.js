// simulation-db.js - Unified Scenario Database for Retro RPG Simulation
window.SIMULATION_DB = {
    // --- PERSONAS DEFINITIONS ---
    personas: {
        wheelchair: {
            name: "민우 (휠체어 이용자)",
            avatar: "♿",
            avatarImg: "../assets/images/pixel_avatar_wheelchair.png",
            startStep: "wc_start"
        },
        infant: {
            name: "현아 (영유아 동반)",
            avatar: "👶",
            avatarImg: "../assets/images/pixel_avatar_infant.png",
            startStep: "inf_start"
        },
        foreign: {
            name: "마이클 (외국인 유학생)",
            avatar: "🌎",
            avatarImg: "../assets/images/pixel_avatar_foreigner.png",
            startStep: "for_start"
        },
        elderly: {
            name: "김순임 (독거 노인)",
            avatar: "👵",
            avatarImg: "../assets/images/pixel_avatar_elderly.png",
            startStep: "eld_start"
        }
    },

    // --- MINIMAP COORDINATES ---
    nodeCoordinates: {
        // Wheelchair Route
        wc_start: { x: 15, y: 80, label: "출발지" },
        wc_elevator_trapped: { x: 15, y: 80, label: "승강기" },
        wc_stairs_wait: { x: 15, y: 80, label: "계단실" },
        wc_alley: { x: 45, y: 80, label: "골목길" },
        wc_accident: { x: 45, y: 55, label: "장애물" },
        wc_main_road: { x: 35, y: 40, label: "대로변" },
        wc_roadway: { x: 65, y: 40, label: "차도" },
        wc_crossing: { x: 60, y: 25, label: "횡단보도" },
        wc_entrance: { x: 80, y: 20, label: "정문 앞" },
        wc_back_door: { x: 80, y: 50, label: "후문 앞" },
        wc_success: { x: 90, y: 35, label: "대피소" },

        // Infant Route
        inf_start: { x: 20, y: 70, label: "출발지" },
        inf_flood: { x: 45, y: 70, label: "사거리" },
        inf_detour: { x: 35, y: 45, label: "오르막" },
        inf_convenience: { x: 65, y: 70, label: "편의점" },
        inf_approach: { x: 75, y: 35, label: "체육관 앞" },
        inf_search: { x: 85, y: 20, label: "복도" },
        inf_call: { x: 85, y: 50, label: "행정실" },
        inf_success: { x: 90, y: 35, label: "대피실" },

        // Foreigner Route
        for_start: { x: 15, y: 75, label: "출발지" },
        for_translate: { x: 40, y: 75, label: "원룸로비" },
        for_follow: { x: 30, y: 50, label: "시장통" },
        for_wrong_way: { x: 65, y: 75, label: "지하주차장" },
        for_correct_way: { x: 55, y: 30, label: "학교정문" },
        for_blocked_door: { x: 80, y: 25, label: "경비초소" },
        for_english_sign: { x: 80, y: 55, label: "비상계단" },
        for_success: { x: 90, y: 40, label: "강당2층" },

        // Elderly Route
        eld_start: { x: 25, y: 80, label: "출발지" },
        eld_app: { x: 45, y: 80, label: "거실" },
        eld_walk: { x: 35, y: 50, label: "골목언덕" },
        eld_rest_center: { x: 60, y: 50, label: "경로당" },
        eld_closed_door: { x: 50, y: 25, label: "정류장" },
        eld_phone_search: { x: 80, y: 50, label: "그늘막" },
        eld_jumin_center: { x: 80, y: 20, label: "주민센터" },
        eld_success: { x: 90, y: 20, label: "대피구역" }
    },

    // --- SCENARIO STEPS DATABASE ---
    scenarios: {
        // --- WHEELCHAIR USER (민우 - 지진) ---
        wc_start: {
            nodeName: "wc_start",
            location: "자택 거실",
            avatar: "♿",
            image: "../assets/images/pixel_earthquake.png",
            text: "강한 지진으로 거실이 크게 흔들립니다. 흔들림이 잦아들었지만 여진 위험이 있으니 휠체어를 타고 즉시 인근 초등학교 운동장 대피소로 향해야 합니다.",
            choices: [
                { text: "계단실 통로로 침착하게 가 경사로를 찾거나 구조 대기한다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "wc_stairs_wait" },
                { text: "빠르게 이동하기 위해 멈출 수 있는 아파트 엘리베이터를 탄다.", label: "위험", hpMod: -1.0, timeMod: -120, nextStep: "wc_elevator_trapped" }
            ]
        },
        wc_elevator_trapped: {
            nodeName: "wc_elevator_trapped",
            location: "엘리베이터 내부",
            avatar: "⚠️",
            text: "정전으로 엘리베이터가 갑자기 덜컥하며 멈췄습니다! 비상 버저를 누르고 긴 기다림 끝에 구조되어 간신히 계단실 복도로 되돌아왔습니다.",
            choices: [
                { text: "계단 통로 피난 대기 구역으로 이동한다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "wc_stairs_wait" }
            ]
        },
        wc_stairs_wait: {
            nodeName: "wc_stairs_wait",
            location: "비상계단 피난 구역",
            avatar: "🚪",
            text: "비상계단 입구에 도달했으나 전동휠체어로 가파른 계단을 굴러 내려갈 수는 없습니다. 휠체어 전용 비상 대기 구역에서 구조 신호를 보내야 합니다.",
            choices: [
                { text: "대피 중인 주변 시민들에게 휠체어를 들어 옮겨달라고 도움을 청한다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "wc_alley" },
                { text: "휠체어 안전바에 의지하여 혼자 힘으로 계단을 굴러 탈출을 감행한다.", label: "위험", hpMod: -2.0, timeMod: -180, nextStep: "wc_accident" }
            ]
        },
        wc_alley: {
            nodeName: "wc_alley",
            location: "갈라진 주택가 골목길",
            avatar: "♿",
            text: "시민들의 도움을 받아 건물 밖 골목길로 빠져나왔습니다. 지진으로 아스팔트 바닥이 쩍쩍 갈라져 있고 낙하물 파편들이 잔뜩 깔려 있습니다.",
            choices: [
                { text: "속도를 줄이고 파편 더미를 돌아서 안전하게 넓은 큰길로 우회한다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "wc_main_road" },
                { text: "바퀴가 끼거나 다칠 위험을 감수하고 쩍 갈라진 지름길을 질주한다.", label: "위험", hpMod: -0.5, timeMod: -120, nextStep: "wc_accident" }
            ]
        },
        wc_accident: {
            nodeName: "wc_accident",
            location: "낙하물이 가로막은 골목",
            avatar: "♿",
            text: "덜컹하는 휠체어 바퀴 충격과 함께 타이어가 파손되어 휠체어가 크게 기우뚱했습니다. 타박상을 입어 몸이 아프지만 다시 전진해야 합니다.",
            choices: [
                { text: "기어가 파손된 휠체어를 점검하며 천천히 큰길 우회로로 향한다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "wc_main_road" }
            ]
        },
        wc_main_road: {
            nodeName: "wc_main_road",
            location: "장애물이 있는 대로변",
            avatar: "♿",
            text: "대로변 인도에 도달했으나 건물 외벽 타일 파편과 깨진 유리 조각들이 인도 위에 수북이 쏟아져 휠체어로 통행할 틈이 전혀 보이지 않습니다.",
            choices: [
                { text: "유리가 없는 반대편 인도까지 횡단보도를 두 번 건너서 멀리 돌아서 간다.", label: "안전", hpMod: 0, timeMod: -120, nextStep: "wc_crossing" },
                { text: "임시로 인도 옆 갓길 차도로 내려가 장애물 구역을 신속하게 질주한다.", label: "위험", hpMod: -0.5, timeMod: -30, nextStep: "wc_roadway" }
            ]
        },
        wc_roadway: {
            nodeName: "wc_roadway",
            location: "혼란스러운 차도 위",
            avatar: "🚗",
            text: "차도로 진입해 휠체어를 운전하는 동안 빗길 못지않게 질주하는 대피 차량들의 틈바구니에서 큰 위협을 느꼈습니다. 겨우 초등학교 정문 앞에 도달했습니다.",
            choices: [
                { text: "초등학교 정문 진입로 상황 확인하기", label: "안전", hpMod: 0, timeMod: -60, nextStep: "wc_entrance" }
            ]
        },
        wc_crossing: {
            nodeName: "wc_crossing",
            location: "우회 횡단보도 앞",
            avatar: "🧭",
            text: "가까운 신호기를 이용해 안전하게 우회하여 초등학교 후문 진입로 보행로에 안전하게 도달했습니다.",
            choices: [
                { text: "초등학교 후문 경사 보도 상황 확인하기", label: "안전", hpMod: 0, timeMod: -60, nextStep: "wc_back_door" }
            ]
        },
        wc_entrance: {
            nodeName: "wc_entrance",
            location: "초등학교 정문 앞",
            avatar: "🏫",
            text: "초등학교 정문에 도달했으나 철문이 닫혀 있고 휠체어 진입 전용 무단차 통로가 지진 철근 낙하물들에 가로막혀 진입할 수 없습니다.",
            choices: [
                { text: "주변 대피 시민들의 손길을 모아 공사 자재를 함께 밀쳐내 통로를 연다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "wc_success" },
                { text: "도움을 찾기 힘드니 휠체어 전용 후문 경사 보도로 다시 먼 길을 이동한다.", label: "위험", hpMod: -0.5, timeMod: -120, nextStep: "wc_back_door" }
            ]
        },
        wc_back_door: {
            nodeName: "wc_back_door",
            location: "초등학교 후문 경사로",
            avatar: "🚪",
            text: "초등학교 후문의 나즈막한 무단차 전용 통로 경사로를 타고 흔들림 없는 학교 운동장 대피 구역 내부 안착에 안전하게 성공했습니다.",
            choices: [
                { text: "운동장 대피 요원에게 대피 안착 보고를 마친다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "wc_success" }
            ]
        },

        // --- INFANT FAMILY (현아 - 침수) ---
        inf_start: {
            nodeName: "inf_start",
            location: "지하철역 인근 골목",
            avatar: "📍",
            image: "../assets/images/pixel_flooding.png",
            text: "칭얼대는 아이를 아기 띠로 업고, 비상 가방을 멘 채 대피를 준비합니다. 빗줄기가 굵어져 지하철역 사거리 큰길에 물이 고이기 시작했습니다.",
            choices: [
                { text: "아이 손을 꼭 붙잡고 물이 고인 사거리를 건넌다.", label: "위험", hpMod: -0.5, timeMod: -60, nextStep: "inf_flood" },
                { text: "아이를 단단히 안아 들고 오르막길 골목으로 우회한다.", label: "안전", hpMod: 0, timeMod: -120, nextStep: "inf_detour" }
            ]
        },
        inf_flood: {
            nodeName: "inf_flood",
            location: "지하철역 사거리 교차로",
            avatar: "🌊",
            text: "물이 발목까지 차오르자 아이가 빗소리와 물살에 놀라 자지러지게 우며 안아달라고 빕니다. 짐과 아기를 동시에 감당하려니 발걸음이 너무 무겁습니다.",
            choices: [
                { text: "길가의 편의점 처마 밑으로 들어가 아이를 달랜다.", label: "안전", hpMod: 0.5, timeMod: -120, nextStep: "inf_convenience" },
                { text: "지체하다 고립될 수 있으니 꿋꿋이 대피소로 전진한다.", label: "위험", hpMod: -0.5, timeMod: -60, nextStep: "inf_approach" }
            ]
        },
        inf_detour: {
            nodeName: "inf_detour",
            location: "초등학교 부근 오르막 골목",
            avatar: "🤝",
            text: "골목길로 올라오니 빗물 침수는 덜합니다. 가던 도중 유모차 바퀴가 높은 연석 보도블록에 가로막혀 끙끙대는 다른 가구를 만납니다. 함께 유모차를 들어 넘어주고 동행합니다.",
            choices: [
                { text: "이웃 유모차 가구와 보조를 맞춰 초등학교로 전진한다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "inf_approach" }
            ]
        },
        inf_convenience: {
            nodeName: "inf_convenience",
            location: "골목 안쪽 24시 편의점",
            avatar: "🏪",
            text: "편의점에 들러 아이에게 따뜻한 음료를 물리고 젖은 옷을 정리합니다. 아이가 칭얼거림을 멈췄습니다. 다시 단단히 채비를 마치고 학교 대피소로 나섭니다.",
            choices: [
                { text: "초등학교 대피소 건물로 이동하기", label: "안전", hpMod: 0, timeMod: -60, nextStep: "inf_approach" }
            ]
        },
        inf_approach: {
            nodeName: "inf_approach",
            location: "초등학교 강당 현관",
            avatar: "☔",
            text: "폭우를 뚫고 드디어 초등학교 강당 내부 대피소에 무사히 도착했습니다! 땀과 비로 온몸이 젖었습니다. 하지만 아이 기저귀를 갈아야 하는데 내부 안내판이나 도우미가 전혀 보이지 않습니다.",
            choices: [
                { text: "우는 아이를 안고 화장실과 주변 행정실을 찾아 헤맨다.", label: "위험", hpMod: -0.5, timeMod: -180, nextStep: "inf_search" },
                { text: "스마트폰 안전안내문에 기재된 재난공무원 직통 번호로 연락한다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "inf_call" }
            ]
        },
        inf_search: {
            nodeName: "inf_search",
            location: "강당 건물 내부 복도",
            avatar: "🚪",
            text: "안고 헤맨 끝에 닫혀 있는 방들을 지나 행정실 옆 구석에 간이 가림막으로 설치된 임시 영유아 쉼터를 발견했습니다. 안내가 너무 없어 체력이 다 떨어졌습니다.",
            choices: [
                { text: "쉼터 매트에 아이를 눕히며 대피 완료하기", label: "안전", hpMod: 0, timeMod: -60, nextStep: "inf_success" }
            ]
        },
        inf_call: {
            nodeName: "inf_call",
            location: "대피소 내부",
            avatar: "📞",
            text: "재난 담당 공무원과 통화해, 행정실 뒤쪽에 임시 모자 수유 공간이 지정되어 있음을 즉시 안내받아 바로 찾아갔습니다! 휴식 공간과 따뜻한 물을 확보했습니다.",
            choices: [
                { text: "영유아 대피실로 입장해 대피 완료하기", label: "안전", hpMod: 0, timeMod: -60, nextStep: "inf_success" }
            ]
        },

        // --- FOREIGNER STUDENT (마이클 - 화학재난) ---
        for_start: {
            nodeName: "for_start",
            location: "동네 주택가 원룸 앞",
            avatar: "📍",
            image: "../assets/images/pixel_chemical.png",
            text: "갑자기 인근 지역 방향 하늘에서 사이렌 경보음이 크게 울립니다. 스마트폰에 삐- 소리와 함께 재난 긴급 알림 문자가 한글로 수신되었지만, 한글을 읽기 어려워 무슨 상황인지 모릅니다. 매캐한 가스 냄새가 바람을 타고 불어옵니다.",
            choices: [
                { text: "번역 앱을 켜서 문자 이미지를 번역한다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "for_translate" },
                { text: "다급하게 비명을 지르며 뛰는 사람들을 뒤따라 달린다.", label: "위험", hpMod: -0.5, timeMod: -60, nextStep: "for_follow" }
            ]
        },
        for_translate: {
            nodeName: "for_translate",
            location: "원룸 건물 1층 로비",
            avatar: "📱",
            text: "번역 결과: '[화학공장] 가스 누출 발생. 즉시 창문을 밀폐하고 실내 대기하거나 안전한 지하 민방위 대피소로 대피 요망.' 가스 유해 물질은 지하로 스며들 수 있어 대피 방향 설정이 매우 시급합니다.",
            choices: [
                { text: "지도 앱에서 지하 대피소(아파트 지하 대피소)를 찾아 내려간다.", label: "위험", hpMod: 0, timeMod: -60, nextStep: "for_wrong_way" },
                { text: "가스가 가라앉는 저지대를 피해 고지대인 인근 중학교 대피소로 향한다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "for_correct_way" }
            ]
        },
        for_follow: {
            nodeName: "for_follow",
            location: "동네 골목 시장통",
            avatar: "🏃",
            text: "피난 인파를 무작정 쫓아 달렸습니다. 영문 표지판이나 다국어 지원 대피 안내기가 어디에도 없어 가스 테러인지 누출인지조차 분간이 어렵습니다. 눈이 따갑고 기침이 나기 시작합니다.",
            choices: [
                { text: "가스가 누출된 대로변을 벗어나 지대 높은 학교 언덕길로 대피한다.", label: "안전", hpMod: -0.5, timeMod: -120, nextStep: "for_correct_way" }
            ]
        },
        for_wrong_way: {
            nodeName: "for_wrong_way",
            location: "인근 아파트 지하 주차장",
            avatar: "☣️",
            text: "지하 대피시설로 피신했습니다. 하지만 방송 스피커에서는 한국어로만 긴급 대피 취소 방송이 들립니다. 유출된 화학 가스가 공기보다 무거워 지하 주차장 아래로 고이기 시작합니다! 빨리 탈출해야 합니다.",
            choices: [
                { text: "숨을 참으며 지상 고지대로 다시 올라간다.", label: "위험", hpMod: -1.5, timeMod: -120, nextStep: "for_correct_way" }
            ]
        },
        for_correct_way: {
            nodeName: "for_correct_way",
            location: "중학교 정문 앞",
            avatar: "🚧",
            text: "바람을 거슬러 높은 중학교 정문에 간신히 도달했습니다. 하지만 철문이 잠겨 있고, 한국어로 '화학가스 대피 불가, 인근 실내 체육관으로 가세요'라는 수기 안내장만 덜렁 붙어 있습니다.",
            choices: [
                { text: "굳게 닫힌 경비초소 창문을 두드리며 영어로 대피를 호소한다.", label: "위험", hpMod: 0, timeMod: -120, nextStep: "for_blocked_door" },
                { text: "본관 벽면에 작게 적힌 영문 방향 이정표를 찾는다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "for_english_sign" }
            ]
        },
        for_blocked_door: {
            nodeName: "for_blocked_door",
            location: "학교 경비실 유리창 앞",
            avatar: "🗣️",
            text: "경비원이 영어 질문을 이해하지 못해 손짓발짓으로만 거부합니다. 대피 시설에 외국어 응대 가이드나 소통 카드가 전혀 없어 소중한 골든타임만 낭비됩니다. 가스 냄새가 턱밑까지 번졌습니다.",
            choices: [
                { text: "가스 흡입 위험을 느끼고 영문 이정표가 있는 건물 옆문으로 우회한다.", label: "안전", hpMod: -0.5, timeMod: -60, nextStep: "for_english_sign" }
            ]
        },
        for_english_sign: {
            nodeName: "for_english_sign",
            location: "학교 본관 옆 비상 계단",
            avatar: "🧭",
            text: "이정표에서 'Chemical Gas Evacuee Area -> Multi-purpose Room (2F)' 영문 문구를 찾아 전용 밀폐 차단문이 설치된 강당 2층으로 안전하게 진입했습니다.",
            choices: [
                { text: "영문 안내 대기소 내부로 들어가 대피 성공하기", label: "안전", hpMod: 0, timeMod: -60, nextStep: "for_success" }
            ]
        },

        // --- ELDERLY SCENARIO (김순임 - 폭염) ---
        eld_start: {
            nodeName: "eld_start",
            location: "독거노인 자택 안방",
            avatar: "👵",
            image: "../assets/images/pixel_heatwave.png",
            text: "한낮 폭염 경보 기온이 38도를 돌파했습니다. 오래된 에어컨이 실외기 과열로 멈춰 좁은 방 안이 찜통으로 변했습니다. 머리가 핑 돕니다. 동네 무더위쉼터로 대피해야 합니다.",
            choices: [
                { text: "익숙하지 않은 스마트폰을 켜서 인터넷이나 재난안전 앱으로 무더위쉼터를 검색해본다.", label: "위험", hpMod: 0, timeMod: -180, nextStep: "eld_app" },
                { text: "평소 이웃에게 들었던 언덕 위 동네 경로당 쉼터로 나선다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "eld_walk" }
            ]
        },
        eld_app: {
            nodeName: "eld_app",
            location: "어두운 자택 거실",
            avatar: "📱",
            text: "앱의 돋보기 메뉴를 켜도 글씨가 너무 작고 복잡해 어디를 눌러야 무더위쉼터가 나오는지 헤맵니다. 화면 밝기가 낮아 눈이 침침하고, 골방 열기 속에서 시간만 계속 흘러갑니다.",
            choices: [
                { text: "스마트폰 검색을 포기하고 실버카에 의지해 밖으로 나간다.", label: "안전", hpMod: -0.5, timeMod: -60, nextStep: "eld_walk" }
            ]
        },
        eld_walk: {
            nodeName: "eld_walk",
            location: "아스팔트 골목길 언덕",
            avatar: "☀️",
            text: "작열하는 태양 볕 아래 그늘 한 점 없는 가파른 골목 언덕을 실버카를 짚어가며 천천히 올라갑니다. 땅바닥에서 올라오는 열기로 가슴이 두근거리고 호흡이 벅깝니다.",
            choices: [
                { text: "언덕 중턱에 위치한 동네 노인 경로당 쉼터로 들어간다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "eld_rest_center" }
            ]
        },
        eld_rest_center: {
            nodeName: "eld_rest_center",
            location: "동네 경로당 무더위쉼터 앞",
            avatar: "🚪",
            text: "경로당에 다다랐으나 문이 단단히 잠겨 있습니다. 작은 인쇄지에 '냉방비 지원금 소진 및 주말 미운영으로 인해 휴관합니다'라고 쓰여 있습니다. 주소만 보고 찾아왔는데 헛걸음했습니다.",
            choices: [
                { text: "주민센터 쉼터까지 무작정 다시 한 정거장 더 걸어간다.", label: "위험", hpMod: -1.5, timeMod: -120, nextStep: "eld_closed_door" },
                { text: "실버카에 붙은 주민센터 대표 전화번호 스티커를 찾아 전화를 건다.", label: "안전", hpMod: 0, timeMod: -120, nextStep: "eld_phone_search" }
            ]
        },
        eld_closed_door: {
            nodeName: "eld_closed_door",
            location: "버스정류장 벤치 골목",
            avatar: "⚠️",
            text: "햇볕을 받으며 무작정 걷던 중 강한 현기증과 탈수 증세로 길가 연석에 털썩 주저앉아 고립되었습니다. 지나가던 요구르트 배달원이 냉수를 건네주며 도와주어 간신히 정신을 수습합니다.",
            choices: [
                { text: "부축을 받으며 바로 옆 동네 행정복지센터 무더위쉼터로 이동한다.", label: "안전", hpMod: -0.5, timeMod: -60, nextStep: "eld_jumin_center" }
            ]
        },
        eld_phone_search: {
            nodeName: "eld_phone_search",
            location: "경로당 그늘막 아래",
            avatar: "📞",
            text: "주민센터 당직 공무원과 통화가 연결되었습니다. '경로당은 휴관이지만 주민센터 1층 민원실 로비는 상시 무더위 쉼터로 물과 에어컨을 개방하고 있으니 그리로 오세요!' 쉴 곳을 확실히 파악했습니다.",
            choices: [
                { text: "확인한 행정복지센터 대피 구역으로 걸어간다.", label: "안전", hpMod: 0, timeMod: -60, nextStep: "eld_jumin_center" }
            ]
        },
        eld_jumin_center: {
            nodeName: "eld_jumin_center",
            location: "행정복지센터 무더위쉼터 로비",
            avatar: "🏢",
            text: "드디어 에어컨이 시원하게 가동되는 주민센터 무더위 쉼터 로비에 도착했습니다. 시원한 식수를 마시며 대피에 성공합니다.",
            choices: [
                { text: "정수기 물을 들이켜며 대피 완료하기", label: "안전", hpMod: 0, timeMod: -60, nextStep: "eld_success" }
            ]
        }
    }
};
