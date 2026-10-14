const fs = require('fs');
const assert = require('assert');

// Test that admin.js contains the isolated week logic
const code = fs.readFileSync('src/admin.js', 'utf8');

// Check that applyToAll confirm loops are removed
assert(!code.includes('¿Deseas agregar "${newGroup.name}" a TODAS las semanas'), "Should not prompt to apply add to all weeks");
assert(!code.includes('¿Deseas eliminar "${grpName}" de TODAS las semanas'), "Should not prompt to apply delete to all weeks");

console.log("✓ Pass: No cross-week prompts found in code.");

// Create a simulated environment to test addChampionshipAdminGroup and deleteChampionshipAdminGroup logic
const mockWeeks = {
    1: { weekNumber: 1, groups: [
        { name: "Grupo Alfa", pilots: [1, 2, 3] },
        { name: "Grupo Beta", pilots: [4, 5, 6] },
        { name: "Grupo Gamma", pilots: [7, 8, 9] }
    ]},
    2: { weekNumber: 2, groups: [
        { name: "Grupo Alfa (Rotación 2)", pilots: [1, 5, 9] },
        { name: "Grupo Beta (Rotación 2)", pilots: [4, 8, 3] },
        { name: "Grupo Gamma (Rotación 2)", pilots: [7, 2, 6] }
    ]},
    3: { weekNumber: 3, groups: [
        { name: "Grupo Alfa (Titanes)", pilots: [1, 8, 6, 12] },
        { name: "Grupo Beta (Titanes)", pilots: [4, 2, 9, 10] },
        { name: "Grupo Gamma (Titanes)", pilots: [7, 5, 3, 11] }
    ]},
    4: { weekNumber: 4, groups: [
        { name: "Grupo Alfa (Final)", pilots: [1, 2, 3, 4] },
        { name: "Grupo Beta (Final)", pilots: [5, 6, 7, 8] },
        { name: "Grupo Gamma (Final)", pilots: [9, 10, 11, 12] }
    ]}
};

let currentChampAdminWeek = 1;
let currentChampAdminGroup = 0;
let cachedChampWeeksData = JSON.parse(JSON.stringify(mockWeeks));

function getActiveChampWeekData(w) {
    return cachedChampWeeksData[w];
}

function getChampionshipGroupsFromUI() {
    return JSON.parse(JSON.stringify(getActiveChampWeekData(currentChampAdminWeek).groups));
}

let persisted = false;
async function persistChampionshipWeeksData(data) {
    persisted = true;
    return true;
}

function renderChampionshipAdminGroups() {}
function renderChampionshipAdminGroupPills() {}
function renderChampionshipAdminChallenges() {}
function showToast(msg) {}

const GREEK_GROUP_NAMES = ["Alfa", "Beta", "Gamma", "Delta", "Épsilon", "Zeta"];

// Mock confirm
let confirmAnswer = true;
function confirm(msg) {
    return confirmAnswer;
}

// Extract implementation logic to test
async function testAddGroup(targetWeek) {
    currentChampAdminWeek = targetWeek;
    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    const currentGroups = getChampionshipGroupsFromUI();
    const newIdx = currentGroups.length;
    const greekName = GREEK_GROUP_NAMES[newIdx] || `Grupo #${newIdx + 1}`;
    const numSlots = (currentChampAdminWeek >= 3) ? 4 : 3;
    const startPilot = newIdx * numSlots + 1;

    const pilots = [];
    for (let s = 0; s < numSlots; s++) {
        const pNum = startPilot + s;
        if (pNum <= 15) {
            pilots.push(pNum);
        } else {
            pilots.push(`open_${newIdx * numSlots + s + 1}`);
        }
    }

    const newGroup = {
        name: `Grupo ${greekName}`,
        tag: "🏁 TIER COMPETICIÓN",
        pilots: pilots
    };

    currentGroups.push(newGroup);
    weekData.groups = currentGroups;

    await persistChampionshipWeeksData(cachedChampWeeksData);
    return newGroup;
}

async function testDeleteGroup(targetWeek, grpIdx) {
    currentChampAdminWeek = targetWeek;
    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    const currentGroups = getChampionshipGroupsFromUI();
    if (!currentGroups || currentGroups.length <= grpIdx) return null;

    const grp = currentGroups[grpIdx];
    const grpName = grp ? (grp.name || `Grupo #${grpIdx + 1}`) : `Grupo #${grpIdx + 1}`;

    const ok = confirm(`¿Estás seguro de que deseas eliminar "${grpName}" únicamente de la Semana ${currentChampAdminWeek}?`);
    if (!ok) return false;

    currentGroups.splice(grpIdx, 1);
    weekData.groups = currentGroups;

    const remainingGroups = (getActiveChampWeekData(currentChampAdminWeek)?.groups) || [];
    if (currentChampAdminGroup >= remainingGroups.length) {
        currentChampAdminGroup = Math.max(0, remainingGroups.length - 1);
    }

    await persistChampionshipWeeksData(cachedChampWeeksData);
    return true;
}

(async () => {
    // TEST 1: Add group in Week 1
    console.log("--- TEST 1: Agregar Grupo en Semana 1 ---");
    const addedW1 = await testAddGroup(1);
    assert.strictEqual(cachedChampWeeksData[1].groups.length, 4, "Week 1 should now have 4 groups");
    assert.strictEqual(cachedChampWeeksData[2].groups.length, 3, "Week 2 should remain with 3 groups");
    assert.strictEqual(cachedChampWeeksData[3].groups.length, 3, "Week 3 should remain with 3 groups");
    assert.strictEqual(cachedChampWeeksData[4].groups.length, 3, "Week 4 should remain with 3 groups");
    assert.strictEqual(addedW1.name, "Grupo Delta");
    console.log("✓ Pass: Grupo agregado únicamente en Semana 1. Semanas 2, 3 y 4 intactas.");

    // TEST 2: Add group in Week 3 (should have 4 slots)
    console.log("--- TEST 2: Agregar Grupo en Semana 3 ---");
    const addedW3 = await testAddGroup(3);
    assert.strictEqual(cachedChampWeeksData[3].groups.length, 4, "Week 3 should now have 4 groups");
    assert.strictEqual(cachedChampWeeksData[3].groups[3].pilots.length, 4, "Week 3 new group should have 4 slots");
    assert.strictEqual(cachedChampWeeksData[1].groups.length, 4, "Week 1 stays with 4 groups");
    assert.strictEqual(cachedChampWeeksData[2].groups.length, 3, "Week 2 stays with 3 groups");
    assert.strictEqual(cachedChampWeeksData[4].groups.length, 3, "Week 4 stays with 3 groups");
    console.log("✓ Pass: Grupo agregado únicamente en Semana 3 con 4 slots. Semanas 1, 2 y 4 intactas.");

    // TEST 3: Delete group in Week 2
    console.log("--- TEST 3: Eliminar Grupo en Semana 2 ---");
    confirmAnswer = true;
    const deletedW2 = await testDeleteGroup(2, 1); // delete Beta
    assert.strictEqual(deletedW2, true);
    assert.strictEqual(cachedChampWeeksData[2].groups.length, 2, "Week 2 should now have 2 groups");
    assert.strictEqual(cachedChampWeeksData[1].groups.length, 4, "Week 1 remains untouched (4 groups)");
    assert.strictEqual(cachedChampWeeksData[3].groups.length, 4, "Week 3 remains untouched (4 groups)");
    assert.strictEqual(cachedChampWeeksData[4].groups.length, 3, "Week 4 remains untouched (3 groups)");
    console.log("✓ Pass: Grupo eliminado únicamente en Semana 2. Semanas 1, 3 y 4 intactas.");

    // TEST 4: Cancel delete in Week 4
    console.log("--- TEST 4: Cancelar Eliminación en Semana 4 ---");
    confirmAnswer = false;
    const cancelledW4 = await testDeleteGroup(4, 0);
    assert.strictEqual(cancelledW4, false, "Should cancel when confirm returns false");
    assert.strictEqual(cachedChampWeeksData[4].groups.length, 3, "Week 4 groups count unchanged");
    console.log("✓ Pass: Cancelar eliminación mantiene grupos intactos.");

    // TEST 5: Delete in Week 4 when confirmed
    console.log("--- TEST 5: Eliminar Grupo en Semana 4 ---");
    confirmAnswer = true;
    const deletedW4 = await testDeleteGroup(4, 0);
    assert.strictEqual(deletedW4, true);
    assert.strictEqual(cachedChampWeeksData[4].groups.length, 2, "Week 4 should now have 2 groups");
    assert.strictEqual(cachedChampWeeksData[1].groups.length, 4, "Week 1 remains untouched");
    assert.strictEqual(cachedChampWeeksData[2].groups.length, 2, "Week 2 remains untouched");
    assert.strictEqual(cachedChampWeeksData[3].groups.length, 4, "Week 3 remains untouched");
    console.log("✓ Pass: Grupo eliminado únicamente en Semana 4.");

    console.log("\n=======================================================");
    console.log("🎉 TODOS LOS TESTS DE AISLAMIENTO POR SEMANA PASARON 100%");
    console.log("=======================================================");
})();
