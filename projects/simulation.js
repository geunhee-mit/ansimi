// simulation.js - Retro Interactive Evacuation Simulation Game Logic (Enhanced HUD & Outlined Text)

const game = {
    state: {
        persona: null,      // 'wheelchair', 'infant', 'foreign', 'elderly'
        hp: 3.0,            // Max 3.0 hearts (supports half-hearts like 2.5, 1.5)
        timeRemaining: 600, // 10 minutes in seconds (600s)
        currentStep: '',
        timerInterval: null,
        isTyping: false,
        visitedNodes: []    // Track visited nodes for map highlighting
    },

    // Character profiles, coordinates, and scenarios loaded from database (simulation-db.js)
    personas: {},
    nodeCoordinates: {},

    // Map Connections (Lines) per persona
    mapConnections: {
        wheelchair: [
            ['wc_start', 'wc_stairs_wait'],
            ['wc_start', 'wc_elevator_trapped'],
            ['wc_elevator_trapped', 'wc_stairs_wait'],
            ['wc_stairs_wait', 'wc_alley'],
            ['wc_stairs_wait', 'wc_accident'],
            ['wc_alley', 'wc_main_road'],
            ['wc_alley', 'wc_accident'],
            ['wc_accident', 'wc_main_road'],
            ['wc_main_road', 'wc_roadway'],
            ['wc_main_road', 'wc_crossing'],
            ['wc_roadway', 'wc_entrance'],
            ['wc_crossing', 'wc_back_door'],
            ['wc_entrance', 'wc_success'],
            ['wc_entrance', 'wc_back_door'],
            ['wc_back_door', 'wc_success']
        ],
        infant: [
            ['inf_start', 'inf_flood'],
            ['inf_start', 'inf_detour'],
            ['inf_flood', 'inf_convenience'],
            ['inf_flood', 'inf_approach'],
            ['inf_detour', 'inf_approach'],
            ['inf_convenience', 'inf_approach'],
            ['inf_approach', 'inf_search'],
            ['inf_approach', 'inf_call'],
            ['inf_search', 'inf_success'],
            ['inf_call', 'inf_success']
        ],
        foreign: [
            ['for_start', 'for_translate'],
            ['for_start', 'for_follow'],
            ['for_translate', 'for_wrong_way'],
            ['for_translate', 'for_correct_way'],
            ['for_follow', 'for_correct_way'],
            ['for_wrong_way', 'for_correct_way'],
            ['for_correct_way', 'for_blocked_door'],
            ['for_correct_way', 'for_english_sign'],
            ['for_blocked_door', 'for_english_sign'],
            ['for_english_sign', 'for_success']
        ],
        elderly: [
            ['eld_start', 'eld_app'],
            ['eld_start', 'eld_walk'],
            ['eld_app', 'eld_walk'],
            ['eld_walk', 'eld_rest_center'],
            ['eld_rest_center', 'eld_phone_search'],
            ['eld_rest_center', 'eld_closed_door'],
            ['eld_closed_door', 'eld_jumin_center'],
            ['eld_phone_search', 'eld_jumin_center'],
            ['eld_jumin_center', 'eld_success']
        ]
    },

    // Branching narrative scenarios loaded from database (simulation-db.js)
    scenarios: {},

    // Initialize Game
    init() {
        if (window.SIMULATION_DB) {
            this.personas = window.SIMULATION_DB.personas;
            this.nodeCoordinates = window.SIMULATION_DB.nodeCoordinates;
            this.scenarios = window.SIMULATION_DB.scenarios;
        }
        this.changeScreen('screen-title');
    },

    // Screen change handler
    changeScreen(screenId) {
        document.querySelectorAll('.game-section').forEach(sec => {
            sec.classList.remove('active');
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) targetScreen.classList.add('active');
    },

    // Character Selection
    selectCharacter(charId) {
        this.state.persona = charId;
        this.state.hp = 3.0; // Max 3 hearts now
        this.state.timeRemaining = 600; // 10 minutes
        this.state.currentStep = this.personas[charId].startStep;
        this.state.visitedNodes = [this.scenarios[this.state.currentStep].nodeName];
        
        // Start Game Timer
        this.startTimer();

        // Render gameplay screen
        this.changeScreen('screen-gameplay');
        this.renderStep();
    },

    // Timer control
    startTimer() {
        if (this.state.timerInterval) clearInterval(this.state.timerInterval);
        
        this.state.timerInterval = setInterval(() => {
            if (this.state.timeRemaining > 0) {
                this.state.timeRemaining--;
                this.updateHUD();
            } else {
                this.endGame(false, "timeup");
            }
        }, 1000);
    },

    stopTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
    },

    // Dynamic Pixel Heart Render Helper (3 hearts maximum, supports half hearts via SVG gradient)
    renderHeartsSVG(hp) {
        let html = `
            <svg width="0" height="0" style="position:absolute; width:0; height:0;">
                <defs>
                    <linearGradient id="half-heart-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="50%" stop-color="#FF0000" />
                        <stop offset="50%" stop-color="#555555" />
                    </linearGradient>
                </defs>
            </svg>
        `;
        for (let i = 0; i < 3; i++) {
            let fillColor = '#555555'; // default empty heart color
            if (hp >= i + 1) {
                fillColor = '#FF0000'; // full heart
            } else if (hp > i && hp < i + 1) {
                fillColor = 'url(#half-heart-grad)'; // half heart
            }
            html += `
                <svg class="pixel-heart" viewBox="0 0 9 8" width="22" height="20" style="margin-right: 3px;">
                    <path d="M2,0 H3 V1 H4 V2 H5 V1 H6 V0 H7 V1 H8 V3 H7 V4 H6 V5 H5 V6 H4 V7 H3 V6 H2 V5 H1 V4 H0 V1 Z" fill="${fillColor}" stroke="#000000" stroke-width="1" />
                </svg>
            `;
        }
        return html;
    },

    // Render HUD with Safe DOM checks
    updateHUD() {
        const char = this.personas[this.state.persona];
        if (!char) return;

        const nameEl = document.getElementById('hud-name');
        if (nameEl) nameEl.textContent = char.name;
        
        const avatarBox = document.getElementById('hud-avatar-box');
        if (avatarBox) {
            if (char.avatarImg) {
                avatarBox.innerHTML = `<img src="${char.avatarImg}" alt="${char.name}" class="char-avatar-img">`;
            } else {
                avatarBox.textContent = char.avatar;
            }
        }

        const hpHearts = document.getElementById('hud-hp-hearts');
        if (hpHearts) hpHearts.innerHTML = this.renderHeartsSVG(this.state.hp);

        const timeEl = document.getElementById('hud-time');
        if (timeEl) {
            const mins = Math.floor(this.state.timeRemaining / 60);
            const secs = this.state.timeRemaining % 60;
            timeEl.textContent = 
                `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            // Adjust timer color depending on remaining time
            if (this.state.timeRemaining < 10) {
                timeEl.style.color = '#e63946'; // Red
            } else if (this.state.timeRemaining < 60) {
                timeEl.style.color = '#ffd166'; // Yellow
            } else {
                timeEl.style.color = '#ffffff'; // White
            }
        }
    },

    // Render Current Step Scenario & Choices & Minimap with Safe DOM checks
    renderStep() {
        this.updateHUD();
        const stepData = this.scenarios[this.state.currentStep];
        if (!stepData) return;

        // Track path history
        if (!this.state.visitedNodes.includes(stepData.nodeName)) {
            this.state.visitedNodes.push(stepData.nodeName);
        }

        // Render Location & Icon (Safe check)
        const avatarEl = document.getElementById('scenario-avatar');
        if (avatarEl) avatarEl.textContent = stepData.avatar || "📍";
        
        const locEl = document.getElementById('scenario-location');
        if (locEl) locEl.textContent = stepData.location || "대피소 가는 길";

        // Render gameplay background bleed dynamically
        const bgContainer = document.getElementById('gameplay-bg');
        if (bgContainer) {
            if (stepData.image) {
                bgContainer.style.backgroundImage = `url(${stepData.image})`;
            } else {
                // Persona-specific fallback ambient images instead of duplicating the title screen image!
                let bgImage = 'none';
                let fallbackGradient = 'linear-gradient(180deg, #172026 0%, #0b0f12 100%)';
                if (this.state.persona === 'wheelchair' || this.state.persona === 'infant') {
                    bgImage = 'url(../assets/images/pixel_flooding.png)';
                } else if (this.state.persona === 'foreign') {
                    bgImage = 'url(../assets/images/pixel_chemical.png)';
                } else if (this.state.persona === 'elderly') {
                    bgImage = 'url(../assets/images/pixel_heatwave.png)';
                }
                bgContainer.style.backgroundImage = bgImage !== 'none' ? bgImage : fallbackGradient;
            }
            bgContainer.style.backgroundSize = 'cover';
            bgContainer.style.backgroundPosition = 'center';
        }

        // Typewriter Effect for Scenario text (Safe check)
        const textContainer = document.getElementById('scenario-text');
        if (textContainer) {
            this.typeWriter(stepData.text, textContainer, () => {
                // Render choices once typing is finished
                this.renderChoices(stepData.choices);
            });
        } else {
            // Fallback if typewriter is disabled or DOM element missing
            this.renderChoices(stepData.choices);
        }

        // Render SVG Minimap
        this.renderMinimap(stepData.nodeName, stepData.blocked || []);
    },

    // Typewriter effect function
    typeWriter(text, element, callback) {
        if (!element) return;
        if (this.state.isTyping) return;
        this.state.isTyping = true;
        element.innerHTML = '';
        
        let i = 0;
        const speed = 20; // Fast speed for gameplay flow
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                game.state.isTyping = false;
                if (callback) callback();
            }
        }
        type();
    },

    // Render Choice Buttons with Safe DOM checks
    renderChoices(choices) {
        const container = document.getElementById('choices-container');
        if (!container) return;
        container.innerHTML = '';

        if (!choices || choices.length === 0) return;

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'pixel-btn';
            
            // Remove any leading numbers or dots (e.g. "1. ")
            const cleanText = choice.text.replace(/^\d+\.\s*/, '').trim();
            
            const scenarioDiv = document.createElement('div');
            scenarioDiv.className = 'choice-scenario';
            scenarioDiv.textContent = cleanText;
            
            const modifiersDiv = document.createElement('div');
            modifiersDiv.className = 'choice-modifiers';
            
            let hpText = '';
            let hpClass = '';
            const hpVal = choice.hpMod !== undefined ? choice.hpMod : 0;
            if (hpVal < 0) {
                hpText = `체력 ▼${Math.abs(hpVal)}`;
                hpClass = 'modifier-neg';
            } else if (hpVal > 0) {
                hpText = `체력 ▲${Math.abs(hpVal)}`;
                hpClass = 'modifier-pos';
            } else {
                hpText = `체력 0`;
                hpClass = 'modifier-neutral';
            }
            
            let timeText = '';
            let timeClass = '';
            const timeVal = choice.timeMod !== undefined ? choice.timeMod : 0;
            if (timeVal < 0) {
                const secs = Math.abs(timeVal);
                if (secs < 60) {
                    timeText = `시간 ▼${secs}초`;
                } else {
                    timeText = `시간 ▼${secs / 60}분`;
                }
                timeClass = 'modifier-neg';
            } else if (timeVal > 0) {
                const secs = Math.abs(timeVal);
                if (secs < 60) {
                    timeText = `시간 ▲${secs}초`;
                } else {
                    timeText = `시간 ▲${secs / 60}분`;
                }
                timeClass = 'modifier-pos';
            } else {
                timeText = `시간 0분`;
                timeClass = 'modifier-neutral';
            }
            
            modifiersDiv.innerHTML = `<span class="${hpClass}" style="margin-right: 12px;">${hpText}</span><span class="${timeClass}">${timeText}</span>`;
            
            btn.appendChild(scenarioDiv);
            btn.appendChild(modifiersDiv);

            btn.onclick = () => {
                if (this.state.isTyping) return; // Prevent clicking while typing
                this.makeChoice(choice);
            };
            container.appendChild(btn);
        });
    },

    // Handle Choice Click
    makeChoice(choice) {
        // Apply modifications
        if (choice.hpMod) {
            this.state.hp = Math.max(0, Math.min(3.0, this.state.hp + choice.hpMod));
        }
        if (choice.timeMod) {
            this.state.timeRemaining = Math.max(0, this.state.timeRemaining + choice.timeMod);
        }

        this.updateHUD();

        // Check fail conditions
        if (this.state.hp <= 0) {
            this.endGame(false, "hp");
            return;
        }

        if (this.state.timeRemaining <= 0) {
            this.endGame(false, "timeup");
            return;
        }

        // FIXED SUCCESS STEP CHECK: trigger end game if choice nextStep ends with '_success' or is 'success'
        if (choice.nextStep.endsWith('_success') || choice.nextStep === 'success') {
            this.state.currentStep = choice.nextStep;
            this.endGame(true);
        } else {
            this.state.currentStep = choice.nextStep;
            this.renderStep();
        }
    },

    // Interactive SVG Minimap Renderer - Overhauled to look exactly like pixel art blocks
    renderMinimap(currentNode, blocked) {
        const svg = document.getElementById('minimap-svg');
        const legend = document.getElementById('minimap-legend');
        if (!svg) return;

        svg.innerHTML = ''; // Clear previous elements
        const personaId = this.state.persona;
        if (!personaId) return;

        const connections = this.mapConnections[personaId] || [];
        const coords = this.nodeCoordinates;
        
        // 1. Draw Paths (Lines) - Made thicker and blockier
        connections.forEach(([nodeA, nodeB]) => {
            const coordA = coords[nodeA];
            const coordB = coords[nodeB];
            if (!coordA || !coordB) return;

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", coordA.x);
            line.setAttribute("y1", coordA.y);
            line.setAttribute("x2", coordB.x);
            line.setAttribute("y2", coordB.y);

            // Determine line status
            const isBlocked = blocked.some(
                ([bA, bB]) => (bA === nodeA && bB === nodeB) || (bA === nodeB && bB === nodeA)
            );
            const isTraversed = this.state.visitedNodes.includes(nodeA) && this.state.visitedNodes.includes(nodeB);

            if (isBlocked) {
                line.setAttribute("stroke", "var(--retro-red)");
                line.setAttribute("stroke-width", "5");
                line.setAttribute("stroke-dasharray", "4,3");
                
                // Draw a block X in the middle of the line
                const midX = (coordA.x + coordB.x) / 2;
                const midY = (coordA.y + coordB.y) / 2;
                const xText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                xText.setAttribute("x", midX);
                xText.setAttribute("y", midY + 1);
                xText.setAttribute("fill", "var(--retro-red)");
                xText.setAttribute("font-size", "9px");
                xText.setAttribute("font-weight", "bold");
                xText.setAttribute("text-anchor", "middle");
                xText.setAttribute("dominant-baseline", "middle");
                xText.textContent = "✕";
                svg.appendChild(xText);
            } else if (isTraversed) {
                line.setAttribute("stroke", "var(--retro-yellow)");
                line.setAttribute("stroke-width", "5");
            } else {
                line.setAttribute("stroke", "var(--retro-ink)");
                line.setAttribute("stroke-width", "3");
                line.setAttribute("stroke-dasharray", "4,4");
            }

            svg.appendChild(line);
        });

        // 2. Draw Nodes (Squares instead of Circles for 8-bit retro pixel block aesthetic)
        Object.keys(coords).forEach(nodeKey => {
            // Only draw nodes that belong to the current persona
            const subStr = personaId.substring(0, 3);
            const isMatch = nodeKey.startsWith(subStr);
            if (!isMatch) return;

            const coord = coords[nodeKey];
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            // Node size is 9x9 pixels
            rect.setAttribute("x", coord.x - 4.5);
            rect.setAttribute("y", coord.y - 4.5);
            rect.setAttribute("width", "9");
            rect.setAttribute("height", "9");
            rect.setAttribute("rx", "1"); // slightly rounded square for pixel styling

            // Style nodes
            if (nodeKey === currentNode) {
                rect.setAttribute("fill", "var(--retro-yellow)");
                rect.setAttribute("stroke", "var(--retro-ink)");
                rect.setAttribute("stroke-width", "2");
            } else if (nodeKey.includes('success')) {
                rect.setAttribute("fill", "var(--retro-green)");
                rect.setAttribute("stroke", "var(--retro-ink)");
                rect.setAttribute("stroke-width", "2");
            } else if (this.state.visitedNodes.includes(nodeKey)) {
                rect.setAttribute("fill", "var(--retro-blue)");
                rect.setAttribute("stroke", "var(--retro-ink)");
                rect.setAttribute("stroke-width", "1.5");
            } else {
                rect.setAttribute("fill", "var(--retro-soft)");
                rect.setAttribute("stroke", "var(--retro-ink)");
                rect.setAttribute("stroke-width", "1.5");
            }
            svg.appendChild(rect);
        });

        // 3. Draw Player Position Icon over Current Node
        const currentCoord = coords[currentNode];
        if (currentCoord) {
            const playerChar = document.createElementNS("http://www.w3.org/2000/svg", "text");
            playerChar.setAttribute("x", currentCoord.x);
            playerChar.setAttribute("y", currentCoord.y + 0.5);
            playerChar.setAttribute("font-size", "7px");
            playerChar.setAttribute("text-anchor", "middle");
            playerChar.setAttribute("dominant-baseline", "middle");
            
            // Avatar mapping
            playerChar.textContent = this.personas[this.state.persona].avatar;
            svg.appendChild(playerChar);

            // Update Legend Title text
            if (legend) legend.textContent = `현재: ${currentCoord.label}`;
        }
    },

    // Game End Handler with Safe DOM checks
    endGame(isSuccess, reason) {
        this.stopTimer();
        this.changeScreen('screen-result');

        const titleEl = document.getElementById('result-title');
        const badgeEl = document.getElementById('result-badge');
        const descEl = document.getElementById('result-text');
        const insightEl = document.getElementById('insight-text');

        if (isSuccess) {
            if (titleEl) titleEl.textContent = "대피 성공 (SUCCESS)";
            if (badgeEl) {
                badgeEl.className = "result-badge success";
                badgeEl.textContent = "대피 완료!";
            }
            
            if (descEl) {
                if (this.state.persona === 'wheelchair') {
                    descEl.innerHTML = `
                        <p>축하합니다! 휠체어를 타고 무단차 후문 경로를 선택하여 강당 대피소에 도달하셨습니다.</p>
                        <p>현장 검증 결과, 휠체어 단차 정보와 엘리베이터 여부가 데이터로 미리 연계되지 않았다면 대피는 실패했을 것입니다.</p>
                    `;
                } else if (this.state.persona === 'infant') {
                    descEl.innerHTML = `
                        <p>축하합니다! 우는 아기를 비바람으로부터 안전한 아기 쉼터 공간까지 무사히 대피시켰습니다.</p>
                        <p>현장 검증 결과, 대피소 내부에 기저귀를 갈거나 아이를 먹일 쉼터 유무와 긴급 연락처 연동이 대피의 질을 좌우합니다.</p>
                    `;
                } else if (this.state.persona === 'foreign') {
                    descEl.innerHTML = `
                        <p>Congratulations! 화학 가스의 침하 특성을 파악하고 한글 닫힘 문을 영문 가이드를 찾아 우회하여 무사히 2층 강당으로 진입했습니다.</p>
                        <p>밋앤핵 워크숍 피드백 결과, 다국어 문자 지원과 재난유형별(가스 유출 시 지하 대피 위험) 이용 규칙이 누락되면 외국인은 무방비로 고립됩니다.</p>
                    `;
                } else if (this.state.persona === 'elderly') {
                    descEl.innerHTML = `
                        <p>축하합니다! 스마트폰의 한계를 유선(전화) 문의로 해결하고 폭염을 피해 주민센터 쉼터로 안전하게 대피했습니다.</p>
                        <p>밋앤핵 워크숍 피드백 결과, 주소만 보고 찾아간 경로당이 문을 닫았을 때, 전화번호와 실시간 개방 여부 데이터의 공백은 고령층에게 치명적입니다.</p>
                    `;
                }
            }

            if (insightEl) {
                if (this.state.persona === 'wheelchair') {
                    insightEl.textContent = "2026년 탐방 결과: 대피소까지의 경로상 계단/단차 여부, 실제 이용 층수(강당 지상 1층), 휠체어 경사로 위치는 단순 주소보다 중요합니다.";
                } else if (this.state.persona === 'infant') {
                    insightEl.textContent = "2026년 탐방 결과: 영유아 가구는 대피 도중 쉴 수 있는 편의점 같은 '생활 거점'과 도착 후 대피소 내부의 '수유 공간/담당 주체 연락처'가 데이터로 꼭 명시되어야 합니다.";
                } else if (this.state.persona === 'foreign') {
                    insightEl.textContent = "2025년 밋앤핵 결과: 다국어(영문) 재난 전파 채널의 부재, 화학물질 사고 시 대피 원칙(무작정 지하로 가지 말 것)의 가이드는 외국인 생존을 가르는 핵심 공백 데이터입니다.";
                } else if (this.state.persona === 'elderly') {
                    insightEl.textContent = "2025년 밋앤핵 결과: 독거 노인 등 디지털 취약 계층의 대피 경로는 앱 보행 검색보다 직접 전화할 수 있는 유선 채널, 그리고 주민센터 무더위 쉼터 개방 조건/에어컨 가동 조건 등이 연동되어야 안전이 보장됩니다.";
                }
            }
        } else {
            if (titleEl) titleEl.textContent = "대피 실패 (GAME OVER)";
            if (badgeEl) {
                badgeEl.className = "result-badge fail";
                badgeEl.textContent = "대피 실패...";
            }

            if (descEl) {
                if (reason === 'hp') {
                    descEl.innerHTML = `<p>체력이 모두 소진되었습니다! 침수된 도로를 건너다 미끄러지거나, 화학가스를 흡입해 호흡 곤란을 겪거나, 뜨거운 뙤약볕 속 탈수 증세로 길가에서 고립되었습니다.</p>`;
                } else if (reason === 'timeup') {
                    descEl.innerHTML = `<p>대피 제한 시간이 초과되었습니다! 골든타임 내에 대피소 내부로 들어가지 못해 유독가스에 노출되거나 불어난 물길에 가로막혔습니다.</p>`;
                }
            }

            if (insightEl) {
                if (this.state.persona === 'wheelchair') {
                    insightEl.textContent = "2026년 탐방 결과: 휠체어 이용자는 우회로 진입 시 지체 시간이 2~3배로 늘어납니다. 보도상 장애물 데이터가 연동되지 않으면 골든타임을 순식간에 잃어버립니다.";
                } else if (this.state.persona === 'infant') {
                    insightEl.textContent = "2026년 탐방 결과: 영유아를 동반한 대피는 일반 보행속도의 절반 수준입니다. 침수 도로 진입 우회와 편의점 등의 안전 쉼터 데이터 연동이 급선무입니다.";
                } else if (this.state.persona === 'foreign') {
                    insightEl.textContent = "2025년 밋앤핵 결과: 화학 가스 사고 시 한글 텍스트 안내 및 번역 지연은 생존 시간을 직접 갉아먹으며, 무단 지하 대피로 가스 피해를 가중합니다.";
                } else if (this.state.persona === 'elderly') {
                    insightEl.textContent = "2025년 밋앤핵 결과: 앱 중심의 복잡한 지도 안내는 고령층 대피를 더욱 지연시킵니다. 무더위 쉼터 개방 여부가 동기화되지 않는다면 고령자는 뙤약볕 속에서 헛걸음하다 열사병에 노출됩니다.";
                }
            }
        }
    },

    // Restart game
    restart() {
        this.state.visitedNodes = [];
        this.changeScreen('screen-title');
    },

    // Exit simulation (post message to parent window or redirect)
    exitSimulation() {
        this.stopTimer();
        this.state.visitedNodes = [];
        // Check if embedded in iframe
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ action: 'closeSimulation' }, '*');
        } else {
            // Standalone fallback redirect
            window.location.href = '2026-shelter-data.html';
        }
    }
};

// Start the game on page load
window.onload = () => {
    game.init();
};
