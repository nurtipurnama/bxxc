// Sports Match Analyzer Pro - Enhanced Edition
// Sophisticated analysis tool with Monte Carlo simulations and detailed insights

// Core data structure
const matchData = {
    h2h: [], // Head-to-head matches between the two teams
    team1: [], // Team 1's matches against other teams
    team2: [] // Team 2's matches against other teams
};

// Team info
let team1Name = 'Team 1';
let team2Name = 'Team 2';
let team1Ranking = 0;
let team2Ranking = 0;
let matchImportance = 1;
let matchLocation = 'neutral';
let team1Formation = 'default';
let team2Formation = 'default';
let sportType = 'football'; // Default to football/soccer

// Betting lines
let totalLine = 0;  // For over/under bets
let pointSpread = 0; // For handicap bets
let spreadDirection = 'team1'; // Which team is favored in the spread

// Enhanced simulation features
const ENHANCED_MODE = true;
const ENHANCED_FEATURES = {
    MONTE_CARLO_SIMULATIONS: true,
    FORMATION_ANALYSIS: true,
    ADVANCED_METRICS: true,
    DYNAMIC_PROJECTIONS: true
};

// Historical edge tracking
let historicalEdge = {
    overUnder: {
        sampleSize: 0,
        accuracy: 0
    },
    handicap: {
        sampleSize: 0,
        accuracy: 0
    }
};

// Charts
let winProbabilityChart = null;
let modelConfidenceChart = null;
let scoreProbabilityChart = null;
let performanceTrendChart = null;
let scoringDistributionChart = null;

// Analysis results tracking
let lastAnalysisResults = null;
let featureImportanceScores = {};
let simulationResults = null;

// Constants for data analysis
const MIN_MATCHES_FOR_GOOD_ANALYSIS = 3;
const MIN_MATCHES_FOR_EXCELLENT_ANALYSIS = 6;
const MIN_H2H_MATCHES = 2;
const DEFAULT_SIMULATION_COUNT = 10000;

// Constants for weighting factors - Enhanced for accuracy
const WEIGHTS = {
    RECENT_FORM: 3.5,
    H2H_MATCHES: 3.0,
    OVERALL_PERFORMANCE: 2.2,
    HOME_ADVANTAGE: 2.0,
    AWAY_DISADVANTAGE: 1.5,
    RANKING: 1.2,
    MATCH_IMPORTANCE: 2.2,
    SCORING_TREND: 1.8,
    DEFENSIVE_TREND: 1.8,
    MOMENTUM: 2.8,
    CONSISTENCY: 1.5,
    // Enhanced weights
    FORMATION_COMPATIBILITY: 1.8,
    TACTICAL_ADVANTAGE: 1.6,
    PSYCHOLOGICAL_EDGE: 1.3,
    VENUE_FAMILIARITY: 1.4,
    FATIGUE_FACTOR: 1.2
};

// Enhanced betting knowledge base
const BETTING_KNOWLEDGE_BASE = {
    overUnder: {
        understanding: "For over/under bets, the line (e.g. 2.5) means total goals/points must exceed this number for 'over' to win. For over 1.5, need at least 2 goals. For over 2.5, need at least 3 goals.",
        strategy: "Look for teams with consistent scoring patterns and strong attacks facing weaker defenses."
    },
    handicap: {
        understanding: "A +0.5 handicap means that team needs only a draw to win the bet. A -0.5 handicap means that team must win outright.",
        strategy: "For favorable handicaps, identify teams that rarely lose by large margins even against superior opponents."
    },
    margins: {
        thresholds: {
            strong: 8.0,
            moderate: 5.0,
            weak: 3.0
        }
    }
};

// Sport-specific formations and their characteristics
const FORMATIONS = {
    football: {
        "4-3-3": {
            attacking: 0.8,
            defending: 0.6,
            possession: 0.7,
            counterAttack: 0.5,
            description: "Balanced attacking formation with three forwards",
            strongAgainst: ["5-3-2", "4-4-2"],
            weakAgainst: ["4-2-3-1", "3-5-2"]
        },
        "4-4-2": {
            attacking: 0.7,
            defending: 0.7,
            possession: 0.6,
            counterAttack: 0.6,
            description: "Classic balanced formation with two strikers",
            strongAgainst: ["3-4-3", "3-5-2"],
            weakAgainst: ["4-3-3", "4-2-3-1"]
        },
        "4-2-3-1": {
            attacking: 0.7,
            defending: 0.8,
            possession: 0.8,
            counterAttack: 0.5,
            description: "Solid defensive formation with creative attacking midfield",
            strongAgainst: ["4-3-3", "4-4-2"],
            weakAgainst: ["3-5-2", "5-3-2"]
        },
        "3-5-2": {
            attacking: 0.7,
            defending: 0.6,
            possession: 0.7,
            counterAttack: 0.7,
            description: "Wing-back focused formation with two strikers",
            strongAgainst: ["4-2-3-1", "4-3-3"],
            weakAgainst: ["4-4-2", "4-3-3 (wide)"]
        },
        "5-3-2": {
            attacking: 0.5,
            defending: 0.9,
            possession: 0.5,
            counterAttack: 0.8,
            description: "Defensive formation focusing on counter-attacks",
            strongAgainst: ["4-3-3", "4-2-3-1"],
            weakAgainst: ["3-5-2", "4-4-2"]
        },
        "3-4-3": {
            attacking: 0.9,
            defending: 0.5,
            possession: 0.7,
            counterAttack: 0.6,
            description: "Very attacking formation with three forwards",
            strongAgainst: ["5-3-2", "4-2-3-1"],
            weakAgainst: ["4-4-2", "4-3-3"]
        }
    },
    basketball: {
        "1-3-1": {
            attacking: 0.6,
            defending: 0.8,
            perimeter: 0.7,
            insidePlay: 0.5,
            description: "Zone defense focusing on perimeter pressure",
            strongAgainst: ["Princeton", "Motion"],
            weakAgainst: ["Triangle", "Pick and Roll"]
        },
        "Triangle": {
            attacking: 0.8,
            defending: 0.6,
            perimeter: 0.7,
            insidePlay: 0.8,
            description: "Ball movement focused offense with post play",
            strongAgainst: ["1-3-1", "2-3"],
            weakAgainst: ["Man-to-Man", "Full Court Press"]
        },
        "Motion": {
            attacking: 0.8,
            defending: 0.6,
            perimeter: 0.8,
            insidePlay: 0.6,
            description: "Continuous movement offense with screens",
            strongAgainst: ["2-3", "3-2"],
            weakAgainst: ["1-3-1", "Man-to-Man"]
        },
        "Princeton": {
            attacking: 0.7,
            defending: 0.6,
            perimeter: 0.8,
            insidePlay: 0.6,
            description: "Patient offense with backdoor cuts",
            strongAgainst: ["Man-to-Man", "Full Court Press"],
            weakAgainst: ["1-3-1", "2-3"]
        },
        "Man-to-Man": {
            attacking: 0.6,
            defending: 0.8,
            perimeter: 0.7,
            insidePlay: 0.7,
            description: "Traditional defense matching players individually",
            strongAgainst: ["Motion", "Princeton"],
            weakAgainst: ["Pick and Roll", "Triangle"]
        },
        "2-3": {
            attacking: 0.5,
            defending: 0.9,
            perimeter: 0.5,
            insidePlay: 0.9,
            description: "Zone defense protecting the paint",
            strongAgainst: ["Princeton", "Pick and Roll"],
            weakAgainst: ["Motion", "Triangle"]
        }
    },
    default: {
        "default": {
            attacking: 0.7,
            defending: 0.7,
            description: "Standard balanced approach"
        }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Setup enhanced environment
    setupEnhancedEnvironment();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup sport type change handler
    setupSportTypeChange();
    
    // Update team names in the UI
    updateTeamLabels();
    
    // Update data sufficiency indicators
    updateDataSufficiencyIndicators();
    
    // Show welcome toast
    showToast('Welcome to Sports Match Analyzer Pro', 'info');
});

// Setup enhanced environment and styling
function setupEnhancedEnvironment() {
    if (!ENHANCED_MODE) return;
    
    // Add enhanced badge to header
    const headerElement = document.querySelector('header h1');
    if (headerElement) {
        headerElement.innerHTML = 'Sports Match Analyzer Pro <span class="enhanced-badge">ENHANCED</span>';
    }
    
    // Add enhanced styling class to body
    document.body.classList.add('enhanced-mode');
    
    // Add enhanced features explanation
    const enhancedFeaturesHtml = `
        <div class="enhanced-features-panel">
            <h3><span class="material-symbols-outlined">analytics</span> Enhanced Features Activated</h3>
            <div class="enhanced-features-list">
                <div class="enhanced-feature">
                    <span class="material-symbols-outlined">insights</span>
                    <div>
                        <h4>Monte Carlo Simulation</h4>
                        <p>Runs thousands of match simulations to generate accurate probability distributions</p>
                    </div>
                </div>
                <div class="enhanced-feature">
                    <span class="material-symbols-outlined">schema</span>
                    <div>
                        <h4>Formation Analysis</h4>
                        <p>Analyzes tactical formations and their effectiveness against opponents</p>
                    </div>
                </div>
                <div class="enhanced-feature">
                    <span class="material-symbols-outlined">assessment</span>
                    <div>
                        <h4>Advanced Statistical Modeling</h4>
                        <p>Incorporates deep metrics and context-aware predictions</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insert enhanced features panel after first card
    const firstCard = document.querySelector('.card');
    if (firstCard) {
        const enhancedPanel = document.createElement('div');
        enhancedPanel.className = 'enhanced-panel';
        enhancedPanel.innerHTML = enhancedFeaturesHtml;
        firstCard.parentNode.insertBefore(enhancedPanel, firstCard.nextSibling);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Team setup form
    document.getElementById('team-form').addEventListener('input', handleTeamSetup);
    
    // Add score input listeners
    document.getElementById('h2h-add-btn').addEventListener('click', handleH2HAdd);
    document.getElementById('team1-add-btn').addEventListener('click', handleTeam1Add);
    document.getElementById('team2-add-btn').addEventListener('click', handleTeam2Add);
    
    // Clear data button
    document.getElementById('clear-data-btn').addEventListener('click', clearAllData);
    
    // Add sample data button (for testing)
    const sampleDataBtn = document.createElement('button');
    sampleDataBtn.type = 'button';
    sampleDataBtn.id = 'sample-data-btn';
    sampleDataBtn.className = 'btn btn-outline';
    sampleDataBtn.innerHTML = '<span class="material-symbols-outlined">science</span> Add Sample Data';
    sampleDataBtn.addEventListener('click', addSampleData);
    
    // Append the sample data button to data controls
    const dataControls = document.querySelector('.data-controls');
    if (dataControls) {
        dataControls.appendChild(sampleDataBtn);
    }
    
    // Analyze button
    document.getElementById('analyze-button').addEventListener('click', function() {
        if (!validateInputs()) {
            return;
        }
        
        processAllMatchData();
        
        if (ENHANCED_MODE && ENHANCED_FEATURES.MONTE_CARLO_SIMULATIONS) {
            runEnhancedAnalysis();
        } else {
            performStandardAnalysis();
        }
        
        showResults();
    });
}

// Setup sport type change handler
function setupSportTypeChange() {
    const sportTypeSelect = document.getElementById('sport-type');
    if (sportTypeSelect) {
        sportTypeSelect.addEventListener('change', function() {
            sportType = this.value;
            updateFormationOptions();
        });
        
        // Trigger initially to set correct formations
        updateFormationOptions();
    }
}

// Update formation dropdown options based on selected sport
function updateFormationOptions() {
    const team1FormationSelect = document.getElementById('team1-formation');
    const team2FormationSelect = document.getElementById('team2-formation');
    
    if (!team1FormationSelect || !team2FormationSelect) return;
    
    // Clear previous options
    team1FormationSelect.innerHTML = '';
    team2FormationSelect.innerHTML = '';
    
    // Add default option
    team1FormationSelect.innerHTML += `<option value="default">Select Formation</option>`;
    team2FormationSelect.innerHTML += `<option value="default">Select Formation</option>`;
    
    // Add formation options based on selected sport
    const formations = FORMATIONS[sportType] || FORMATIONS.default;
    
    for (const formation in formations) {
        if (formation === 'default') continue; // Skip default formation
        
        team1FormationSelect.innerHTML += `<option value="${formation}">${formation}</option>`;
        team2FormationSelect.innerHTML += `<option value="${formation}">${formation}</option>`;
    }
}

// Handle team setup changes
function handleTeamSetup() {
    // Get form values
    team1Name = document.getElementById('team1').value || 'Team 1';
    team2Name = document.getElementById('team2').value || 'Team 2';
    team1Ranking = parseInt(document.getElementById('team1-ranking').value) || 0;
    team2Ranking = parseInt(document.getElementById('team2-ranking').value) || 0;
    matchImportance = parseFloat(document.getElementById('match-importance').value) || 1;
    matchLocation = document.getElementById('match-location').value || 'neutral';
    
    // Get formations if available
    const team1FormationEl = document.getElementById('team1-formation');
    const team2FormationEl = document.getElementById('team2-formation');
    
    if (team1FormationEl) team1Formation = team1FormationEl.value;
    if (team2FormationEl) team2Formation = team2FormationEl.value;
    
    // Update UI with team names
    updateTeamLabels();
}

// Update all team name labels throughout the UI
function updateTeamLabels() {
    // Update input labels
    const team1Labels = document.querySelectorAll('.team1-label');
    const team2Labels = document.querySelectorAll('.team2-label');
    
    team1Labels.forEach(label => {
        label.textContent = label.textContent.replace('Team 1', team1Name);
    });
    
    team2Labels.forEach(label => {
        label.textContent = label.textContent.replace('Team 2', team2Name);
    });
    
    // Update spread direction dropdown
    const spreadDirectionEl = document.getElementById('spread-direction');
    if (spreadDirectionEl && spreadDirectionEl.options.length >= 2) {
        spreadDirectionEl.options[0].textContent = team1Name;
        spreadDirectionEl.options[1].textContent = team2Name;
    }
    
    // Update match section headers
    const matchSections = document.querySelectorAll('.match-section h3');
    if (matchSections.length >= 3) {
        matchSections[0].textContent = `Head-to-Head Matches`;
        matchSections[1].textContent = `${team1Name} Recent Matches`;
        matchSections[2].textContent = `${team2Name} Recent Matches`;
    }
}

// Handle Head-to-Head Scores Add
function handleH2HAdd() {
    const team1ScoresText = document.getElementById('h2h-team1').value.trim();
    const team2ScoresText = document.getElementById('h2h-team2').value.trim();
    
    if (!team1ScoresText || !team2ScoresText) {
        showToast('Please enter scores for both teams', 'warning');
        return;
    }
    
    // Parse the score arrays
    const team1Scores = team1ScoresText.split(',').map(score => parseInt(score.trim()));
    const team2Scores = team2ScoresText.split(',').map(score => parseInt(score.trim()));
    
    // Validate scores
    if (!validateScores(team1Scores, team2Scores)) return;
    
    // Clear previous H2H data
    matchData.h2h = [];
    
    // Add each pair of scores as a match
    const minLength = Math.min(team1Scores.length, team2Scores.length);
    let addedCount = 0;
    
    for (let i = 0; i < minLength; i++) {
        // Add increasing timestamps for each match (oldest first)
        const timestamp = Date.now() - ((minLength - i) * 7 * 24 * 60 * 60 * 1000); // 7 days apart
        processMatchScore('h2h', i + 1, team1Scores[i], team2Scores[i], timestamp);
        addedCount++;
    }
    
    // Update UI
    updateMatchSummary('h2h');
    updateDataSufficiencyIndicators();
    
    // Clear input fields
    document.getElementById('h2h-team1').value = '';
    document.getElementById('h2h-team2').value = '';
    
    // Show success message
    showToast(`Added ${addedCount} Head-to-Head matches`, 'success');
}

// Handle Team 1 Scores Add
function handleTeam1Add() {
    const team1ScoresText = document.getElementById('team1-scores').value.trim();
    const opponentScoresText = document.getElementById('team1-opponent').value.trim();
    
    if (!team1ScoresText || !opponentScoresText) {
        showToast('Please enter scores for both teams', 'warning');
        return;
    }
    
    // Parse the score arrays
    const team1Scores = team1ScoresText.split(',').map(score => parseInt(score.trim()));
    const opponentScores = opponentScoresText.split(',').map(score => parseInt(score.trim()));
    
    // Validate scores
    if (!validateScores(team1Scores, opponentScores)) return;
    
    // Clear previous Team 1 data
    matchData.team1 = [];
    
    // Add each pair of scores as a match
    const minLength = Math.min(team1Scores.length, opponentScores.length);
    let addedCount = 0;
    
    for (let i = 0; i < minLength; i++) {
        // Add increasing timestamps for each match (oldest first)
        const timestamp = Date.now() - ((minLength - i) * 7 * 24 * 60 * 60 * 1000); // 7 days apart
        processMatchScore('team1', i + 1, team1Scores[i], opponentScores[i], timestamp);
        addedCount++;
    }
    
    // Update UI
    updateMatchSummary('team1');
    updateDataSufficiencyIndicators();
    
    // Clear input fields
    document.getElementById('team1-scores').value = '';
    document.getElementById('team1-opponent').value = '';
    
    // Show success message
    showToast(`Added ${addedCount} matches for ${team1Name}`, 'success');
}

// Handle Team 2 Scores Add
function handleTeam2Add() {
    const team2ScoresText = document.getElementById('team2-scores').value.trim();
    const opponentScoresText = document.getElementById('team2-opponent').value.trim();
    
    if (!team2ScoresText || !opponentScoresText) {
        showToast('Please enter scores for both teams', 'warning');
        return;
    }
    
    // Parse the score arrays
    const team2Scores = team2ScoresText.split(',').map(score => parseInt(score.trim()));
    const opponentScores = opponentScoresText.split(',').map(score => parseInt(score.trim()));
    
    // Validate scores
    if (!validateScores(team2Scores, opponentScores)) return;
    
    // Clear previous Team 2 data
    matchData.team2 = [];
    
    // Add each pair of scores as a match
    const minLength = Math.min(team2Scores.length, opponentScores.length);
    let addedCount = 0;
    
    for (let i = 0; i < minLength; i++) {
        // Add increasing timestamps for each match (oldest first)
        const timestamp = Date.now() - ((minLength - i) * 7 * 24 * 60 * 60 * 1000); // 7 days apart
        processMatchScore('team2', i + 1, team2Scores[i], opponentScores[i], timestamp);
        addedCount++;
    }
    
    // Update UI
    updateMatchSummary('team2');
    updateDataSufficiencyIndicators();
    
    // Clear input fields
    document.getElementById('team2-scores').value = '';
    document.getElementById('team2-opponent').value = '';
    
    // Show success message
    showToast(`Added ${addedCount} matches for ${team2Name}`, 'success');
}

// Add sample data (for testing)
function addSampleData() {
    // First clear existing data
    clearAllData();
    
    // Set team names and details
    document.getElementById('team1').value = 'Liverpool';
    document.getElementById('team2').value = 'Manchester City';
    document.getElementById('team1-ranking').value = '4';
    document.getElementById('team2-ranking').value = '2';
    
    // Set sport type and formations if available
    if (document.getElementById('sport-type')) {
        document.getElementById('sport-type').value = 'football';
        
        // Trigger sport type change to update formations
        const event = new Event('change');
        document.getElementById('sport-type').dispatchEvent(event);
        
        // Set formations
        if (document.getElementById('team1-formation')) {
            document.getElementById('team1-formation').value = '4-3-3';
        }
        
        if (document.getElementById('team2-formation')) {
            document.getElementById('team2-formation').value = '4-2-3-1';
        }
    }
    
    // Setup match details
    document.getElementById('match-importance').value = '1.5'; // Important match
    document.getElementById('match-location').value = 'home'; // Team 1 at home
    
    handleTeamSetup();
    
    // Add H2H matches
    document.getElementById('h2h-team1').value = '1,2,1,2,0';
    document.getElementById('h2h-team2').value = '1,2,0,1,1';
    handleH2HAdd();
    
    // Add team1 matches
    document.getElementById('team1-scores').value = '2,3,1,0,2,3';
    document.getElementById('team1-opponent').value = '0,1,0,0,1,1';
    handleTeam1Add();
    
    // Add team2 matches
    document.getElementById('team2-scores').value = '3,2,1,3,4,2';
    document.getElementById('team2-opponent').value = '0,0,0,1,1,2';
    handleTeam2Add();
    
    // Set betting lines
    document.getElementById('betting-line').value = '2.5';
    document.getElementById('point-spread').value = '1.0';
    document.getElementById('spread-direction').value = 'team1';
    
    // Show success message
    showToast('Sample data added successfully', 'success');
}

// Validate scores
function validateScores(scores1, scores2) {
    // Check if any values are not numbers
    if (scores1.some(isNaN) || scores2.some(isNaN)) {
        showToast('Please enter valid scores (numbers only)', 'error');
        return false;
    }
    
    // Check if any values are negative
    if (scores1.some(score => score < 0) || scores2.some(score => score < 0)) {
        showToast('Scores must be non-negative', 'error');
        return false;
    }
    
    // Check if arrays have at least one value
    if (scores1.length === 0 || scores2.length === 0) {
        showToast('Please enter at least one score for each team', 'warning');
        return false;
    }
    
    // Check if arrays have the same length
    if (scores1.length !== scores2.length) {
        showToast(`Unequal arrays. Will use the first ${Math.min(scores1.length, scores2.length)} scores from each.`, 'warning');
    }
    
    return true;
}

// Process a match score and add it to the data
function processMatchScore(category, matchNumber, score1, score2, timestamp) {
    const totalScore = score1 + score2;
    
    let team1Score, team2Score, outcome;
    
    // Process data differently based on category
    if (category === 'h2h') {
        team1Score = score1;
        team2Score = score2;
        
        if (team1Score === team2Score) {
            outcome = 'Draw';
        } else if (team1Score > team2Score) {
            outcome = `${team1Name} Wins`;
        } else {
            outcome = `${team2Name} Wins`;
        }
    } else if (category === 'team1') {
        team1Score = score1;
        team2Score = score2; // This is "Opponent"
        
        if (team1Score === team2Score) {
            outcome = 'Draw';
        } else if (team1Score > team2Score) {
            outcome = `${team1Name} Wins`;
        } else {
            outcome = 'Opponent Wins';
        }
    } else if (category === 'team2') {
        team1Score = score2; // This is "Opponent"
        team2Score = score1;
        
        if (team1Score === team2Score) {
            outcome = 'Draw';
        } else if (team1Score > team2Score) {
            outcome = 'Opponent Wins';
        } else {
            outcome = `${team2Name} Wins`;
        }
    }
    
    // Calculate performance indicators
    const marginOfVictory = Math.abs(team1Score - team2Score);
    const goalEfficiency = totalScore > 0 ? Math.max(team1Score, team2Score) / totalScore : 0.5;
    const cleanSheet = team1Score === 0 || team2Score === 0;
    
    // Create match data
    const match = {
        matchNumber,
        team1Score,
        team2Score,
        totalScore,
        outcome,
        category,
        totalOverLine: totalLine > 0 ? totalScore > totalLine : null, // Only set if totalLine exists
        spreadCover: pointSpread > 0 ? calculateSpreadCover(team1Score, team2Score) : null, // Only set if pointSpread exists
        marginOfVictory,
        goalEfficiency,
        cleanSheet,
        timestamp: timestamp || Date.now() - (matchData[category].length * 86400000) // Use provided timestamp or create one
    };
    
    // Add match to data
    matchData[category].push(match);
    
    // Sort matches by timestamp (oldest first)
    matchData[category].sort((a, b) => a.timestamp - b.timestamp);
}

// Update match summary display
function updateMatchSummary(category) {
    const summaryElement = document.getElementById(`${category}-match-summary`);
    
    if (matchData[category].length === 0) {
        summaryElement.innerHTML = '<p>No matches added yet.</p>';
        return;
    }
    
    // Generate match items
    const matchItems = matchData[category].map(match => {
        let team1Label, team2Label, resultClass;
        
        if (category === 'h2h') {
            team1Label = team1Name;
            team2Label = team2Name;
            if (match.outcome === `${team1Name} Wins`) {
                resultClass = 'win';
            } else if (match.outcome === `${team2Name} Wins`) {
                resultClass = 'loss';
            } else {
                resultClass = 'draw';
            }
        } else if (category === 'team1') {
            team1Label = team1Name;
            team2Label = 'Opponent';
            if (match.outcome === `${team1Name} Wins`) {
                resultClass = 'win';
            } else if (match.outcome === 'Opponent Wins') {
                resultClass = 'loss';
            } else {
                resultClass = 'draw';
            }
        } else if (category === 'team2') {
            team1Label = 'Opponent';
            team2Label = team2Name;
            if (match.outcome === `${team2Name} Wins`) {
                resultClass = 'win';
            } else if (match.outcome === 'Opponent Wins') {
                resultClass = 'loss';
            } else {
                resultClass = 'draw';
            }
        }
        
        // Calculate how many days ago the match was
        const daysAgo = Math.floor((Date.now() - match.timestamp) / (24 * 60 * 60 * 1000));
        const dateInfo = daysAgo === 0 ? 'Today' : 
                        daysAgo === 1 ? 'Yesterday' : 
                        `${daysAgo} days ago`;
                        
        return `
            <div class="match-item ${resultClass}">
                <div class="match-score">${team1Label} ${match.team1Score} - ${match.team2Score} ${team2Label}</div>
                <div class="match-date">${dateInfo}</div>
            </div>
        `;
    }).join('');
    
    // Create the summary HTML
    const summaryHTML = `
        <h4>Added ${matchData[category].length} matches:</h4>
        <div class="match-list">
            ${matchItems}
        </div>
    `;
    
    summaryElement.innerHTML = summaryHTML;
}

// Update data sufficiency indicators
function updateDataSufficiencyIndicators() {
    // Update count displays
    document.getElementById('h2h-count').textContent = `${matchData.h2h.length} matches`;
    document.getElementById('team1-count').textContent = `${matchData.team1.length} matches`;
    document.getElementById('team2-count').textContent = `${matchData.team2.length} matches`;
    
    // Update meter widths (max at 100%)
    const h2hPercent = Math.min(100, (matchData.h2h.length / MIN_H2H_MATCHES) * 100);
    const team1Percent = Math.min(100, (matchData.team1.length / MIN_MATCHES_FOR_EXCELLENT_ANALYSIS) * 100);
    const team2Percent = Math.min(100, (matchData.team2.length / MIN_MATCHES_FOR_EXCELLENT_ANALYSIS) * 100);
    
    document.getElementById('h2h-meter').style.width = `${h2hPercent}%`;
    document.getElementById('team1-meter').style.width = `${team1Percent}%`;
    document.getElementById('team2-meter').style.width = `${team2Percent}%`;
    
    // Update data quality indicator
    const totalMatches = getTotalMatchCount();
    const dataQualityIndicator = document.getElementById('data-quality-indicator');
    const dataQualityText = document.getElementById('data-quality-text');
    
    if (totalMatches >= MIN_MATCHES_FOR_EXCELLENT_ANALYSIS && matchData.h2h.length >= MIN_H2H_MATCHES) {
        dataQualityIndicator.className = 'data-quality excellent';
        dataQualityText.textContent = 'Excellent data quality for accurate predictions';
    } else if (totalMatches >= MIN_MATCHES_FOR_GOOD_ANALYSIS) {
        dataQualityIndicator.className = 'data-quality good';
        dataQualityText.textContent = 'Good data quality for reliable predictions';
    } else {
        dataQualityIndicator.className = 'data-quality insufficient';
        dataQualityText.textContent = `Add more match data for better predictions (${MIN_MATCHES_FOR_GOOD_ANALYSIS - totalMatches} more needed for good quality)`;
    }
}

// Clear all match data
function clearAllData() {
    // Confirm before clearing
    if (getTotalMatchCount() > 0 && !confirm('Are you sure you want to clear all match data?')) {
        return;
    }
    
    // Clear data
    matchData.h2h = [];
    matchData.team1 = [];
    matchData.team2 = [];
    
    // Update UI
    updateMatchSummary('h2h');
    updateMatchSummary('team1');
    updateMatchSummary('team2');
    updateDataSufficiencyIndicators();
    
    showToast('All match data has been cleared', 'info');
}

// Calculate if the spread was covered
function calculateSpreadCover(team1Score, team2Score) {
    // Return null if no point spread is set
    if (pointSpread <= 0) return null;
    
    const adjustedScore = spreadDirection === 'team1' 
        ? team1Score - pointSpread
        : team2Score - pointSpread;
    
    const opposingScore = spreadDirection === 'team1' ? team2Score : team1Score;
    
    if (adjustedScore > opposingScore) {
        return 'Favorite Covered';
    } else if (adjustedScore < opposingScore) {
        return 'Underdog Covered';
    } else {
        return 'Push';
    }
}

// Validate inputs before analysis
function validateInputs() {
    // Check if there is any match data
    if (getTotalMatchCount() === 0) {
        showToast('Please add match data before analyzing', 'error');
        return false;
    }
    
    // Check if team names are set
    if (!team1Name.trim() || !team2Name.trim()) {
        showToast('Please enter names for both teams', 'error');
        return false;
    }
    
    // Check if team names are different
    if (team1Name.trim() === team2Name.trim()) {
        showToast('Team names must be different', 'error');
        return false;
    }
    
    // Data sufficiency warnings
    if (getTotalMatchCount() < MIN_MATCHES_FOR_GOOD_ANALYSIS) {
        if (!confirm(`You have only ${getTotalMatchCount()} matches in total. The analysis may not be accurate. Continue anyway?`)) {
            return false;
        }
    }
    
    return true;
}

// Process all match data
function processAllMatchData() {
    // Show loading state
    document.getElementById('analysis-loading').classList.remove('hidden');
    document.getElementById('analysis-results').classList.add('hidden');
    
    // Make the results section visible
    document.getElementById('results').classList.add('visible');
    
    // Get betting lines data
    totalLine = parseFloat(document.getElementById('betting-line').value) || 0;
    pointSpread = parseFloat(document.getElementById('point-spread').value) || 0;
    spreadDirection = document.getElementById('spread-direction').value;
    
    // Update the spread cover calculation for all matches
    updateSpreadCoverCalculations();
}

// Update spread cover calculations for all matches
function updateSpreadCoverCalculations() {
    // Update all match data with the current spread and total values
    for (const category in matchData) {
        matchData[category].forEach(match => {
            // Only calculate spread cover if point spread is set
            match.spreadCover = pointSpread > 0 ? 
                calculateSpreadCover(match.team1Score, match.team2Score) : null;
            
            // Only set totalOverLine if totalLine is set
            match.totalOverLine = totalLine > 0 ? 
                match.totalScore > totalLine : null;
        });
    }
}

// Run enhanced analysis with Monte Carlo simulations
function runEnhancedAnalysis() {
    console.log("Running Enhanced Analysis with Monte Carlo Simulations");
    
    try {
        // Prepare all feature data for analysis
        const features = prepareMatchFeatures();
        
        // Perform Monte Carlo simulations
        const simulations = runMonteCarlo(features, DEFAULT_SIMULATION_COUNT);
        
        // Calculate probabilities from simulation results
        const results = calculateProbabilitiesFromSimulations(simulations);
        
        // Calculate additional insights
        const insights = calculateInsightsFromSimulations(simulations, features);
        
        // Generate detailed analysis and explanation
        const analysis = generateDetailedAnalysis(results, features, insights);
        
        // Store the current analysis for reference
        lastAnalysisResults = {
            ...results,
            simulations,
            insights,
            analysis,
            team1Name,
            team2Name,
            totalLine,
            pointSpread,
            spreadDirection,
            matchImportance,
            matchLocation,
            team1Formation,
            team2Formation,
            features
        };
        
        // Store simulation results
        simulationResults = simulations;
        
        // Calculate feature importance
        featureImportanceScores = calculateFeatureImportance(features, results);
        
        // Update UI with analysis results
        updateUI(results, features, insights, analysis);
        
        // Hide loading and show results
        document.getElementById('analysis-loading').classList.add('hidden');
        document.getElementById('analysis-results').classList.remove('hidden');
    } catch (error) {
        console.error("Enhanced analysis failed:", error);
        showToast('Enhanced analysis encountered an error. Falling back to standard analysis.', 'error');
        
        // Fall back to standard analysis
        performStandardAnalysis();
    }
}

// Perform standard analysis (without Monte Carlo)
function performStandardAnalysis() {
    try {
        // Prepare match features
        const features = prepareMatchFeatures();
        
        // Calculate results using the standard model
        const results = runStandardModel(features);
        
        // Calculate basic insights
        const insights = calculateBasicInsights(features, results);
        
        // Generate basic analysis
        const analysis = generateBasicAnalysis(results, features);
        
        // Store the current analysis for reference
        lastAnalysisResults = {
            ...results,
            insights,
            analysis,
            team1Name,
            team2Name,
            totalLine,
            pointSpread,
            spreadDirection,
            matchImportance,
            matchLocation,
            features
        };
        
        // Calculate feature importance
        featureImportanceScores = calculateStandardFeatureImportance(features);
        
        // Update UI with analysis results
        updateUI(results, features, insights, analysis);
        
        // Hide loading and show results
        document.getElementById('analysis-loading').classList.add('hidden');
        document.getElementById('analysis-results').classList.remove('hidden');
    } catch (error) {
        console.error("Standard analysis failed:", error);
        showToast('Analysis failed. Please check your data and try again.', 'error');
        document.getElementById('analysis-loading').classList.add('hidden');
    }
}

// Run Monte Carlo simulations
function runMonteCarlo(features, numSimulations = 10000) {
    console.log(`Running ${numSimulations} Monte Carlo simulations`);
    
    // Calculate base expectations for scoring
    const team1ExpectedGoals = calculateTeam1ExpectedGoals(features);
    const team2ExpectedGoals = calculateTeam2ExpectedGoals(features);
    
    // Apply formation adjustments if available
    const formationAdjustments = calculateFormationAdjustments(team1Formation, team2Formation);
    
    // Apply context adjustments (location, importance)
    const contextAdjustments = calculateContextAdjustments(features);
    
    // Final adjusted expected goals
    const team1AdjustedExpectedGoals = Math.max(0.1, team1ExpectedGoals * 
        (1 + formationAdjustments.team1OffensiveAdjustment) * 
        (1 + contextAdjustments.team1OffensiveAdjustment));
        
    const team2AdjustedExpectedGoals = Math.max(0.1, team2ExpectedGoals * 
        (1 + formationAdjustments.team2OffensiveAdjustment) * 
        (1 + contextAdjustments.team2OffensiveAdjustment));
    
    console.log(`Expected goals after adjustments: ${team1Name}: ${team1AdjustedExpectedGoals.toFixed(2)}, ${team2Name}: ${team2AdjustedExpectedGoals.toFixed(2)}`);
    
    // Create array to store simulation results
    const simulations = [];
    
    // Run simulations
    for (let i = 0; i < numSimulations; i++) {
        // Generate Poisson random variables for scores
        const team1Goals = generatePoissonRandom(team1AdjustedExpectedGoals);
        const team2Goals = generatePoissonRandom(team2AdjustedExpectedGoals);
        
        // Determine match outcome
        let outcome;
        if (team1Goals > team2Goals) {
            outcome = 'team1Win';
        } else if (team1Goals < team2Goals) {
            outcome = 'team2Win';
        } else {
            outcome = 'draw';
        }
        
        // Calculate total goals and goal difference
        const totalGoals = team1Goals + team2Goals;
        const goalDifference = team1Goals - team2Goals;
        
        // Determine betting outcomes
        const overLine = totalGoals > totalLine;
        const underLine = totalGoals < totalLine;
        const pushLine = totalGoals === totalLine;
        
        // Determine handicap outcomes (if spread is set)
        let spreadOutcome = null;
        if (pointSpread > 0) {
            const adjustedScore = spreadDirection === 'team1' 
                ? team1Goals - pointSpread 
                : team2Goals - pointSpread;
                
            const opposingScore = spreadDirection === 'team1' 
                ? team2Goals 
                : team1Goals;
                
            if (adjustedScore > opposingScore) {
                spreadOutcome = 'favoriteCovers';
            } else if (adjustedScore < opposingScore) {
                spreadOutcome = 'underdogCovers';
            } else {
                spreadOutcome = 'push';
            }
        }
        
        // Store simulation result
        simulations.push({
            team1Goals,
            team2Goals,
            totalGoals,
            goalDifference,
            outcome,
            overLine,
            underLine,
            pushLine,
            spreadOutcome
        });
    }
    
    return simulations;
}

// Calculate team 1 expected goals based on features
function calculateTeam1ExpectedGoals(features) {
    const { basicStats, advancedStats } = features;
    
    // Base expected goals from historical scoring
    const baseExpectedGoals = basicStats.team1AvgScore;
    
    // Adjust based on opponent's defensive strength
    const opponentDefenseAdjustment = 1 - advancedStats.team2DefenseStrength;
    
    // Adjust based on recent form
    const formAdjustment = advancedStats.team1RecentForm - 0.5;
    
    // Combine adjustments
    const expectedGoals = baseExpectedGoals * (1 + opponentDefenseAdjustment) * (1 + formAdjustment * 0.5);
    
    return Math.max(0.1, expectedGoals);
}

// Calculate team 2 expected goals based on features
function calculateTeam2ExpectedGoals(features) {
    const { basicStats, advancedStats } = features;
    
    // Base expected goals from historical scoring
    const baseExpectedGoals = basicStats.team2AvgScore;
    
    // Adjust based on opponent's defensive strength
    const opponentDefenseAdjustment = 1 - advancedStats.team1DefenseStrength;
    
    // Adjust based on recent form
    const formAdjustment = advancedStats.team2RecentForm - 0.5;
    
    // Combine adjustments
    const expectedGoals = baseExpectedGoals * (1 + opponentDefenseAdjustment) * (1 + formAdjustment * 0.5);
    
    return Math.max(0.1, expectedGoals);
}

// Calculate formation adjustments if formations are selected
function calculateFormationAdjustments(team1Formation, team2Formation) {
    // Default adjustments (no effect)
    const defaultAdjustments = {
        team1OffensiveAdjustment: 0,
        team1DefensiveAdjustment: 0,
        team2OffensiveAdjustment: 0,
        team2DefensiveAdjustment: 0,
        team1TacticalAdvantage: 0
    };
    
    // If formations are default or not supported, return default adjustments
    if (team1Formation === 'default' || team2Formation === 'default') {
        return defaultAdjustments;
    }
    
    const sportFormations = FORMATIONS[sportType] || FORMATIONS.default;
    
    // Check if formations exist in the current sport
    if (!sportFormations[team1Formation] || !sportFormations[team2Formation]) {
        return defaultAdjustments;
    }
    
    const team1FormationData = sportFormations[team1Formation];
    const team2FormationData = sportFormations[team2Formation];
    
    // Calculate tactical advantage
    let tacticalAdvantage = 0;
    
    // Check if team1's formation is strong against team2's
    if (team1FormationData.strongAgainst && team1FormationData.strongAgainst.includes(team2Formation)) {
        tacticalAdvantage += 0.15;
    }
    
    // Check if team1's formation is weak against team2's
    if (team1FormationData.weakAgainst && team1FormationData.weakAgainst.includes(team2Formation)) {
        tacticalAdvantage -= 0.15;
    }
    
    // Apply formation characteristics
    let team1OffensiveAdjustment = (team1FormationData.attacking - 0.7) * 0.5;
    let team1DefensiveAdjustment = (team1FormationData.defending - 0.7) * 0.5;
    
    let team2OffensiveAdjustment = (team2FormationData.attacking - 0.7) * 0.5;
    let team2DefensiveAdjustment = (team2FormationData.defending - 0.7) * 0.5;
    
    // Add tactical advantage to adjustments
    team1OffensiveAdjustment += tacticalAdvantage;
    team1DefensiveAdjustment += tacticalAdvantage;
    team2OffensiveAdjustment -= tacticalAdvantage;
    team2DefensiveAdjustment -= tacticalAdvantage;
    
    return {
        team1OffensiveAdjustment,
        team1DefensiveAdjustment,
        team2OffensiveAdjustment,
        team2DefensiveAdjustment,
        team1TacticalAdvantage: tacticalAdvantage
    };
}

// Calculate context adjustments based on match importance and location
function calculateContextAdjustments(features) {
    const { basicStats } = features;
    
    // Default adjustments (no effect)
    const adjustments = {
        team1OffensiveAdjustment: 0,
        team1DefensiveAdjustment: 0,
        team2OffensiveAdjustment: 0,
        team2DefensiveAdjustment: 0
    };
    
    // Apply location adjustments
    if (basicStats.locationFactor === 1) {
        // Team 1 at home
        adjustments.team1OffensiveAdjustment += 0.1;
        adjustments.team1DefensiveAdjustment += 0.1;
        adjustments.team2OffensiveAdjustment -= 0.05;
    } else if (basicStats.locationFactor === -1) {
        // Team 2 at home
        adjustments.team2OffensiveAdjustment += 0.1;
        adjustments.team2DefensiveAdjustment += 0.1;
        adjustments.team1OffensiveAdjustment -= 0.05;
    }
    
    // Apply match importance adjustments
    if (basicStats.matchImportance > 1) {
        // Important match - teams might be more cautious
        const importanceFactor = (basicStats.matchImportance - 1) * 0.1;
        adjustments.team1DefensiveAdjustment += importanceFactor;
        adjustments.team2DefensiveAdjustment += importanceFactor;
        
        // But home team might be more offensive in important matches
        if (basicStats.locationFactor === 1) {
            adjustments.team1OffensiveAdjustment += importanceFactor * 0.5;
        } else if (basicStats.locationFactor === -1) {
            adjustments.team2OffensiveAdjustment += importanceFactor * 0.5;
        }
    } else if (basicStats.matchImportance < 1) {
        // Less important match - might be more open
        const importanceFactor = (1 - basicStats.matchImportance) * 0.1;
        adjustments.team1OffensiveAdjustment += importanceFactor;
        adjustments.team2OffensiveAdjustment += importanceFactor;
        adjustments.team1DefensiveAdjustment -= importanceFactor;
        adjustments.team2DefensiveAdjustment -= importanceFactor;
    }
    
    return adjustments;
}

// Generate a random Poisson variable
function generatePoissonRandom(lambda) {
    if (lambda <= 0) return 0;
    
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    
    do {
        k++;
        p *= Math.random();
    } while (p > L);
    
    return k - 1;
}

// Calculate probabilities from simulation results
function calculateProbabilitiesFromSimulations(simulations) {
    // Calculate match outcome probabilities
    const team1Wins = simulations.filter(sim => sim.outcome === 'team1Win').length;
    const team2Wins = simulations.filter(sim => sim.outcome === 'team2Win').length;
    const draws = simulations.filter(sim => sim.outcome === 'draw').length;
    
    const team1WinProb = (team1Wins / simulations.length) * 100;
    const team2WinProb = (team2Wins / simulations.length) * 100;
    const drawProb = (draws / simulations.length) * 100;
    
    // Calculate over/under probabilities
    const overCount = simulations.filter(sim => sim.overLine).length;
    const underCount = simulations.filter(sim => sim.underLine).length;
    const pushCount = simulations.filter(sim => sim.pushLine).length;
    
    const overProb = (overCount / simulations.length) * 100;
    const underProb = (underCount / simulations.length) * 100;
    const pushProb = (pushCount / simulations.length) * 100;
    
    // Calculate spread probabilities
    let favoriteCoversProb = 0;
    let underdogCoversProb = 0;
    let spreadPushProb = 0;
    
    if (pointSpread > 0) {
        const favoriteCoversCount = simulations.filter(sim => sim.spreadOutcome === 'favoriteCovers').length;
        const underdogCoversCount = simulations.filter(sim => sim.spreadOutcome === 'underdogCovers').length;
        const spreadPushCount = simulations.filter(sim => sim.spreadOutcome === 'push').length;
        
        favoriteCoversProb = (favoriteCoversCount / simulations.length) * 100;
        underdogCoversProb = (underdogCoversCount / simulations.length) * 100;
        spreadPushProb = (spreadPushCount / simulations.length) * 100;
    }
    
    // Calculate average scores and common scores
    const avgTeam1Goals = simulations.reduce((sum, sim) => sum + sim.team1Goals, 0) / simulations.length;
    const avgTeam2Goals = simulations.reduce((sum, sim) => sum + sim.team2Goals, 0) / simulations.length;
    const avgTotalGoals = simulations.reduce((sum, sim) => sum + sim.totalGoals, 0) / simulations.length;
    
    // Get the most frequent scores
    const scoreFrequency = {};
    simulations.forEach(sim => {
        const scoreKey = `${sim.team1Goals}-${sim.team2Goals}`;
        scoreFrequency[scoreKey] = (scoreFrequency[scoreKey] || 0) + 1;
    });
    
    const mostCommonScores = Object.entries(scoreFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([score, count]) => {
            const [team1Score, team2Score] = score.split('-').map(Number);
            return {
                team1Score,
                team2Score,
                probability: (count / simulations.length) * 100
            };
        });
    
    // Get score distribution
    const scoreDistribution = Array(10).fill(0);
    simulations.forEach(sim => {
        if (sim.totalGoals < scoreDistribution.length) {
            scoreDistribution[sim.totalGoals]++;
        }
    });
    
    // Normalize score distribution to percentages
    const normalizedScoreDistribution = scoreDistribution.map(count => 
        (count / simulations.length) * 100);
    
    return {
        probabilities: {
            team1WinProb,
            team2WinProb,
            drawProb,
            overProb,
            underProb,
            pushProb,
            favoriteCoversProb,
            underdogCoversProb,
            spreadPushProb
        },
        scores: {
            avgTeam1Goals,
            avgTeam2Goals,
            avgTotalGoals,
            mostCommonScores,
            mostLikelyScore: mostCommonScores[0],
            scoreDistribution: normalizedScoreDistribution
        }
    };
}

// Calculate additional insights from simulations
function calculateInsightsFromSimulations(simulations, features) {
    // Calculate goal distribution insights
    const goalDistribution = {
        team1: Array(7).fill(0), // 0, 1, 2, 3, 4, 5, 6+ goals
        team2: Array(7).fill(0)
    };
    
    simulations.forEach(sim => {
        const team1GoalIndex = Math.min(6, sim.team1Goals);
        const team2GoalIndex = Math.min(6, sim.team2Goals);
        
        goalDistribution.team1[team1GoalIndex]++;
        goalDistribution.team2[team2GoalIndex]++;
    });
    
    // Normalize goal distributions to percentages
    const normalizedGoalDistribution = {
        team1: goalDistribution.team1.map(count => (count / simulations.length) * 100),
        team2: goalDistribution.team2.map(count => (count / simulations.length) * 100)
    };
    
    // Calculate clean sheet probabilities
    const team1CleanSheetCount = simulations.filter(sim => sim.team2Goals === 0).length;
    const team2CleanSheetCount = simulations.filter(sim => sim.team1Goals === 0).length;
    
    const team1CleanSheetProb = (team1CleanSheetCount / simulations.length) * 100;
    const team2CleanSheetProb = (team2CleanSheetCount / simulations.length) * 100;
    
    // Calculate both teams to score probability
    const bttsCount = simulations.filter(sim => sim.team1Goals > 0 && sim.team2Goals > 0).length;
    const bttsProb = (bttsCount / simulations.length) * 100;
    
    // Calculate goal margin probabilities
    const marginDistribution = Array(7).fill(0); // 0, 1, 2, 3, 4, 5, 6+ goal margin
    
    simulations.forEach(sim => {
        const margin = Math.abs(sim.goalDifference);
        const marginIndex = Math.min(6, margin);
        marginDistribution[marginIndex]++;
    });
    
    const normalizedMarginDistribution = marginDistribution.map(count => 
        (count / simulations.length) * 100);
    
    // Calculate exact score probabilities beyond the top 5
    const allScoreProbabilities = Object.entries(simulations.reduce((acc, sim) => {
        const scoreKey = `${sim.team1Goals}-${sim.team2Goals}`;
        acc[scoreKey] = (acc[scoreKey] || 0) + 1;
        return acc;
    }, {}))
    .map(([score, count]) => {
        const [team1Score, team2Score] = score.split('-').map(Number);
        return {
            team1Score,
            team2Score,
            probability: (count / simulations.length) * 100
        };
    })
    .sort((a, b) => b.probability - a.probability);
    
    // Get formation insights if available
    let formationInsights = null;
    
    if (team1Formation !== 'default' && team2Formation !== 'default' && 
        sportType !== 'default' && FORMATIONS[sportType]) {
        
        const formationAdjustments = calculateFormationAdjustments(team1Formation, team2Formation);
        
        const team1FormationData = FORMATIONS[sportType][team1Formation];
        const team2FormationData = FORMATIONS[sportType][team2Formation];
        
        if (team1FormationData && team2FormationData) {
            formationInsights = {
                tacticalAdvantage: formationAdjustments.team1TacticalAdvantage,
                team1Strengths: {
                    attacking: team1FormationData.attacking,
                    defending: team1FormationData.defending,
                    description: team1FormationData.description
                },
                team2Strengths: {
                    attacking: team2FormationData.attacking,
                    defending: team2FormationData.defending,
                    description: team2FormationData.description
                },
                matchups: {
                    team1StrongAgainst: team1FormationData.strongAgainst || [],
                    team1WeakAgainst: team1FormationData.weakAgainst || [],
                    isStrong: team1FormationData.strongAgainst?.includes(team2Formation) || false,
                    isWeak: team1FormationData.weakAgainst?.includes(team2Formation) || false
                }
            };
        }
    }
    
    // Calculate match flow insights
    const matchFlowInsights = {
        firstHalfGoals: features.h2hData?.firstHalfAvgGoals || avgTotalGoals(features) * 0.4,
        secondHalfGoals: features.h2hData?.secondHalfAvgGoals || avgTotalGoals(features) * 0.6,
        team1FirstHalfStrength: features.team1Data?.firstHalfStrength || 0.5,
        team2FirstHalfStrength: features.team2Data?.firstHalfStrength || 0.5,
        team1SecondHalfStrength: features.team1Data?.secondHalfStrength || 0.5,
        team2SecondHalfStrength: features.team2Data?.secondHalfStrength || 0.5
    };
    
    return {
        goalDistribution: normalizedGoalDistribution,
        cleanSheetProbabilities: {
            team1: team1CleanSheetProb,
            team2: team2CleanSheetProb
        },
        bttsProb,
        marginDistribution: normalizedMarginDistribution,
        allScoreProbabilities,
        formationInsights,
        matchFlow: matchFlowInsights
    };
}

// Helper to calculate average total goals
function avgTotalGoals(features) {
    return (features.basicStats.team1AvgScore + features.basicStats.team2AvgScore) / 2;
}

// Generate detailed analysis text
function generateDetailedAnalysis(results, features, insights) {
    // Create analysis object that will be used for the UI
    const analysis = {
        title: `Pre-Match Analysis: ${team1Name} vs ${team2Name}`,
        summary: generateSummary(results, features),
        sections: [
            {
                title: "Team Condition Analysis",
                content: generateTeamConditionAnalysis(features)
            },
            {
                title: "Head-to-Head Analysis",
                content: generateHeadToHeadAnalysis(features)
            },
            {
                title: "Tactical Analysis",
                content: generateTacticalAnalysis(features, insights)
            },
            {
                title: "Key Factors",
                content: generateKeyFactorsAnalysis(features, results)
            },
            {
                title: "Score Prediction",
                content: generateScorePrediction(results, features)
            }
        ]
    };
    
    // Add formation analysis if available
    if (insights.formationInsights) {
        analysis.sections.push({
            title: "Formation Analysis",
            content: generateFormationAnalysis(insights.formationInsights)
        });
    }
    
    // Add match context section
    analysis.sections.push({
        title: "Match Context",
        content: generateMatchContextAnalysis(features)
    });
    
    return analysis;
}

// Generate summary section of analysis
function generateSummary(results, features) {
    const { probabilities, scores } = results;
    
    // Determine the predicted winner
    let winnerText, winnerProb;
    if (probabilities.team1WinProb > probabilities.team2WinProb && 
        probabilities.team1WinProb > probabilities.drawProb) {
        winnerText = team1Name;
        winnerProb = probabilities.team1WinProb;
    } else if (probabilities.team2WinProb > probabilities.team1WinProb && 
               probabilities.team2WinProb > probabilities.drawProb) {
        winnerText = team2Name;
        winnerProb = probabilities.team2WinProb;
    } else {
        winnerText = "A draw";
        winnerProb = probabilities.drawProb;
    }
    
    // Generate confidence level text
    let confidenceLevel;
    if (winnerProb > 70) {
        confidenceLevel = "high confidence";
    } else if (winnerProb > 55) {
        confidenceLevel = "moderate confidence";
    } else {
        confidenceLevel = "low confidence";
    }
    
    // Create descriptive location text
    let locationText = "neutral venue";
    if (features.basicStats.locationFactor === 1) {
        locationText = `${team1Name}'s home venue`;
    } else if (features.basicStats.locationFactor === -1) {
        locationText = `${team2Name}'s home venue`;
    }
    
    // Generate most likely score text
    const mostLikelyScore = scores.mostLikelyScore;
    const scoreProbText = mostLikelyScore ? 
        `(${mostLikelyScore.probability.toFixed(1)}% probability)` : '';
    
    return `Based on comprehensive statistical analysis and ${DEFAULT_SIMULATION_COUNT.toLocaleString()} Monte Carlo simulations, ${winnerText} is predicted to win with ${confidenceLevel} (${winnerProb.toFixed(1)}%). The most likely score is ${mostLikelyScore ? `${mostLikelyScore.team1Score}-${mostLikelyScore.team2Score}` : 'undetermined'} ${scoreProbText}. This match at ${locationText} has a ${probabilities.overProb.toFixed(1)}% chance of going over the ${totalLine} total line.`;
}

// Generate team condition analysis
function generateTeamConditionAnalysis(features) {
    const { basicStats, advancedStats } = features;
    
    const team1FormStatus = getFormStatus(advancedStats.team1RecentForm);
    const team2FormStatus = getFormStatus(advancedStats.team2RecentForm);
    
    // Generate scoring trend descriptions
    const team1ScoringTrend = getScoringTrendDescription(features.trends?.scoring?.team1Trend || 0.5);
    const team2ScoringTrend = getScoringTrendDescription(features.trends?.scoring?.team2Trend || 0.5);
    
    // Generate defensive trend descriptions
    const team1DefensiveTrend = getDefensiveTrendDescription(features.trends?.defensive?.team1Trend || 0.5);
    const team2DefensiveTrend = getDefensiveTrendDescription(features.trends?.defensive?.team2Trend || 0.5);
    
    // Generate home/away record information if available
    let team1HomeAwayText = "";
    let team2HomeAwayText = "";
    
    if (features.basicStats.locationFactor === 1) {
        team1HomeAwayText = `They have been strong at home, scoring an average of ${basicStats.team1AvgScore.toFixed(1)} goals per game in their home matches.`;
        team2HomeAwayText = `Their away record has been ${getAwayRecordDescription(advancedStats.team2RecentForm)}.`;
    } else if (features.basicStats.locationFactor === -1) {
        team2HomeAwayText = `They have been impressive at home, scoring an average of ${basicStats.team2AvgScore.toFixed(1)} goals per game in their home matches.`;
        team1HomeAwayText = `Their away record has been ${getAwayRecordDescription(advancedStats.team1RecentForm)}.`;
    }
    
    return `
${team1Name} is currently in ${team1FormStatus} form with a recent ${team1ScoringTrend} and ${team1DefensiveTrend}. ${team1HomeAwayText} They have averaged ${basicStats.team1AvgScore.toFixed(1)} goals scored and ${basicStats.team1AvgConceded.toFixed(1)} conceded per match.

${team2Name} is showing ${team2FormStatus} form with a ${team2ScoringTrend} and ${team2DefensiveTrend}. ${team2HomeAwayText} They have averaged ${basicStats.team2AvgScore.toFixed(1)} goals scored and ${basicStats.team2AvgConceded.toFixed(1)} conceded per match.
`;
}

// Helper to get form status description
function getFormStatus(formRating) {
    if (formRating > 0.8) return "excellent";
    if (formRating > 0.65) return "good";
    if (formRating > 0.5) return "above average";
    if (formRating > 0.35) return "below average";
    if (formRating > 0.2) return "poor";
    return "very poor";
}

// Helper to get scoring trend description
function getScoringTrendDescription(trend) {
    if (trend > 0.8) return "sharply improving goal scoring record";
    if (trend > 0.6) return "improving goal scoring record";
    if (trend > 0.5) return "steady goal scoring record";
    if (trend > 0.4) return "slightly declining goal scoring record";
    if (trend > 0.2) return "declining goal scoring record";
    return "significantly declining goal scoring record";
}

// Helper to get defensive trend description
function getDefensiveTrendDescription(trend) {
    if (trend > 0.8) return "significantly improving defense";
    if (trend > 0.6) return "improving defense";
    if (trend > 0.5) return "stable defensive record";
    if (trend > 0.4) return "slightly declining defense";
    if (trend > 0.2) return "weakening defense";
    return "rapidly weakening defense";
}

// Helper to get away record description
function getAwayRecordDescription(formRating) {
    if (formRating > 0.7) return "impressive";
    if (formRating > 0.5) return "solid";
    if (formRating > 0.3) return "inconsistent";
    return "concerning";
}

// Generate head-to-head analysis
function generateHeadToHeadAnalysis(features) {
    const { h2hData } = features;
    
    if (!h2hData || h2hData.matchCount === 0) {
        return `There is insufficient head-to-head data between ${team1Name} and ${team2Name} to make a direct historical comparison. This analysis relies more heavily on each team's recent performances against other opponents.`;
    }
    
    // Get the h2h advantage description
    const h2hAdvantageDesc = getH2HAdvantageDescription(features.basicStats.h2hAdvantage);
    
    // Calculate specific h2h stats
    const team1Wins = h2hData.team1Wins;
    const team2Wins = h2hData.team2Wins;
    const draws = h2hData.draws;
    
    // Get scoring pattern description
    const scoringPatternDesc = getH2HScoringDescription(h2hData.avgTotalGoals, h2hData.team1AvgGoals, h2hData.team2AvgGoals);
    
    return `
In ${h2hData.matchCount} previous meetings between these teams, ${team1Name} has won ${team1Wins} times, ${team2Name} has won ${team2Wins} times, and ${draws} matches ended in a draw. ${h2hAdvantageDesc}.

${scoringPatternDesc}. The most recent encounter ended ${h2hData.lastMatchResult || 'inconclusively'}, which ${getRecentRelevanceText(h2hData.lastMatchDaysAgo || 180)}.
`;
}

// Helper to get h2h advantage description
function getH2HAdvantageDescription(h2hAdvantage) {
    if (h2hAdvantage > 0.4) return `${team1Name} has a strong historical advantage in this matchup`;
    if (h2hAdvantage > 0.2) return `${team1Name} has a slight edge in their head-to-head history`;
    if (h2hAdvantage > -0.2) return `The head-to-head record between these teams is fairly even`;
    if (h2hAdvantage > -0.4) return `${team2Name} has a slight edge in their head-to-head history`;
    return `${team2Name} has dominated this matchup historically`;
}

// Helper to get h2h scoring description
function getH2HScoringDescription(avgTotal, team1Avg, team2Avg) {
    let scoringVolume;
    if (avgTotal > 3) {
        scoringVolume = "Their matches tend to be high-scoring";
    } else if (avgTotal > 2) {
        scoringVolume = "Their encounters typically produce a moderate number of goals";
    } else {
        scoringVolume = "Their previous matches have generally been low-scoring affairs";
    }
    
    let scoringBalance;
    const scoreDiff = Math.abs(team1Avg - team2Avg);
    if (scoreDiff < 0.5) {
        scoringBalance = "with both teams scoring at a similar rate";
    } else if (team1Avg > team2Avg) {
        scoringBalance = `with ${team1Name} typically outscoring ${team2Name}`;
    } else {
        scoringBalance = `with ${team2Name} typically finding the net more often than ${team1Name}`;
    }
    
    return `${scoringVolume} (${avgTotal.toFixed(1)} goals per match), ${scoringBalance}`;
}

// Helper to get relevance of recent matches
function getRecentRelevanceText(daysAgo) {
    if (daysAgo <= 30) {
        return "is very relevant to the current form of both teams";
    } else if (daysAgo <= 90) {
        return "still offers valuable insights into this matchup";
    } else if (daysAgo <= 180) {
        return "should be considered with caution as teams may have changed since then";
    } else {
        return "may not be particularly relevant to the current squads and tactics";
    }
}

// Generate tactical analysis
function generateTacticalAnalysis(features, insights) {
    let tacticalAnalysis = "";
    
    // Add formation analysis if available
    if (team1Formation !== 'default' && team2Formation !== 'default' && insights.formationInsights) {
        const { formationInsights } = insights;
        
        // Describe team1 formation
        tacticalAnalysis += `${team1Name} is expected to deploy a ${team1Formation} formation, which is ${formationInsights.team1Strengths.description.toLowerCase()}. `;
        
        // Describe team2 formation
        tacticalAnalysis += `${team2Name} is anticipated to use a ${team2Formation} formation, ${formationInsights.team2Strengths.description.toLowerCase()}. `;
        
        // Describe tactical matchup
        if (formationInsights.matchups.isStrong) {
            tacticalAnalysis += `This gives ${team1Name} a tactical advantage as their formation is typically strong against ${team2Formation} setups. `;
        } else if (formationInsights.matchups.isWeak) {
            tacticalAnalysis += `This could pose challenges for ${team1Name} as their formation has historically struggled against ${team2Formation} arrangements. `;
        } else {
            tacticalAnalysis += `The formation matchup appears balanced without a clear tactical advantage to either side. `;
        }
    } else {
        // Generic tactical analysis if formations aren't specified
        const { advancedStats } = features;
        
        // Describe team styles based on attack/defense strengths
        if (advancedStats.team1AttackStrength > 1.3) {
            tacticalAnalysis += `${team1Name} typically plays with an attack-minded approach, focusing on creating scoring opportunities. `;
        } else if (advancedStats.team1DefenseStrength > 1.3) {
            tacticalAnalysis += `${team1Name} often employs a defense-first strategy, prioritizing solidity at the back. `;
        } else {
            tacticalAnalysis += `${team1Name} generally takes a balanced tactical approach. `;
        }
        
        if (advancedStats.team2AttackStrength > 1.3) {
            tacticalAnalysis += `${team2Name} usually adopts an offensive style, looking to outscore opponents. `;
        } else if (advancedStats.team2DefenseStrength > 1.3) {
            tacticalAnalysis += `${team2Name} typically sets up with defensive solidity as a priority. `;
        } else {
            tacticalAnalysis += `${team2Name} tends to play with a balanced tactical setup. `;
        }
    }
    
    // Add match flow insights
    const bttsProb = insights.bttsProb;
    if (bttsProb > 60) {
        tacticalAnalysis += `There's a strong likelihood (${bttsProb.toFixed(0)}%) that both teams will score in this match, suggesting an open, attacking game. `;
    } else if (bttsProb < 40) {
        tacticalAnalysis += `With only a ${bttsProb.toFixed(0)}% chance of both teams scoring, this match could be tactically cautious with emphasis on defense. `;
    }
    
    // Add expected match flow
    tacticalAnalysis += `\n\nIn terms of match flow, `;
    
    if (insights.matchFlow.team1FirstHalfStrength > insights.matchFlow.team1SecondHalfStrength &&
        insights.matchFlow.team1FirstHalfStrength > 0.6) {
        tacticalAnalysis += `${team1Name} typically starts strongly and may look to establish an early advantage. `;
    } else if (insights.matchFlow.team1SecondHalfStrength > insights.matchFlow.team1FirstHalfStrength &&
               insights.matchFlow.team1SecondHalfStrength > 0.6) {
        tacticalAnalysis += `${team1Name} often grows into matches and becomes more dangerous as games progress. `;
    }
    
    if (insights.matchFlow.team2FirstHalfStrength > insights.matchFlow.team2SecondHalfStrength &&
        insights.matchFlow.team2FirstHalfStrength > 0.6) {
        tacticalAnalysis += `${team2Name} usually begins matches aggressively and will likely push for an early goal. `;
    } else if (insights.matchFlow.team2SecondHalfStrength > insights.matchFlow.team2FirstHalfStrength &&
               insights.matchFlow.team2SecondHalfStrength > 0.6) {
        tacticalAnalysis += `${team2Name} tends to be more effective in the second half and may adopt a patient approach initially. `;
    }
    
    tacticalAnalysis += `The data suggests that the ${insights.matchFlow.firstHalfGoals > insights.matchFlow.secondHalfGoals ? 'first' : 'second'} half is likely to see more goals.`;
    
    return tacticalAnalysis;
}

// Generate formation analysis
function generateFormationAnalysis(formationInsights) {
    const tacAdvantage = formationInsights.tacticalAdvantage;
    let advantageTeam, advantageDesc;
    
    if (Math.abs(tacAdvantage) < 0.05) {
        advantageTeam = "Neither team";
        advantageDesc = "minimal";
    } else if (tacAdvantage > 0) {
        advantageTeam = team1Name;
        advantageDesc = tacAdvantage > 0.1 ? "significant" : "slight";
    } else {
        advantageTeam = team2Name;
        advantageDesc = tacAdvantage < -0.1 ? "significant" : "slight";
    }
    
    return `
${team1Name}'s ${team1Formation} formation provides them with ${getStrengthDescription(formationInsights.team1Strengths.attacking)} attacking capabilities and ${getStrengthDescription(formationInsights.team1Strengths.defending)} defensive solidity. ${formationInsights.team1Strengths.description}

${team2Name}'s ${team2Formation} formation gives them ${getStrengthDescription(formationInsights.team2Strengths.attacking)} offensive potential and ${getStrengthDescription(formationInsights.team2Strengths.defending)} defensive organization. ${formationInsights.team2Strengths.description}

${advantageTeam} has a ${advantageDesc} tactical advantage based on the formation matchup. ${getFormationMatchupDescription(formationInsights.matchups, tacAdvantage)}
`;
}

// Helper to get strength description
function getStrengthDescription(strengthValue) {
    if (strengthValue > 0.8) return "exceptional";
    if (strengthValue > 0.7) return "strong";
    if (strengthValue > 0.6) return "above average";
    if (strengthValue > 0.5) return "decent";
    if (strengthValue > 0.4) return "average";
    if (strengthValue > 0.3) return "below average";
    return "limited";
}

// Helper to get formation matchup description
function getFormationMatchupDescription(matchups, tacAdvantage) {
    if (Math.abs(tacAdvantage) < 0.05) {
        return "Both formations are well-matched and should lead to a balanced tactical contest.";
    }
    
    if (tacAdvantage > 0) {
        if (matchups.isStrong) {
            return `${team1Name}'s ${team1Formation} has historically performed well against ${team2Formation} setups, giving them the upper hand in this tactical battle.`;
        } else {
            return `${team1Name}'s overall tactical approach should give them an edge, though their formation isn't specifically strong against ${team2Formation}.`;
        }
    } else {
        if (matchups.isWeak) {
            return `${team1Name}'s ${team1Formation} has historically struggled against ${team2Formation} setups, which could give ${team2Name} a tactical advantage.`;
        } else {
            return `${team2Name}'s tactical setup should give them a slight edge in this matchup.`;
        }
    }
}

// Generate key factors analysis
function generateKeyFactorsAnalysis(features, results) {
    const { basicStats, advancedStats } = features;
    
    // Key factor: Location advantage
    let locationFactor = "";
    if (basicStats.locationFactor === 1) {
        locationFactor = `**Home Advantage**: ${team1Name} will benefit from playing at home, which historically gives them a ${Math.round((advancedStats.team1HomeAdvantage - 1) * 100)}% boost in performance.`;
    } else if (basicStats.locationFactor === -1) {
        locationFactor = `**Away Advantage**: ${team2Name} has the home advantage, which typically improves their performance by ${Math.round((advancedStats.team2HomeAdvantage - 1) * 100)}%.`;
    } else {
        locationFactor = "**Neutral Venue**: Neither team has a home advantage in this match.";
    }
    
    // Key factor: Form comparison
    let formComparison = "";
    const formDiff = advancedStats.team1RecentForm - advancedStats.team2RecentForm;
    if (Math.abs(formDiff) < 0.1) {
        formComparison = "**Current Form**: Both teams are in comparable form based on recent results.";
    } else if (formDiff > 0) {
        formComparison = `**Current Form**: ${team1Name} is in better recent form than ${team2Name}.`;
    } else {
        formComparison = `**Current Form**: ${team2Name} is showing better form than ${team1Name} in recent matches.`;
    }
    
    // Key factor: Ranking difference
    let rankingFactor = "";
    if (team1Ranking > 0 && team2Ranking > 0) {
        const rankDiff = team1Ranking - team2Ranking;
        if (Math.abs(rankDiff) < 3) {
            rankingFactor = `**Rankings**: The teams are closely ranked (${team1Name} #${team1Ranking}, ${team2Name} #${team2Ranking}).`;
        } else if (rankDiff < 0) {
            rankingFactor = `**Rankings**: ${team1Name} (#${team1Ranking}) is ranked higher than ${team2Name} (#${team2Ranking}).`;
        } else {
            rankingFactor = `**Rankings**: ${team2Name} (#${team2Ranking}) holds a better ranking than ${team1Name} (#${team1Ranking}).`;
        }
    }
    
    // Key factor: Match importance
    let importanceFactor = "";
    if (basicStats.matchImportance > 1.3) {
        importanceFactor = "**Match Importance**: This is a high-stakes match that could influence both teams to adopt more cautious approaches.";
    } else if (basicStats.matchImportance < 0.8) {
        importanceFactor = "**Match Importance**: This is a lower-priority match which may lead to more open, attacking play.";
    }
    
    // Key factor: Scoring and defensive strengths
    let scoringFactor = "";
    if (advancedStats.team1AttackStrength > advancedStats.team2DefenseStrength + 0.3) {
        scoringFactor = `**Attacking Edge**: ${team1Name}'s attack is likely to challenge ${team2Name}'s defense successfully.`;
    } else if (advancedStats.team2AttackStrength > advancedStats.team1DefenseStrength + 0.3) {
        scoringFactor = `**Attacking Edge**: ${team2Name}'s attack should pose significant problems for ${team1Name}'s defense.`;
    } else if (advancedStats.team1DefenseStrength > advancedStats.team2AttackStrength + 0.3) {
        scoringFactor = `**Defensive Edge**: ${team1Name}'s defense is likely to contain ${team2Name}'s attack effectively.`;
    } else if (advancedStats.team2DefenseStrength > advancedStats.team1AttackStrength + 0.3) {
        scoringFactor = `**Defensive Edge**: ${team2Name}'s defensive solidity will make it difficult for ${team1Name} to score.`;
    }
    
    // Compile all factors (excluding empty ones)
    const allFactors = [locationFactor, formComparison, rankingFactor, importanceFactor, scoringFactor]
        .filter(factor => factor !== "");
    
    return allFactors.join('\n\n');
}

// Generate score prediction
function generateScorePrediction(results, features) {
    const { scores, probabilities } = results;
    
    // Most likely score
    const mostLikelyScore = scores.mostLikelyScore;
    
    // Other likely scores
    const otherScores = scores.mostCommonScores.slice(1, 4);
    
    // Clean sheet probabilities
    const team1CleanSheetProbText = `${team1Name} clean sheet: ${Math.round(results.insights?.cleanSheetProbabilities?.team1 || 0)}%`;
    const team2CleanSheetProbText = `${team2Name} clean sheet: ${Math.round(results.insights?.cleanSheetProbabilities?.team2 || 0)}%`;
    
    // Generate over/under analysis
    let overUnderAnalysis = "";
    if (totalLine > 0) {
        if (probabilities.overProb > 70) {
            overUnderAnalysis = `The Over ${totalLine} bet has a strong probability (${probabilities.overProb.toFixed(0)}%) based on the scoring tendencies of both teams.`;
        } else if (probabilities.underProb > 70) {
            overUnderAnalysis = `The Under ${totalLine} bet looks favorable (${probabilities.underProb.toFixed(0)}%) given the likely defensive nature of this match.`;
        } else {
            overUnderAnalysis = `The Over/Under ${totalLine} line is balanced with the Over at ${probabilities.overProb.toFixed(0)}% and Under at ${probabilities.underProb.toFixed(0)}%.`;
        }
    }
    
    // Generate spread analysis
    let spreadAnalysis = "";
    if (pointSpread > 0) {
        const favoriteTeam = spreadDirection === 'team1' ? team1Name : team2Name;
        const underdogTeam = spreadDirection === 'team1' ? team2Name : team1Name;
        
        if (probabilities.favoriteCoversProb > 65) {
            spreadAnalysis = `${favoriteTeam} is likely to cover the ${pointSpread} spread (${probabilities.favoriteCoversProb.toFixed(0)}% probability).`;
        } else if (probabilities.underdogCoversProb > 65) {
            spreadAnalysis = `${underdogTeam} has a good chance (${probabilities.underdogCoversProb.toFixed(0)}%) of covering the ${pointSpread} spread.`;
        } else {
            spreadAnalysis = `The ${pointSpread} spread appears balanced with ${favoriteTeam} covering at ${probabilities.favoriteCoversProb.toFixed(0)}% and ${underdogTeam} at ${probabilities.underdogCoversProb.toFixed(0)}%.`;
        }
    }
    
    // Check if most likely score is available
    if (!mostLikelyScore) {
        return `Based on the simulations, a specific score prediction cannot be made with confidence, but the average projected score is approximately ${scores.avgTeam1Goals.toFixed(1)}-${scores.avgTeam2Goals.toFixed(1)}.\n\n${overUnderAnalysis}\n\n${spreadAnalysis}`;
    }
    
    // Build prediction text
    return `
The most likely score based on our simulations is **${mostLikelyScore.team1Score}-${mostLikelyScore.team2Score}** (${mostLikelyScore.probability.toFixed(1)}% probability).

Other likely scorelines include:
${otherScores.map(score => `- ${score.team1Score}-${score.team2Score} (${score.probability.toFixed(1)}%)`).join('\n')}

Clean sheet probabilities:
- ${team1CleanSheetProbText}
- ${team2CleanSheetProbText}

${overUnderAnalysis}

${spreadAnalysis}
`;
}

// Generate match context analysis
function generateMatchContextAnalysis(features) {
    const { basicStats } = features;
    
    // Location context
    let locationContext = "";
    if (basicStats.locationFactor === 1) {
        locationContext = `This match will be played at ${team1Name}'s home venue, which typically provides them with a significant advantage.`;
    } else if (basicStats.locationFactor === -1) {
        locationContext = `The match will be held at ${team2Name}'s home ground, giving them the home advantage.`;
    } else {
        locationContext = "The match will be played at a neutral venue, eliminating any home advantage for either team.";
    }
    
    // Match importance context
    let importanceContext = "";
    if (basicStats.matchImportance > 1.3) {
        importanceContext = "This is a high-priority match with significant stakes for both teams.";
    } else if (basicStats.matchImportance > 1) {
        importanceContext = "The match has above-average importance in the context of the season.";
    } else if (basicStats.matchImportance < 0.8) {
        importanceContext = "This is a relatively low-stakes encounter for both teams.";
    } else {
        importanceContext = "The match has standard importance within the season's context.";
    }
    
    // Formation context if available
    let formationContext = "";
    if (team1Formation !== 'default' && team2Formation !== 'default') {
        formationContext = `${team1Name} is expected to line up in a ${team1Formation} formation, while ${team2Name} is likely to employ a ${team2Formation} setup.`;
    }
    
    // Data quality context
    let dataQualityContext = "";
    const totalMatches = getTotalMatchCount();
    if (totalMatches >= MIN_MATCHES_FOR_EXCELLENT_ANALYSIS && matchData.h2h.length >= MIN_H2H_MATCHES) {
        dataQualityContext = `This analysis is based on an excellent dataset with ${totalMatches} total matches, including ${matchData.h2h.length} direct head-to-head encounters.`;
    } else if (totalMatches >= MIN_MATCHES_FOR_GOOD_ANALYSIS) {
        dataQualityContext = `This analysis is based on a good dataset with ${totalMatches} total matches, including ${matchData.h2h.length} direct head-to-head encounters.`;
    } else {
        dataQualityContext = `This analysis is based on a limited dataset with only ${totalMatches} total matches, including ${matchData.h2h.length} direct head-to-head encounters. Results should be interpreted with caution.`;
    }
    
    return `
${locationContext}

${importanceContext}

${formationContext}

${dataQualityContext}
`;
}

// Calculate feature importance
function calculateFeatureImportance(features, results) {
    // Calculate importance scores for different factors
    const h2hImportance = features.dataQuality.h2hMatches >= MIN_H2H_MATCHES ? 
        Math.abs(features.basicStats.h2hAdvantage) * 100 : 30;
    
    const formImportance = Math.abs(features.advancedStats.team1RecentForm - 
                                    features.advancedStats.team2RecentForm) * 100;
    
    const attackImportance = Math.abs(features.advancedStats.team1AttackStrength - 
                                     features.advancedStats.team2AttackStrength) * 50;
    
    const defenseImportance = Math.abs(features.advancedStats.team1DefenseStrength - 
                                      features.advancedStats.team2DefenseStrength) * 50;
    
    const locationImportance = features.basicStats.locationFactor !== 0 ? 
        Math.abs(features.basicStats.locationFactor) * 60 : 20;
    
    const rankingImportance = team1Ranking > 0 && team2Ranking > 0 ? 
        Math.min(100, Math.abs(team1Ranking - team2Ranking) * 2) : 20;
    
    const formationImportance = team1Formation !== 'default' && team2Formation !== 'default' ?
        60 : 30;
    
    const matchImportanceScore = features.basicStats.matchImportance !== 1 ?
        Math.abs(features.basicStats.matchImportance - 1) * 50 : 20;
    
    // Ensure all values are between 10 and 100
    const normalizeImportance = (value) => Math.max(10, Math.min(100, value));
    
    // Create importance object
    const importanceScores = {
        'Head-to-Head History': normalizeImportance(h2hImportance),
        'Recent Form': normalizeImportance(formImportance),
        'Attacking Strength': normalizeImportance(attackImportance),
        'Defensive Solidity': normalizeImportance(defenseImportance),
        'Location Factor': normalizeImportance(locationImportance),
        'Team Ranking': normalizeImportance(rankingImportance),
        'Tactical Formation': normalizeImportance(formationImportance),
        'Match Importance': normalizeImportance(matchImportanceScore)
    };
    
    // Sort by importance (highest first)
    const sortedImportance = {};
    Object.entries(importanceScores)
        .sort((a, b) => b[1] - a[1])
        .forEach(([key, value]) => {
            sortedImportance[key] = value;
        });
    
    return sortedImportance;
}

// Calculate standard feature importance (for non-enhanced analysis)
function calculateStandardFeatureImportance(features) {
    // Similar to calculateFeatureImportance but with fewer factors
    const h2hImportance = features.dataQuality.h2hMatches >= MIN_H2H_MATCHES ? 
        Math.abs(features.basicStats.h2hAdvantage) * 100 : 30;
    
    const formImportance = Math.abs(features.advancedStats.team1RecentForm - 
                                    features.advancedStats.team2RecentForm) * 100;
    
    const attackImportance = Math.abs(features.advancedStats.team1AttackStrength - 
                                     features.advancedStats.team2AttackStrength) * 50;
    
    const defenseImportance = Math.abs(features.advancedStats.team1DefenseStrength - 
                                      features.advancedStats.team2DefenseStrength) * 50;
    
    const locationImportance = features.basicStats.locationFactor !== 0 ? 
        Math.abs(features.basicStats.locationFactor) * 60 : 20;
    
    // Ensure all values are between 10 and 100
    const normalizeImportance = (value) => Math.max(10, Math.min(100, value));
    
    // Create importance object
    const importanceScores = {
        'Head-to-Head History': normalizeImportance(h2hImportance),
        'Recent Form': normalizeImportance(formImportance),
        'Attacking Strength': normalizeImportance(attackImportance),
        'Defensive Solidity': normalizeImportance(defenseImportance),
        'Location Factor': normalizeImportance(locationImportance)
    };
    
    // Sort by importance (highest first)
    const sortedImportance = {};
    Object.entries(importanceScores)
        .sort((a, b) => b[1] - a[1])
        .forEach(([key, value]) => {
            sortedImportance[key] = value;
        });
    
    return sortedImportance;
}

// Update UI with analysis results
function updateUI(results, features, insights, analysis) {
    // Update winner prediction
    updateWinnerPrediction(results.probabilities);
    
    // Update score prediction
    const predictedScore = results.scores.mostLikelyScore || 
        {team1Score: Math.round(results.scores.avgTeam1Goals), 
         team2Score: Math.round(results.scores.avgTeam2Goals)};
         
    updateScorePrediction(predictedScore.team1Score, predictedScore.team2Score, 
                         results.scores.avgTotalGoals, totalLine);
    
    // Update betting recommendations
    updateBettingRecommendations(results, insights);
    
    // Update analysis explanation
    updateAnalysisExplanation(analysis);
    
    // Create/update charts
    createWinProbabilityChart(results.probabilities);
    createScoreDistributionChart(results.scores.scoreDistribution);
    createFeatureImportanceChart(featureImportanceScores);
    
    if (ENHANCED_MODE) {
        createGoalDistributionChart(insights.goalDistribution);
    }
}

// Update winner prediction UI
function updateWinnerPrediction(probabilities) {
    let winnerText, winnerProb, winnerClass;
    
    if (probabilities.team1WinProb > probabilities.team2WinProb && 
        probabilities.team1WinProb > probabilities.drawProb) {
        winnerText = team1Name;
        winnerProb = probabilities.team1WinProb;
        winnerClass = 'team1-winner';
    } else if (probabilities.team2WinProb > probabilities.team1WinProb && 
               probabilities.team2WinProb > probabilities.drawProb) {
        winnerText = team2Name;
        winnerProb = probabilities.team2WinProb;
        winnerClass = 'team2-winner';
    } else {
        winnerText = 'Draw';
        winnerProb = probabilities.drawProb;
        winnerClass = 'draw-winner';
    }
    
    document.getElementById('winner-name').textContent = winnerText;
    document.getElementById('winner-probability').textContent = `${winnerProb.toFixed(1)}%`;
    document.getElementById('winner-prediction').className = `prediction-result ${winnerClass}`;
    
    // Update detailed probabilities
    document.getElementById('team1-win-prob').textContent = `${probabilities.team1WinProb.toFixed(1)}%`;
    document.getElementById('team2-win-prob').textContent = `${probabilities.team2WinProb.toFixed(1)}%`;
    document.getElementById('draw-prob').textContent = `${probabilities.drawProb.toFixed(1)}%`;
    
    // Update probability bars
    document.getElementById('team1-prob-bar').style.width = `${probabilities.team1WinProb}%`;
    document.getElementById('team2-prob-bar').style.width = `${probabilities.team2WinProb}%`;
}

// Update score prediction UI
function updateScorePrediction(team1Score, team2Score, totalGoals, overUnderLine) {
    document.getElementById('predicted-score').textContent = `${team1Score} - ${team2Score}`;
    document.getElementById('total-goals').textContent = totalGoals.toFixed(1);
    
    if (overUnderLine > 0) {
        const overUnderText = totalGoals > overUnderLine ? 
            `Over ${overUnderLine}` : `Under ${overUnderLine}`;
        document.getElementById('over-under-prediction').textContent = overUnderText;
    } else {
        document.getElementById('over-under-prediction').textContent = 'No line set';
    }
}

// Update betting recommendations UI
function updateBettingRecommendations(results, insights) {
    const { probabilities } = results;
    const container = document.getElementById('betting-recommendation');
    
    // Prepare recommendations
    const recommendations = [];
    
    // Match outcome recommendation
    const maxOutcomeProb = Math.max(
        probabilities.team1WinProb,
        probabilities.team2WinProb,
        probabilities.drawProb
    );
    
    if (maxOutcomeProb > 60) {
        let selectionText, probability;
        
        if (maxOutcomeProb === probabilities.team1WinProb) {
            selectionText = `${team1Name} to Win`;
            probability = probabilities.team1WinProb;
        } else if (maxOutcomeProb === probabilities.team2WinProb) {
            selectionText = `${team2Name} to Win`;
            probability = probabilities.team2WinProb;
        } else {
            selectionText = 'Draw';
            probability = probabilities.drawProb;
        }
        
        recommendations.push({
            type: 'Match Outcome',
            selection: selectionText,
            probability: probability,
            strength: getRecommendationStrength(probability)
        });
    }
    
    // Over/Under recommendation
    if (totalLine > 0) {
        const overProb = probabilities.overProb;
        const underProb = probabilities.underProb;
        
        if (overProb > 65 || underProb > 65) {
            const betterOption = overProb > underProb ? 'Over' : 'Under';
            const probability = Math.max(overProb, underProb);
            
            recommendations.push({
                type: 'Total Goals',
                selection: `${betterOption} ${totalLine}`,
                probability: probability,
                strength: getRecommendationStrength(probability)
            });
        }
    }
    
    // Spread recommendation
    if (pointSpread > 0) {
        const favoriteProb = probabilities.favoriteCoversProb;
        const underdogProb = probabilities.underdogCoversProb;
        
        if (favoriteProb > 60 || underdogProb > 60) {
            const betterOption = favoriteProb > underdogProb ? 'Favorite' : 'Underdog';
            const probability = Math.max(favoriteProb, underdogProb);
            const favoriteTeam = spreadDirection === 'team1' ? team1Name : team2Name;
            const underdogTeam = spreadDirection === 'team1' ? team2Name : team1Name;
            const teamName = betterOption === 'Favorite' ? favoriteTeam : underdogTeam;
            
            recommendations.push({
                type: 'Point Spread',
                selection: `${teamName} ${betterOption === 'Favorite' ? `-${pointSpread}` : `+${pointSpread}`}`,
                probability: probability,
                strength: getRecommendationStrength(probability)
            });
        }
    }
    
    // Both teams to score recommendation (if available)
    if (insights && insights.bttsProb !== undefined) {
        const bttsProb = insights.bttsProb;
        const noBttsProb = 100 - bttsProb;
        
        if (bttsProb > 70 || noBttsProb > 70) {
            const betterOption = bttsProb > noBttsProb ? 'Yes' : 'No';
            const probability = Math.max(bttsProb, noBttsProb);
            
            recommendations.push({
                type: 'Both Teams to Score',
                selection: betterOption,
                probability: probability,
                strength: getRecommendationStrength(probability)
            });
        }
    }
    
    // Build recommendation HTML
    if (recommendations.length === 0) {
        container.innerHTML = `
            <div class="no-recommendations">
                <span class="material-symbols-outlined">info</span>
                <p>No strong betting recommendations found for this match.</p>
            </div>
        `;
        return;
    }
    
    // Sort recommendations by strength
    recommendations.sort((a, b) => {
        const strengthValues = {
            'Strong': 3,
            'Moderate': 2,
            'Slight': 1
        };
        return strengthValues[b.strength] - strengthValues[a.strength];
    });
    
    // Create recommendation cards
    const recommendationCards = recommendations.map(rec => `
        <div class="recommendation-item ${rec.strength.toLowerCase()}-strength">
            <div class="recommendation-header">
                <span class="recommendation-type">${rec.type}</span>
                <span class="recommendation-strength">${rec.strength}</span>
            </div>
            <div class="recommendation-selection">${rec.selection}</div>
            <div class="recommendation-probability">${rec.probability.toFixed(1)}% probability</div>
        </div>
    `).join('');
    
    // Update container
    container.innerHTML = `
        <h4>Betting Recommendations</h4>
        <div class="recommendations-list">
            ${recommendationCards}
        </div>
    `;
}

// Helper to get recommendation strength based on probability
function getRecommendationStrength(probability) {
    if (probability >= 70) return 'Strong';
    if (probability >= 60) return 'Moderate';
    return 'Slight';
}

// Update analysis explanation UI
function updateAnalysisExplanation(analysis) {
    // Create sections HTML
    const sectionsHTML = analysis.sections.map(section => `
        <div class="analysis-section">
            <h4>${section.title}</h4>
            <div class="section-content">${convertMarkdownToHTML(section.content)}</div>
        </div>
    `).join('');
    
    // Create final HTML
    const analysisHTML = `
        <div class="analysis-header">
            <h3>${analysis.title}</h3>
            <p>${convertMarkdownToHTML(analysis.summary)}</p>
        </div>
        
        <div class="analysis-sections">
            ${sectionsHTML}
        </div>
    `;
    
    // Update container
    document.getElementById('analysis-explanation').innerHTML = analysisHTML;
}

// Helper to convert markdown to simple HTML
function convertMarkdownToHTML(markdown) {
    if (!markdown) return '';
    
    // Convert bold text (** **)
    let html = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert italics
    html = html.replace(/\_(.*?)\_/g, '<em>$1</em>');
    
    // Convert lists
    html = html.replace(/^\s*-\s+(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)\s*(<li>.*?<\/li>)/g, '$1$2');
    html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>    // Data quality context
    let dataQualityContext = "";
    const totalMatches = getTotalMatchCount();
    if (totalMatches >= MIN_MATCHES_FOR_EXCELLENT_ANALYSIS && matchData.h2h.length >= MIN_H2H_MATCHES) {
        dataQualityContext = `This analysis is</ul>');
    
    // Convert paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/^(.+)$/m, '<p>$1</p>');
    
    return html;
}

// Create win probability chart
function createWinProbabilityChart(probabilities) {
    // Destroy previous chart if it exists
    if (winProbabilityChart) {
        winProbabilityChart.destroy();
    }
    
    const ctx = document.getElementById('win-probability-chart').getContext('2d');
    
    winProbabilityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [team1Name, team2Name, 'Draw'],
            datasets: [{
                data: [
                    probabilities.team1WinProb,
                    probabilities.team2WinProb,
                    probabilities.drawProb
                ],
                backgroundColor: [
                    'rgba(66, 133, 244, 0.8)',
                    'rgba(234, 67, 53, 0.8)',
                    'rgba(95, 99, 104, 0.8)'
                ],
                borderColor: [
                    'rgba(66, 133, 244, 1)',
                    'rgba(234, 67, 53, 1)',
                    'rgba(95, 99, 104, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                },
                title: {
                    display: true,
                    text: 'Match Outcome Probabilities',
                    padding: {
                        bottom: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw.toFixed(1)}%`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Create score distribution chart
function createScoreDistributionChart(scoreDistribution) {
    // Destroy previous chart if it exists
    if (scoringDistributionChart) {
        scoringDistributionChart.destroy();
    }
    
    const ctx = document.getElementById('score-distribution-chart').getContext('2d');
    
    scoringDistributionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({length: scoreDistribution.length}, (_, i) => String(i)),
            datasets: [{
                label: 'Probability (%)',
                data: scoreDistribution,
                backgroundColor: 'rgba(52, 168, 83, 0.7)',
                borderColor: 'rgba(52, 168, 83, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Probability (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Total Goals'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Score Distribution',
                    padding: {
                        bottom: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw.toFixed(1)}% chance of ${context.label} goals`;
                        }
                    }
                }
            }
        }
    });
}

// Create feature importance chart
function createFeatureImportanceChart(featureImportance) {
    // Destroy previous chart if it exists
    if (modelConfidenceChart) {
        modelConfidenceChart.destroy();
    }
    
    const ctx = document.getElementById('model-confidence-chart').getContext('2d');
    
    // Get top 6 features
    const features = Object.keys(featureImportance).slice(0, 6);
    const importanceValues = features.map(feature => featureImportance[feature]);
    
    modelConfidenceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: features,
            datasets: [{
                label: 'Importance (%)',
                data: importanceValues,
                backgroundColor: 'rgba(66, 133, 244, 0.7)',
                borderColor: 'rgba(66, 133, 244, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Importance (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Key Factors Importance',
                    padding: {
                        bottom: 15
                    }
                }
            }
        }
    });
}

// Create goal distribution chart (enhanced feature)
function createGoalDistributionChart(goalDistribution) {
    // Check if the chart container exists
    if (!document.getElementById('goal-distribution-chart')) {
        // Create container
        const chartCard = document.createElement('div');
        chartCard.className = 'chart-card';
        chartCard.innerHTML = `
            <h3>Team Scoring Distribution</h3>
            <div class="chart-container">
                <canvas id="goal-distribution-chart"></canvas>
            </div>
        `;
        
        // Find the charts section and append
        const chartsSection = document.querySelector('.result-charts');
        if (chartsSection) {
            chartsSection.appendChild(chartCard);
        }
    }
    
    // Destroy previous chart if it exists
    if (performanceTrendChart) {
        performanceTrendChart.destroy();
    }
    
    const ctx = document.getElementById('goal-distribution-chart').getContext('2d');
    
    // Prepare data
    const labels = Array.from({length: 7}, (_, i) => i === 6 ? '6+' : String(i));
    
    performanceTrendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: team1Name,
                    data: goalDistribution.team1,
                    backgroundColor: 'rgba(66, 133, 244, 0.7)',
                    borderColor: 'rgba(66, 133, 244, 1)',
                    borderWidth: 1
                },
                {
                    label: team2Name,
                    data: goalDistribution.team2,
                    backgroundColor: 'rgba(234, 67, 53, 0.7)',
                    borderColor: 'rgba(234, 67, 53, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Probability (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Goals Scored'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Goals Distribution by Team',
                    padding: {
                        bottom: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(1)}% chance of scoring ${context.label} goals`;
                        }
                    }
                }
            }
        }
    });
}

// Calculate basic insights (for standard analysis)
function calculateBasicInsights(features, results) {
    return {
        bttsProb: calculateBttsProb(features)
    };
}

// Calculate BTTS probability based on team scoring/conceding averages
function calculateBttsProb(features) {
    const { basicStats } = features;
    
    const team1ScoresProb = Math.min(0.95, basicStats.team1AvgScore / (basicStats.team1AvgScore + 1));
    const team2ScoresProb = Math.min(0.95, basicStats.team2AvgScore / (basicStats.team2AvgScore + 1));
    
    return team1ScoresProb * team2ScoresProb * 100;
}

// Run standard prediction model
function runStandardModel(features) {
    const { basicStats, advancedStats } = features;
    
    // Calculate team1 advantage
    const team1Advantage = calculateTeam1Advantage(features);
    
    // Convert advantage to win probabilities
    const team1WinProb = 50 + (50 * (2 / (1 + Math.exp(-team1Advantage)) - 1));
    const team2WinProb = 50 + (50 * (2 / (1 + Math.exp(team1Advantage)) - 1));
    
    // Calculate draw probability
    const scoringRate = basicStats.team1AvgScore + basicStats.team2AvgScore;
    const strengthDifference = Math.abs(team1WinProb - team2WinProb);
    
    let baseDrawRate = 30 - (scoringRate * 4);
    const drawReduction = strengthDifference * 0.3;
    let drawProb = Math.max(5, Math.min(40, baseDrawRate - drawReduction));
    
    // Normalize probabilities
    let adjustedTeam1WinProb = team1WinProb * (1 - drawProb / 100);
    let adjustedTeam2WinProb = team2WinProb * (1 - drawProb / 100);
    
    const total = adjustedTeam1WinProb + adjustedTeam2WinProb + drawProb;
    const probabilities = {
        team1WinProb: (adjustedTeam1WinProb / total) * 100,
        team2WinProb: (adjustedTeam2WinProb / total) * 100,
        drawProb: (drawProb / total) * 100,
        overProb: calculateOverProb(features, totalLine),
        underProb: calculateUnderProb(features, totalLine),
        pushProb: 0
    };
    
    // Calculate projected total and scores
    const projectedTotal = calculateProjectedTotal(features);
    const team1ExpectedGoals = (projectedTotal / 2) + (team1Advantage / 4);
    const team2ExpectedGoals = (projectedTotal / 2) - (team1Advantage / 4);
    
    // Generate common scores based on Poisson distribution
    const commonScores = generateLikelyScores(team1ExpectedGoals, team2ExpectedGoals);
    
    // Calculate score distribution
    const scoreDistribution = calculateScoreDistribution(team1ExpectedGoals, team2ExpectedGoals);
    
    return {
        probabilities,
        scores: {
            avgTeam1Goals: team1ExpectedGoals,
            avgTeam2Goals: team2ExpectedGoals,
            avgTotalGoals: projectedTotal,
            mostCommonScores: commonScores,
            mostLikelyScore: commonScores[0],
            scoreDistribution
        },
        insights: {
            bttsProb: calculateBttsProb(features)
        }
    };
}

// Calculate team1 advantage (standard version)
function calculateTeam1Advantage(features) {
    const { basicStats, advancedStats } = features;
    
    // Base advantage from attack vs defense
    const attackDifference = (
        (advancedStats.team1AttackStrength - advancedStats.team2DefenseStrength) -
        (advancedStats.team2AttackStrength - advancedStats.team1DefenseStrength)
    );
    
    let advantageCoefficient = 
        attackDifference * WEIGHTS.OVERALL_PERFORMANCE +
        (advancedStats.team1RecentForm - advancedStats.team2RecentForm) * WEIGHTS.RECENT_FORM +
        (basicStats.h2hAdvantage || 0) * WEIGHTS.H2H_MATCHES;
    
    // Add location factor
    if (basicStats.locationFactor !== 0) {
        advantageCoefficient += basicStats.locationFactor * WEIGHTS.HOME_ADVANTAGE * 
            (basicStats.locationFactor > 0 ? 1 : 0.8); // Home advantage is stronger than away disadvantage
    }
    
    // Add formation advantage if available
    if (team1Formation !== 'default' && team2Formation !== 'default' && 
        ENHANCED_FEATURES.FORMATION_ANALYSIS) {
        const formationAdjustments = calculateFormationAdjustments(team1Formation, team2Formation);
        advantageCoefficient += formationAdjustments.team1TacticalAdvantage * WEIGHTS.FORMATION_COMPATIBILITY;
    }
    
    // Add ranking factor
    if (team1Ranking > 0 && team2Ranking > 0) {
        const rankingDiff = team2Ranking - team1Ranking; // Lower number is better ranking
        const normalizedRankingDiff = Math.max(-1, Math.min(1, rankingDiff / 20)); // Normalize to [-1, 1]
        advantageCoefficient += normalizedRankingDiff * WEIGHTS.RANKING;
    }
    
    return advantageCoefficient;
}

// Calculate projected total (standard version)
function calculateProjectedTotal(features) {
    const { basicStats, advancedStats } = features;
    
    // Base total from historical averages
    let baseTotal = (
        basicStats.team1AvgScore + 
        basicStats.team2AvgScore + 
        basicStats.team1AvgConceded + 
        basicStats.team2AvgConceded
    ) / 2;
    
    // Adjust for head-to-head history if available
    if (matchData.h2h.length >= 2) {
        const h2hAvgTotal = matchData.h2h.reduce((sum, match) => sum + match.totalScore, 0) / 
                           matchData.h2h.length;
        const h2hWeight = Math.min(0.4, matchData.h2h.length * 0.08);
        baseTotal = baseTotal * (1 - h2hWeight) + h2hAvgTotal * h2hWeight;
    }
    
    // Adjust for importance - higher importance often means fewer goals
    if (basicStats.matchImportance > 1.2) {
        baseTotal -= (basicStats.matchImportance - 1.2) * 0.5;
    } else if (basicStats.matchImportance < 0.8) {
        baseTotal += (0.8 - basicStats.matchImportance) * 0.5; // Less important = more goals
    }
    
    // Formation adjustments
    if (team1Formation !== 'default' && team2Formation !== 'default' && 
        ENHANCED_FEATURES.FORMATION_ANALYSIS) {
        const formationAdjustments = calculateFormationAdjustments(team1Formation, team2Formation);
        
        // More attacking formations = more goals
        const attackingFactor = (formationAdjustments.team1OffensiveAdjustment + 
                                formationAdjustments.team2OffensiveAdjustment) / 2;
        baseTotal += attackingFactor * 0.5;
    }
    
    return Math.max(0.5, baseTotal);
}

// Calculate over probability for a given line
function calculateOverProb(features, line) {
    if (line <= 0) return 50;
    
    const projectedTotal = calculateProjectedTotal(features);
    
    // Use Poisson distribution to calculate probability
    let overProb = 0;
    const lambda = projectedTotal;
    
    for (let i = Math.ceil(line); i < 20; i++) {
        overProb += (Math.pow(lambda, i) * Math.exp(-lambda)) / factorial(i);
    }
    
    return overProb * 100;
}

// Calculate under probability for a given line
function calculateUnderProb(features, line) {
    if (line <= 0) return 50;
    
    const projectedTotal = calculateProjectedTotal(features);
    
    // Use Poisson distribution to calculate probability
    let underProb = 0;
    const lambda = projectedTotal;
    
    for (let i = 0; i <= Math.floor(line); i++) {
        underProb += (Math.pow(lambda, i) * Math.exp(-lambda)) / factorial(i);
    }
    
    return underProb * 100;
}

// Generate likely scores using Poisson distribution
function generateLikelyScores(team1Lambda, team2Lambda) {
    const scores = [];
    
    // Calculate probabilities for scores up to 4-4
    for (let i = 0; i <= 4; i++) {
        for (let j = 0; j <= 4; j++) {
            const probability = poissonProbability(i, team1Lambda) * 
                              poissonProbability(j, team2Lambda);
            
            scores.push({
                team1Score: i,
                team2Score: j,
                probability: probability * 100
            });
        }
    }
    
    // Sort by probability (highest first)
    scores.sort((a, b) => b.probability - a.probability);
    
    // Return top 5 most likely scores
    return scores.slice(0, 5);
}

// Calculate Poisson probability
function poissonProbability(k, lambda) {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

// Calculate factorial
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Calculate score distribution for standard analysis
function calculateScoreDistribution(team1Lambda, team2Lambda) {
    const distribution = Array(10).fill(0);
    
    // Calculate probabilities for total goals
    for (let i = 0; i < distribution.length; i++) {
        for (let team1Goals = 0; team1Goals <= i; team1Goals++) {
            const team2Goals = i - team1Goals;
            distribution[i] += poissonProbability(team1Goals, team1Lambda) * 
                             poissonProbability(team2Goals, team2Lambda);
        }
        distribution[i] *= 100; // Convert to percentage
    }
    
    return distribution;
}

// Generate basic analysis text (for standard analysis)
function generateBasicAnalysis(results, features) {
    return {
        title: `Analysis: ${team1Name} vs ${team2Name}`,
        summary: generateBasicSummary(results, features),
        sections: [
            {
                title: "Team Performances",
                content: generateBasicTeamPerformance(features)
            },
            {
                title: "Head-to-Head",
                content: generateBasicHeadToHead(features)
            },
            {
                title: "Match Factors",
                content: generateBasicMatchFactors(features)
            },
            {
                title: "Prediction",
                content: generateBasicPrediction(results)
            }
        ]
    };
}

// Generate summary for basic analysis
function generateBasicSummary(results, features) {
    const { probabilities, scores } = results;
    
    // Determine the predicted winner
    let winnerText, winnerProb;
    if (probabilities.team1WinProb > probabilities.team2WinProb && 
        probabilities.team1WinProb > probabilities.drawProb) {
        winnerText = team1Name;
        winnerProb = probabilities.team1WinProb;
    } else if (probabilities.team2WinProb > probabilities.team1WinProb && 
               probabilities.team2WinProb > probabilities.drawProb) {
        winnerText = team2Name;
        winnerProb = probabilities.team2WinProb;
    } else {
        winnerText = "A draw";
        winnerProb = probabilities.drawProb;
    }
    
    // Get location text
    let locationText = "neutral venue";
    if (features.basicStats.locationFactor === 1) {
        locationText = `${team1Name}'s home venue`;
    } else if (features.basicStats.locationFactor === -1) {
        locationText = `${team2Name}'s home venue`;
    }
    
    return `Based on statistical analysis, ${winnerText} is favored to win with a ${winnerProb.toFixed(1)}% probability. The most likely score is ${scores.mostLikelyScore.team1Score}-${scores.mostLikelyScore.team2Score}. This match will be played at ${locationText}.`;
}

// Generate basic team performance text
function generateBasicTeamPerformance(features) {
    const { basicStats, advancedStats } = features;
    
    return `
${team1Name} has averaged ${basicStats.team1AvgScore.toFixed(1)} goals scored and ${basicStats.team1AvgConceded.toFixed(1)} conceded per match. Their recent form rating is ${(advancedStats.team1RecentForm * 10).toFixed(1)}/10.

${team2Name} has averaged ${basicStats.team2AvgScore.toFixed(1)} goals scored and ${basicStats.team2AvgConceded.toFixed(1)} conceded per match. Their recent form rating is ${(advancedStats.team2RecentForm * 10).toFixed(1)}/10.
`;
}

// Generate basic head-to-head text
function generateBasicHeadToHead(features) {
    if (matchData.h2h.length === 0) {
        return `There is no head-to-head data available between these teams.`;
    }
    
    // Calculate head-to-head stats
    let team1Wins = 0, team2Wins = 0, draws = 0;
    let team1Goals = 0, team2Goals = 0;
    
    matchData.h2h.forEach(match => {
        team1Goals += match.team1Score;
        team2Goals += match.team2Score;
        
        if (match.team1Score > match.team2Score) {
            team1Wins++;
        } else if (match.team1Score < match.team2Score) {
            team2Wins++;
        } else {
            draws++;
        }
    });
    
    return `
In ${matchData.h2h.length} previous meetings, ${team1Name} has won ${team1Wins} times, ${team2Name} has won ${team2Wins} times, and ${draws} matches ended in a draw.

The average score in head-to-head matches has been ${(team1Goals / matchData.h2h.length).toFixed(1)}-${(team2Goals / matchData.h2h.length).toFixed(1)}.
`;
}

// Generate basic match factors text
function generateBasicMatchFactors(features) {
    const { basicStats } = features;
    
    // Location factor
    let locationText = "";
    if (basicStats.locationFactor === 1) {
        locationText = `${team1Name} playing at home gives them an advantage.`;
    } else if (basicStats.locationFactor === -1) {
        locationText = `${team2Name} has the home advantage in this match.`;
    } else {
        locationText = "This match is at a neutral venue with no home advantage.";
    }
    
    // Rankings if available
    let rankingText = "";
    if (team1Ranking > 0 && team2Ranking > 0) {
        if (Math.abs(team1Ranking - team2Ranking) < 5) {
            rankingText = `The teams are similarly ranked (${team1Name} #${team1Ranking}, ${team2Name} #${team2Ranking}).`;
        } else if (team1Ranking < team2Ranking) {
            rankingText = `${team1Name} (#${team1Ranking}) is ranked higher than ${team2Name} (#${team2Ranking}).`;
        } else {
            rankingText = `${team2Name} (#${team2Ranking}) has a better ranking than ${team1Name} (#${team1Ranking}).`;
        }
    }
    
    // Match importance
    let importanceText = "";
    if (basicStats.matchImportance > 1.2) {
        importanceText = "This is an important match that may affect how the teams approach the game.";
    } else if (basicStats.matchImportance < 0.8) {
        importanceText = "This is a less important match which could lead to more open play.";
    }
    
    // Combine factors, filtering out empty ones
    const factors = [locationText, rankingText, importanceText].filter(text => text !== "");
    
    return factors.join('\n\n');
}

// Generate basic prediction text
function generateBasicPrediction(results) {
    const { probabilities, scores } = results;
    
    let predictionText = `The most likely score is ${scores.mostLikelyScore.team1Score}-${scores.mostLikelyScore.team2Score} (${scores.mostLikelyScore.probability.toFixed(1)}% probability).`;
    
    // Add other likely scores
    const otherScores = scores.mostCommonScores.slice(1, 4);
    if (otherScores.length > 0) {
        predictionText += `\n\nOther possible scores include:`;
        otherScores.forEach(score => {
            predictionText += `\n- ${score.team1Score}-${score.team2Score} (${score.probability.toFixed(1)}%)`;
        });
    }
    
    // Add betting line information if set
    if (totalLine > 0) {
        predictionText += `\n\nThe Over ${totalLine} probability is ${probabilities.overProb.toFixed(1)}% and the Under ${totalLine} probability is ${probabilities.underProb.toFixed(1)}%.`;
    }
    
    return predictionText;
}

// Prepare match features for analysis
function prepareMatchFeatures() {
    // Calculate basic stats for both teams
    const basicStats = calculateBasicStats();
    
    // Calculate advanced metrics
    const advancedStats = calculateAdvancedStats(basicStats);
    
    // Calculate trends
    const trends = calculateTrends();
    
    // Extract head-to-head specific data
    const h2hData = extractH2HData();
    
    // Extract team specific data
    const team1Data = extractTeamData('team1');
    const team2Data = extractTeamData('team2');
    
    // Assess data quality
    const dataQuality = assessDataQuality();
    
    return {
        basicStats,
        advancedStats,
        trends,
        h2hData,
        team1Data,
        team2Data,
        dataQuality
    };
}

// Calculate basic statistics for both teams
function calculateBasicStats() {
    // Get total match counts for validation
    const totalMatchCount = getTotalMatchCount();
    
    // Calculate basic averages for team1
    const team1Stats = calculateTeamStats('team1');
    const team2Stats = calculateTeamStats('team2');
    
    // Calculate head-to-head advantage
    const h2hAdvantage = calculateH2HAdvantage();
    
    // Get location and ranking differences
    const locationFactor = matchLocation === 'home' ? 1 : (matchLocation === 'away' ? -1 : 0);
    const rankingDiff = team1Ranking && team2Ranking ? team1Ranking - team2Ranking : 0;
    
    return {
        team1AvgScore: team1Stats.avgScore,
        team1AvgConceded: team1Stats.avgConceded,
        team2AvgScore: team2Stats.avgScore,
        team2AvgConceded: team2Stats.avgConceded,
        h2hAdvantage,
        locationFactor,
        rankingDiff,
        matchImportance,
        totalMatches: totalMatchCount
    };
}

// Calculate statistics for a specific team
function calculateTeamStats(teamKey) {
    const matches = teamKey === 'team1' ? 
        [...matchData.h2h, ...matchData.team1] : 
        [...matchData.h2h, ...matchData.team2];
    
    if (matches.length === 0) {
        return { avgScore: 0, avgConceded: 0 };
    }
    
    let totalGoalsScored = 0;
    let totalGoalsConceded = 0;
    
    matches.forEach(match => {
        if (match.category === 'h2h') {
            if (teamKey === 'team1') {
                totalGoalsScored += match.team1Score;
                totalGoalsConceded += match.team2Score;
            } else {
                totalGoalsScored += match.team2Score;
                totalGoalsConceded += match.team1Score;
            }
        } else {
            // For individual team matches (team1 or team2 category)
            totalGoalsScored += match.team1Score;
            totalGoalsConceded += match.team2Score;
        }
    });
    
    return {
        avgScore: totalGoalsScored / matches.length,
        avgConceded: totalGoalsConceded / matches.length
    };
}

// Extract head-to-head specific data
function extractH2HData() {
    if (matchData.h2h.length === 0) {
        return null;
    }
    
    let team1Wins = 0, team2Wins = 0, draws = 0;
    let team1Goals = 0, team2Goals = 0;
    let firstHalfGoals = 0, secondHalfGoals = 0;
    
    // Sort by timestamp (newest first)
    const sortedMatches = [...matchData.h2h].sort((a, b) => b.timestamp - a.timestamp);
    
    // Get data from last match
    const lastMatch = sortedMatches[0];
    const lastMatchDaysAgo = Math.floor((Date.now() - lastMatch.timestamp) / (24 * 60 * 60 * 1000));
    
    // Last match result
    let lastMatchResult = "";
    if (lastMatch.team1Score > lastMatch.team2Score) {
        lastMatchResult = `${team1Name} won ${lastMatch.team1Score}-${lastMatch.team2Score}`;
    } else if (lastMatch.team1Score < lastMatch.team2Score) {
        lastMatchResult = `${team2Name} won ${lastMatch.team2Score}-${lastMatch.team1Score}`;
    } else {
        lastMatchResult = `a ${lastMatch.team1Score}-${lastMatch.team2Score} draw`;
    }
    
    // Process all matches
    matchData.h2h.forEach(match => {
        team1Goals += match.team1Score;
        team2Goals += match.team2Score;
        
        if (match.team1Score > match.team2Score) {
            team1Wins++;
        } else if (match.team1Score < match.team2Score) {
            team2Wins++;
        } else {
            draws++;
        }
        
        // Estimate first/second half goals if enhanced data not available
        if (match.halfTimeScore) {
            firstHalfGoals += match.halfTimeScore.team1 + match.halfTimeScore.team2;
            secondHalfGoals += (match.team1Score - match.halfTimeScore.team1) + 
                              (match.team2Score - match.halfTimeScore.team2);
        } else {
            // Estimate 40% of goals in first half, 60% in second half
            const totalGoals = match.team1Score + match.team2Score;
            firstHalfGoals += totalGoals * 0.4;
            secondHalfGoals += totalGoals * 0.6;
        }
    });
    
    return {
        matchCount: matchData.h2h.length,
        team1Wins,
        team2Wins,
        draws,
        team1AvgGoals: team1Goals / matchData.h2h.length,
        team2AvgGoals: team2Goals / matchData.h2h.length,
        avgTotalGoals: (team1Goals + team2Goals) / matchData.h2h.length,
        firstHalfAvgGoals: firstHalfGoals / matchData.h2h.length,
        secondHalfAvgGoals: secondHalfGoals / matchData.h2h.length,
        lastMatchResult,
        lastMatchDaysAgo
    };
}

// Extract team specific data
function extractTeamData(teamKey) {
    const matches = teamKey === 'team1' ? matchData.team1 : matchData.team2;
    
    if (matches.length === 0) {
        return null;
    }
    
    let wins = 0, losses = 0, draws = 0;
    let firstHalfGoals = 0, secondHalfGoals = 0;
    let firstHalfStrength = 0, secondHalfStrength = 0;
    
    matches.forEach(match => {
        if (match.outcome === `${teamKey === 'team1' ? team1Name : team2Name} Wins`) {
            wins++;
        } else if (match.outcome === 'Opponent Wins') {
            losses++;
        } else {
            draws++;
        }
        
        // Estimate first/second half performance if enhanced data available
        if (match.halfTimeScore) {
            const firstHalfTeamGoals = match.halfTimeScore.team1;
            const firstHalfOpponentGoals = match.halfTimeScore.team2;
            
            const secondHalfTeamGoals = match.team1Score - firstHalfTeamGoals;
            const secondHalfOpponentGoals = match.team2Score - firstHalfOpponentGoals;
            
            firstHalfGoals += firstHalfTeamGoals + firstHalfOpponentGoals;
            secondHalfGoals += secondHalfTeamGoals + secondHalfOpponentGoals;
            
            // Calculate half performance (>0.5 means better in that half)
            if (firstHalfTeamGoals > firstHalfOpponentGoals) {
                firstHalfStrength++;
            } else if (firstHalfTeamGoals === firstHalfOpponentGoals) {
                firstHalfStrength += 0.5;
            }
            
            if (secondHalfTeamGoals > secondHalfOpponentGoals) {
                secondHalfStrength++;
            } else if (secondHalfTeamGoals === secondHalfOpponentGoals) {
                secondHalfStrength += 0.5;
            }
        } else {
            // Estimate 40% of goals in first half, 60% in second half
            const totalGoals = match.team1Score + match.team2Score;
            firstHalfGoals += totalGoals * 0.4;
            secondHalfGoals += totalGoals * 0.6;
        }
    });
    
    return {
        matchCount: matches.length,
        wins,
        losses,
        draws,
        winRate: wins / matches.length,
        firstHalfAvgGoals: firstHalfGoals / matches.length,
        secondHalfAvgGoals: secondHalfGoals / matches.length,
        firstHalfStrength: firstHalfStrength / matches.length,
        secondHalfStrength: secondHalfStrength / matches.length
    };
}

// Calculate head-to-head advantage
function calculateH2HAdvantage() {
    if (matchData.h2h.length === 0) return 0;
    
    let team1Points = 0;
    let team2Points = 0;
    
    matchData.h2h.forEach(match => {
        if (match.team1Score > match.team2Score) {
            team1Points += 3;
        } else if (match.team1Score < match.team2Score) {
            team2Points += 3;
        } else {
            team1Points += 1;
            team2Points += 1;
        }
    });
    
    const totalPoints = team1Points + team2Points;
    if (totalPoints === 0) return 0;
    
    return (team1Points - team2Points) / totalPoints;
}

// Calculate advanced statistics
function calculateAdvancedStats(basicStats) {
    // Attack and defense strength calculations
    const team1AttackStrength = calculateAttackStrength('team1', basicStats);
    const team1DefenseStrength = calculateDefenseStrength('team1', basicStats);
    const team2AttackStrength = calculateAttackStrength('team2', basicStats);
    const team2DefenseStrength = calculateDefenseStrength('team2', basicStats);
    
    // Recent form calculations
    const team1RecentForm = calculateRecentForm('team1');
    const team2RecentForm = calculateRecentForm('team2');
    
    // Momentum indices
    const team1MomentumIndex = calculateMomentumIndex('team1');
    const team2MomentumIndex = calculateMomentumIndex('team2');
    
    // Home advantage calculations
    const team1HomeAdvantage = calculateHomeAdvantage('team1');
    const team2HomeAdvantage = calculateHomeAdvantage('team2');
    
    return {
        team1AttackStrength,
        team1DefenseStrength,
        team2AttackStrength,
        team2DefenseStrength,
        team1RecentForm,
        team2RecentForm,
        team1MomentumIndex,
        team2MomentumIndex,
        team1HomeAdvantage,
        team2HomeAdvantage
    };
}

// Calculate attack strength (normalized)
function calculateAttackStrength(teamKey, basicStats) {
    const avgLeagueGoals = 2.5; // Assume average goals per team per match
    
    if (teamKey === 'team1') {
        return Math.min(2.0, Math.max(0.5, basicStats.team1AvgScore / avgLeagueGoals));
    } else {
        return Math.min(2.0, Math.max(0.5, basicStats.team2AvgScore / avgLeagueGoals));
    }
}

// Calculate defense strength (normalized)
function calculateDefenseStrength(teamKey, basicStats) {
    const avgLeagueGoals = 2.5; // Assume average goals conceded per team per match
    
    if (teamKey === 'team1') {
        return Math.min(2.0, Math.max(0.5, avgLeagueGoals / Math.max(0.1, basicStats.team1AvgConceded)));
    } else {
        return Math.min(2.0, Math.max(0.5, avgLeagueGoals / Math.max(0.1, basicStats.team2AvgConceded)));
    }
}

// Calculate recent form (weight last 5 matches more heavily)
function calculateRecentForm(teamKey) {
    const matches = teamKey === 'team1' ? 
        [...matchData.h2h, ...matchData.team1] : 
        [...matchData.h2h, ...matchData.team2];
    
    if (matches.length === 0) return 0.5;
    
    // Sort by timestamp (most recent first)
    const sortedMatches = matches.sort((a, b) => b.timestamp - a.timestamp);
    
    // Take last 5 matches or all if fewer
    const recentMatches = sortedMatches.slice(0, Math.min(5, sortedMatches.length));
    
    let formPoints = 0;
    let totalWeight = 0;
    
    recentMatches.forEach((match, index) => {
        // More weight to recent matches
        const weight = Math.pow(0.8, index);
        totalWeight += weight;
        
        // Determine match outcome
        let matchOutcome = 0.5; // Draw = 0.5 points
        
        if (match.category === 'h2h') {
            if (teamKey === 'team1') {
                if (match.team1Score > match.team2Score) matchOutcome = 1; // Win
                else if (match.team1Score < match.team2Score) matchOutcome = 0; // Loss
            } else {
                if (match.team2Score > match.team1Score) matchOutcome = 1; // Win
                else if (match.team2Score < match.team1Score) matchOutcome = 0; // Loss
            }
        } else {
            // For individual team matches
            if (match.team1Score > match.team2Score) matchOutcome = 1; // Win
            else if (match.team1Score < match.team2Score) matchOutcome = 0; // Loss
        }
        
        formPoints += matchOutcome * weight;
    });
    
    return totalWeight > 0 ? formPoints / totalWeight : 0.5;
}

// Calculate momentum index (recent form + scoring trend + defensive trend)
function calculateMomentumIndex(teamKey) {
    const recentForm = calculateRecentForm(teamKey);
    const scoringTrend = calculateScoringTrend(teamKey);
    const defensiveTrend = calculateDefensiveTrend(teamKey);
    
    // Weight: 60% form, 25% scoring trend, 15% defensive trend
    return (recentForm * 0.6) + (scoringTrend * 0.25) + (defensiveTrend * 0.15);
}

// Calculate scoring trend (are goals increasing or decreasing in recent matches?)
function calculateScoringTrend(teamKey) {
    const matches = teamKey === 'team1' ? 
        [...matchData.h2h, ...matchData.team1] : 
        [...matchData.h2h, ...matchData.team2];
    
    if (matches.length < 3) return 0.5;
    
    // Sort by timestamp (oldest first)
    const sortedMatches = matches.sort((a, b) => a.timestamp - b.timestamp);
    
    // Get goals scored in each match
    const goalsByMatch = sortedMatches.map(match => {
        if (match.category === 'h2h') {
            return teamKey === 'team1' ? match.team1Score : match.team2Score;
        } else {
            return match.team1Score;
        }
    });
    
    // Calculate simple linear trend
    const n = goalsByMatch.length;
    const xMean = (n - 1) / 2;
    const yMean = goalsByMatch.reduce((sum, goals) => sum + goals, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    goalsByMatch.forEach((goals, index) => {
        numerator += (index - xMean) * (goals - yMean);
        denominator += Math.pow(index - xMean, 2);
    });
    
    const slope = denominator !== 0 ? numerator / denominator : 0;
    
    // Convert slope to 0-1 scale (0.5 = no trend, >0.5 = improving, <0.5 = declining)
    return Math.max(0, Math.min(1, 0.5 + (slope * 0.2)));
}

// Calculate defensive trend (are goals conceded decreasing?)
function calculateDefensiveTrend(teamKey) {
    const matches = teamKey === 'team1' ? 
        [...matchData.h2h, ...matchData.team1] : 
        [...matchData.h2h, ...matchData.team2];
    
    if (matches.length < 3) return 0.5;
    
    // Sort by timestamp (oldest first)
    const sortedMatches = matches.sort((a, b) => a.timestamp - b.timestamp);
    
    // Get goals conceded in each match
    const goalsConcededByMatch = sortedMatches.map(match => {
        if (match.category === 'h2h') {
            return teamKey === 'team1' ? match.team2Score : match.team1Score;
        } else {
            return match.team2Score;
        }
    });
    
    // Calculate simple linear trend
    const n = goalsConcededByMatch.length;
    const xMean = (n - 1) / 2;
    const yMean = goalsConcededByMatch.reduce((sum, goals) => sum + goals, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    goalsConcededByMatch.forEach((goals, index) => {
        numerator += (index - xMean) * (goals - yMean);
        denominator += Math.pow(index - xMean, 2);
    });
    
    const slope = denominator !== 0 ? numerator / denominator : 0;
    
    // Convert slope to 0-1 scale (0.5 = no trend, >0.5 = improving defense (fewer goals), <0.5 = declining defense)
    // Note: negative slope is good for defense
    return Math.max(0, Math.min(1, 0.5 - (slope * 0.2)));
}

// Calculate home advantage
function calculateHomeAdvantage(teamKey) {
    // For now, return a default home advantage
    // In a real implementation, this would analyze historical home/away performance
    return 1.2; // 20% advantage
}

// Calculate trends for both teams
function calculateTrends() {
    const team1ScoringTrend = calculateScoringTrend('team1');
    const team2ScoringTrend = calculateScoringTrend('team2');
    const team1DefensiveTrend = calculateDefensiveTrend('team1');
    const team2DefensiveTrend = calculateDefensiveTrend('team2');
    
    return {
        scoring: {
            team1Trend: team1ScoringTrend,
            team2Trend: team2ScoringTrend
        },
        defensive: {
            team1Trend: team1DefensiveTrend,
            team2Trend: team2DefensiveTrend
        }
    };
}

// Assess data quality
function assessDataQuality() {
    const h2hMatches = matchData.h2h.length;
    const team1Matches = matchData.team1.length;
    const team2Matches = matchData.team2.length;
    const totalMatches = h2hMatches + team1Matches + team2Matches;
    
    const dataSufficiency = totalMatches >= MIN_MATCHES_FOR_GOOD_ANALYSIS;
    const dataExcellence = totalMatches >= MIN_MATCHES_FOR_EXCELLENT_ANALYSIS && 
                          h2hMatches >= MIN_H2H_MATCHES;
    
    return {
        totalMatches,
        h2hMatches,
        team1Matches,
        team2Matches,
        dataSufficiency,
        dataExcellence
    };
}

// Get total match count helper function
function getTotalMatchCount() {
    return matchData.h2h.length + matchData.team1.length + matchData.team2.length;
}

// Show results section
function showResults() {
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// Toast notification system
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Add icon based on type
    const icons = {
        'success': 'check_circle',
        'error': 'error',
        'warning': 'warning',
        'info': 'info',
        'enhanced': 'analytics'
    };
    
    toast.innerHTML = `
        <span class="material-symbols-outlined">${icons[type] || 'info'}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <span class="material-symbols-outlined">close</span>
        </button>
    `;
    
    // Add to container
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}