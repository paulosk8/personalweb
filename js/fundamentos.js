/**
 * Fundamentos de Programación - Core Logic
 * Handles Gamification, Feedback, and Activity interaction
 */

document.addEventListener('DOMContentLoaded', () => {
    initGamification();
    initFeedbackSystem();
    initActivities();
});

// --- State Management ---
const state = {
    completedActivities: new Set(),
    totalActivities: 10,
    badges: {
        logic: { id: 'badge-logic', count: 4, current: 0 },
        data: { id: 'badge-data', count: 3, current: 0 },
        systems: { id: 'badge-systems', count: 3, current: 0 }
    }
};

// --- Gamification Engine ---
function initGamification() {
    updateProgress();
}

function completeActivity(activityId, blockKey) {
    if (state.completedActivities.has(activityId)) return;

    state.completedActivities.add(activityId);
    state.badges[blockKey].current++;

    // Update global progress
    updateProgress();

    // Check for badge unlock
    if (state.badges[blockKey].current === state.badges[blockKey].count) {
        unlockBadge(state.badges[blockKey].id);
    }

    showToast('¡Actividad completada!', 'success');
}

function updateProgress() {
    const percentage = Math.round((state.completedActivities.size / state.totalActivities) * 100);
    const bar = document.getElementById('global-progress-bar');
    const text = document.getElementById('global-percentage');

    if (bar) bar.style.width = `${percentage}%`;
    if (text) text.innerText = `${percentage}%`;
}

function unlockBadge(badgeId) {
    const badge = document.getElementById(badgeId);
    if (badge) {
        badge.classList.remove('locked');
        badge.classList.add('unlocked');
        showToast(`🏆 ¡Has ganado la medalla de ${badge.title}!`, 'success');
    }
}

// --- Feedback System (Toasts) ---
let feedbackSystem = null;

function initFeedbackSystem() {
    const container = document.getElementById('toast-container');
    feedbackSystem = {
        show: (message, type = 'info') => {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            let icon = 'ℹ️';
            if (type === 'success') icon = '✅';
            if (type === 'error') icon = '❌';
            if (type === 'warning') icon = '💡'; // Pedagogy tip

            toast.innerHTML = `<span>${icon}</span><p>${message}</p>`;
            container.appendChild(toast);

            setTimeout(() => {
                toast.style.transform = 'translateX(100%)';
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 5000);
        }
    };
}

function showToast(message, type) {
    if (feedbackSystem) feedbackSystem.show(message, type);
}

// --- Activity Initialization ---
function initActivities() {
    initLifecycle();
    initRecursion();
    initSorting();
    initNested();
    initMatrices();
    initStrings();
    initTDA();
    initCompilation();
    initScope();
    initFiles();
    initSearch();
    console.log('Fundamentals engine initialized');
}

// --- Search Engine ---
function initSearch() {
    const searchInput = document.getElementById('activity-search');
    const cards = document.querySelectorAll('.activity-card');
    const modules = document.querySelectorAll('.module-block');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        cards.forEach(card => {
            const h3 = card.querySelector('h3');
            const analogy = card.querySelector('.analogy p');
            const technical = card.querySelector('.technical p');
            
            const titleText = h3 ? h3.innerText.toLowerCase() : "";
            const analogyText = analogy ? analogy.innerText.toLowerCase() : "";
            const techText = technical ? technical.innerText.toLowerCase() : "";
            
            const isMatch = titleText.includes(query) || 
                            analogyText.includes(query) || 
                            techText.includes(query);
            
            card.style.display = isMatch ? 'flex' : 'none';
        });

        // Hide modules if all their cards are hidden
        modules.forEach(module => {
            const moduleCards = module.querySelectorAll('.activity-card');
            const hasVisibleCard = Array.from(moduleCards).some(c => c.style.display !== 'none');
            module.style.display = hasVisibleCard || query === "" ? 'block' : 'none';
        });
    });
}

// --- Block 1: Logic & Algorithms ---

// 1.1 Lifecycle Drag & Drop
function initLifecycle() {
    const area = document.getElementById('lifecycle-area');
    const phases = [
        { id: 'p1', text: 'Análisis', order: 1 },
        { id: 'p2', text: 'Diseño', order: 2 },
        { id: 'p3', text: 'Codificación', order: 3 },
        { id: 'p4', text: 'Pruebas', order: 4 },
        { id: 'p5', text: 'Mantenimiento', order: 5 }
    ];

    // Shuffle phases
    const shuffled = [...phases].sort(() => Math.random() - 0.5);

    area.innerHTML = `
        <div class="drag-container" id="lifecycle-container">
            ${shuffled.map(p => `<div class="drag-item" draggable="true" data-id="${p.id}">${p.text}</div>`).join('')}
        </div>
        <button class="btn-verify" id="verify-lifecycle">Verificar Orden</button>
    `;

    const container = area.querySelector('#lifecycle-container');
    let draggedItem = null;

    container.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        e.target.classList.add('dragging');
    });

    container.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(draggedItem);
        } else {
            container.insertBefore(draggedItem, afterElement);
        }
    });

    document.getElementById('verify-lifecycle').addEventListener('click', () => {
        const items = [...container.querySelectorAll('.drag-item')];
        const currentOrder = items.map(item => phases.find(p => p.id === item.dataset.id));
        
        // Critical pedagogical feedback check
        const codingIdx = currentOrder.findIndex(p => p.text === 'Codificación');
        const analysisIdx = currentOrder.findIndex(p => p.text === 'Análisis');
        
        if (codingIdx < analysisIdx) {
            showToast("¡Cuidado! Si programas antes de analizar, perderás tiempo corrigiendo lógica básica.", "warning");
            return;
        }

        const isCorrect = currentOrder.every((p, i) => p.order === i + 1);

        if (isCorrect) {
            completeActivity('lifecycle', 'logic');
            items.forEach(item => item.classList.add('correct'));
            document.getElementById('verify-lifecycle').disabled = true;
        } else {
            showToast("El orden no es del todo lógico. Piensa en el flujo natural del desarrollo.", "error");
        }
    });
}

// 1.2 Recursion Simulator
function initRecursion() {
    const area = document.getElementById('recursion-area');
    area.innerHTML = `
        <div class="stack-controls">
            <label class="switch">
                <input type="checkbox" id="base-case-switch">
                <span class="slider"></span>
                Caso Base (Activar)
            </label>
            <button class="btn-verify" id="add-call">Añadir Llamada ()</button>
        </div>
        <div class="stack-visual" id="call-stack"></div>
    `;

    const stack = document.getElementById('call-stack');
    const baseCaseSwitch = document.getElementById('base-case-switch');
    let calls = 0;
    let result = 1;
    const maxCalls = 5;

    document.getElementById('add-call').addEventListener('click', () => {
        if (baseCaseSwitch.checked) {
            showToast("¡Caso base alcanzado! Retornando resultados...", "success");
            
            // Unwinding animation with result calculation
            const blocks = [...stack.querySelectorAll('.stack-block')].reverse();
            let currentVal = 1;

            blocks.forEach((block, i) => {
                setTimeout(() => {
                    block.classList.add('returning');
                    currentVal *= (i + 1);
                    block.innerHTML = `<span>Retornando: ${currentVal}</span>`;
                    
                    setTimeout(() => {
                        block.remove();
                        if (i === blocks.length - 1) {
                            showToast(`Cálculo final: ${currentVal}`, "success");
                            completeActivity('recursion', 'logic');
                        }
                    }, 500);
                }, i * 400);
            });

            document.getElementById('add-call').disabled = true;
            return;
        }

        if (calls < maxCalls) {
            calls++;
            const callBlock = document.createElement('div');
            callBlock.className = 'stack-block winding';
            callBlock.innerHTML = `<span>${calls}! = ${calls} * (${calls - 1}!)</span>`;
            stack.prepend(callBlock);
            
            if (calls === maxCalls) {
                stack.classList.add('overflow');
                showToast("¡Stack Overflow! No hay caso base.", "error");
                setTimeout(() => {
                    stack.innerHTML = '';
                    calls = 0;
                    stack.classList.remove('overflow');
                }, 2000);
            }
        }
    });
}

// 1.3 Bubble Sort Game
function initSorting() {
    const area = document.getElementById('sorting-area');
    let numbers = [42, 15, 8, 23];
    
    function renderSort() {
        area.innerHTML = `
            <div class="sorting-container">
                ${numbers.map((n, i) => `
                    <div class="sort-block" data-index="${i}">
                        <span class="sort-value">${n}</span>
                        <div class="sort-actions">
                            ${i < numbers.length - 1 ? `<button onclick="swap(${i}, ${i+1})">↔</button>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    window.swap = (i, j) => {
        // Pedagogy: Bubble sort only swaps adjacent
        if (Math.abs(i - j) > 1) {
            showToast("Recuerda que Burbuja solo compara vecinos directos.", "warning");
            return;
        }

        const blocks = area.querySelectorAll('.sort-block');
        blocks[i].style.transform = `translateX(40px)`;
        blocks[j].style.transform = `translateX(-40px)`;

        setTimeout(() => {
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
            renderSort();

            const isSorted = numbers.every((n, idx) => idx === 0 || n >= numbers[idx - 1]);
            if (isSorted) {
                completeActivity('sorting', 'logic');
                const newBlocks = area.querySelectorAll('.sort-block');
                newBlocks.forEach(b => b.classList.add('correct', 'neon-glow'));
            }
        }, 300);
    };

    renderSort();
}

// 1.4 Nested Structures - Drag & Drop Edition
function initNested() {
    const zones = document.querySelectorAll('.drop-zone');
    const brackets = document.querySelectorAll('.drag-bracket');
    const innerScope = document.getElementById('scope-inner');
    const outerScope = document.getElementById('scope-outer');
    
    let draggedId = null;

    brackets.forEach(bracket => {
        bracket.addEventListener('dragstart', (e) => {
            draggedId = bracket.dataset.id;
            bracket.classList.add('dragging');
        });
        bracket.addEventListener('dragend', () => bracket.classList.remove('dragging'));
    });

    zones.forEach(zone => {
        zone.addEventListener('dragover', (e) => e.preventDefault());
        zone.addEventListener('dragenter', () => zone.classList.add('drag-over'));
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        
        zone.addEventListener('drop', (e) => {
            zone.classList.remove('drag-over');
            const bracket = [...brackets].find(b => b.dataset.id === draggedId);
            
            // Move bracket to zone
            zone.innerHTML = bracket.innerText;
            zone.dataset.current = draggedId;
            zone.classList.add('filled');
            bracket.style.display = 'none'; // Hide from drawer

            updateHighlights();
        });
    });

    const updateHighlights = () => {
        const innerZone = document.getElementById('zone-inner');
        const outerZone = document.getElementById('zone-outer');

        innerScope.classList.remove('highlight-valid', 'highlight-invalid');
        outerScope.classList.remove('highlight-valid', 'highlight-invalid');

        if (innerZone.dataset.current === 'inner') innerScope.classList.add('highlight-valid');
        else if (innerZone.dataset.current) innerScope.classList.add('highlight-invalid');

        if (outerZone.dataset.current === 'outer') outerScope.classList.add('highlight-valid');
        else if (outerZone.dataset.current) outerScope.classList.add('highlight-invalid');
    };

    document.getElementById('verify-nested').addEventListener('click', () => {
        const innerVal = document.getElementById('zone-inner').dataset.current;
        const outerVal = document.getElementById('zone-outer').dataset.current;

        if (innerVal === 'inner' && outerVal === 'outer') {
            completeActivity('nested', 'logic');
            showToast("¡Perfecto! Has cerrado los ámbitos en el orden correcto.", "success");
            document.getElementById('verify-nested').disabled = true;
        } else if (!innerVal || !outerVal) {
            showToast("Primero debes arrastrar todos los cierres `}`.", "info");
        } else {
            showToast("Revisa el orden: recuerda que cerramos de adentro hacia afuera.", "warning");
        }
    });
}

// --- Block 2: Data Structures ---

// 2.1 Matrices (Parking Lot Simulator) - Re-imagined
function initMatrices() {
    const area = document.getElementById('matrices-area');
    const size = 3;
    const target = { r: Math.floor(Math.random() * size), c: Math.floor(Math.random() * size) };
    
    area.innerHTML = `
        <div class="matrix-app">
            <div class="matrix-mission">
                <span class="mission-label">MISIÓN:</span>
                <span class="mission-target">Estacionar en [Fila <span class="hl">${target.r}</span>][Columna <span class="hl">${target.c}</span>]</span>
            </div>
            <div class="matrix-wrapper">
                <div class="col-indices">
                    <div></div><div>0</div><div>1</div><div>2</div>
                </div>
                <div class="matrix-body">
                    <div class="row-indices">
                        <div>0</div><div>1</div><div>2</div>
                    </div>
                    <div class="matrix-grid" id="matrix-grid">
                        ${Array(size).fill().map((_, r) => `
                            ${Array(size).fill().map((_, c) => `
                                <div class="matrix-cell" 
                                     onmouseover="highlightAxes(${r}, ${c})" 
                                     onclick="checkMatrix(${r}, ${c}, ${target.r}, ${target.c})">
                                    <span class="car-icon">🚗</span>
                                </div>
                            `).join('')}
                        `).join('')}
                    </div>
                </div>
            </div>
            <p class="matrix-status" id="matrix-status">Selecciona un espacio en el estacionamiento.</p>
        </div>
    `;

    window.highlightAxes = (r, c) => {
        const rows = document.querySelectorAll('.row-indices div');
        const cols = document.querySelectorAll('.col-indices div');
        
        rows.forEach((el, i) => {
            if (i === r) el.classList.add('row-idx-active');
            else el.classList.remove('row-idx-active');
        });
        
        cols.forEach((el, i) => {
            if (i === c + 1) el.classList.add('col-idx-active');
            else el.classList.remove('col-idx-active');
        });
    };

    window.checkMatrix = (r, c, tr, tc) => {
        const status = document.getElementById('matrix-status');
        const cells = document.querySelectorAll('.matrix-cell');
        const cell = cells[r * size + c];

        if (r === tr && c === tc) {
            cell.classList.add('correct');
            status.innerHTML = `<span class="text-success">✅ [OK] Localizado en [${r}][${c}]</span>`;
            completeActivity('matrices', 'data');
        } else {
            cell.classList.add('wrong');
            status.innerHTML = `<span class="text-error">❌ [FAIL] Esto es [${r}][${c}]</span>`;
            setTimeout(() => {
                cell.classList.remove('wrong');
                status.innerText = "Sigue intentándolo...";
            }, 1000);
        }
    };
}

// 2.2 Strings (Concatenation)
function initStrings() {
    const area = document.getElementById('strings-area');
    area.innerHTML = `
        <div class="string-game">
            <div class="wagon-inputs">
                <input type="text" id="str1" value="Hola" readonly>
                <span>+</span>
                <input type="text" id="str-space" placeholder="' '">
                <span>+</span>
                <input type="text" id="str2" value="Mundo" readonly>
            </div>
            <button class="btn-verify" id="verify-strings">Concatenar</button>
            <div class="string-result" id="string-result">?</div>
        </div>
    `;

    document.getElementById('verify-strings').addEventListener('click', () => {
        const space = document.getElementById('str-space').value;
        const result = "Hola" + space + "Mundo";
        document.getElementById('string-result').innerText = result;

        if (space === ' ' || space === '  ') {
            completeActivity('strings', 'data');
            document.getElementById('verify-strings').disabled = true;
        } else if (space === '') {
            showToast("¡Están muy pegadas! ¿Olvidaste concatenar un espacio ' '?", "warning");
        }
    });
}

// 2.3 TDA (Abstraction) - Re-imagined
function initTDA() {
    // Buttons are already in HTML with onclick="opTDA"
    const screen = document.getElementById('tda-screen');
    const gears = document.getElementById('tda-gears');
    
    window.opTDA = (op) => {
        // 1. Interface Reaction
        screen.innerText = "Processing...";
        screen.classList.add('processing');
        
        // 2. Hidden Implementation Animation
        gears.classList.add('active');
        
        setTimeout(() => {
            // 3. Result Delivery
            gears.classList.remove('active');
            screen.classList.remove('processing');
            
            if (op === 'Power') {
                const isOn = screen.classList.toggle('on');
                screen.innerText = isOn ? "ON" : "OFF";
                if (isOn) completeActivity('tda', 'data');
            } else if (op === 'Mode') {
                screen.innerText = "MODE: " + (Math.random() > 0.5 ? "HEX" : "BIN");
                completeActivity('tda', 'data');
            } else {
                screen.innerText = "EXECUTING...";
                completeActivity('tda', 'data');
            }
        }, 800);
    };
}

// --- Block 3: Systems & Environment ---

// 3.1 Compiler vs Interpreter
function initCompilation() {
    const area = document.getElementById('compilation-area');
    area.innerHTML = `
        <div class="compilation-flow">
            <div class="flow-step" id="source-code">📄 Código Fuente</div>
            <div class="flow-arrow">➡</div>
            <button class="btn-verify" id="btn-compile">Compilar ⚙️</button>
            <div class="flow-arrow">➡</div>
            <div class="flow-step disabled" id="machine-code">🤖 Código Máquina</div>
            <button class="btn-verify" id="btn-execute" style="margin-top: 1rem;">Ejecutar ▶</button>
        </div>
    `;

    let compiled = false;
    document.getElementById('btn-compile').addEventListener('click', (e) => {
        const btn = e.target;
        btn.innerText = "Compilando...";
        btn.classList.add('neon-glow');
        
        setTimeout(() => {
            compiled = true;
            btn.innerText = "Compilar ⚙️";
            btn.classList.remove('neon-glow');
            document.getElementById('machine-code').classList.remove('disabled');
            document.getElementById('machine-code').classList.add('correct', 'neon-glow');
            showToast("¡Compilación exitosa! Código fuente traducido a binario.", "success");
        }, 1500);
    });

    document.getElementById('btn-execute').addEventListener('click', () => {
        if (!compiled) {
            showToast("El procesador no habla humano, necesita el Código Máquina primero.", "error");
        } else {
            showToast("Programa ejecutado con éxito.", "success");
            completeActivity('compilation', 'systems');
        }
    });
}

// 3.2 Scope (Ámbito)
function initScope() {
    const area = document.getElementById('scope-area');
    area.innerHTML = `
        <div class="scope-grid">
            <div class="scope-box" id="global-scope">
                <h4>Global</h4>
                <div class="variable draggable" id="var-x" draggable="true">var x</div>
            </div>
            <div class="scope-box" id="local-scope">
                <h4>Función A</h4>
            </div>
        </div>
        <p class="scope-status" id="scope-msg">Mueve la variable para descubrir su alcance.</p>
    `;

    const varX = document.getElementById('var-x');
    const localBox = document.getElementById('local-scope');
    const globalBox = document.getElementById('global-scope');

    [localBox, globalBox].forEach(box => {
        box.addEventListener('dragover', e => e.preventDefault());
        box.addEventListener('drop', e => {
            box.appendChild(varX);
            if (box.id === 'local-scope') {
                showToast("Ahora x es local. ¡Cuidado si intentas usarla fuera!", "warning");
                completeActivity('scope', 'systems');
            }
        });
    });
}

// 3.3 Files (Digital Decipherer) - Re-imagined
function initFiles() {
    const input = document.getElementById('file-input');
    const content = document.getElementById('file-content');

    input.addEventListener('input', () => {
        const text = input.value;
        if (text.length === 0) {
            content.innerHTML = '<span class="mute">Esperando entrada...</span>';
            return;
        }

        const binary = text.split('').map(char => {
            const bits = char.charCodeAt(0).toString(2).padStart(8, '0');
            return `<span class="bit-chunk">${bits}</span>`;
        }).join(' ');

        content.innerHTML = binary;
        content.classList.add('scanning');
        
        if (text.length > 5) completeActivity('files', 'systems');

        setTimeout(() => content.classList.remove('scanning'), 500);
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.drag-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// --- API for activities ---
window.EduGame = {
    complete: completeActivity,
    feedback: showToast
};
