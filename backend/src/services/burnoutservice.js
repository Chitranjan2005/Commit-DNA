const { BUG_KEYWORDS } = require('../utils/keywords');
const dayjs = require('dayjs');

const containsKeyword = (text, keywords) => {
    return keywords.some(kw => text.includes(kw));
};

const calcConsistencyScore = (commitsPerDay) => {
    const counts = Object.values(commitsPerDay);
    if (counts.length <= 1) return 0;

    const mean = counts.reduce((a, b) => a + b, 0) / counts.length;

    const variance = counts.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / counts.length;


    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
    return Math.min(1, cv / 2);
};



const calcTrend = (commits, filterFn) => {
    if (commits.length < 4) return 0; // need enough data for a meaningful split

    const mid = Math.floor(commits.length / 2);
    const firstHalf = commits.slice(0, mid);
    const secondHalf = commits.slice(mid);

    const ratioFirst = firstHalf.filter(filterFn).length / firstHalf.length;
    const ratioSecond = secondHalf.filter(filterFn).length / secondHalf.length;


    const delta = ratioSecond - ratioFirst;
    return Math.max(0, Math.min(1, delta * 2));
};

const calcCommitSpike = (commitsPerDay) => {
    const counts = Object.values(commitsPerDay);
    if (counts.length <= 1) return 0;

    const max = Math.max(...counts);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;

    if (avg === 0) return 0;

    // Subtract 1 so that "max == avg" yields 0, then divide by 4 so
    // that a 5x spike maps to 1.0.
    return Math.min(1, Math.max(0, (max / avg - 1) / 4));
};

// ──────────────────────────────────────────────────────────────────────
// 6. OWNERSHIP PRESSURE
//    How much of the workload falls on the single busiest contributor.
//    If one person does >60% of commits, the score starts climbing
//    toward 1.0. At 100% ownership it equals 1.0.
// ──────────────────────────────────────────────────────────────────────
const calcOwnershipPressure = (authorCounts, totalCommits) => {
    if (totalCommits === 0) return 0;

    const maxByOneAuthor = Math.max(...Object.values(authorCounts));
    const share = maxByOneAuthor / totalCommits;

    // Below 60% → negligible pressure. Above 60% → scale linearly to 1.0.
    if (share <= 0.6) return 0;
    return Math.min(1, (share - 0.6) / 0.4);
};

// ──────────────────────────────────────────────────────────────────────
// 7. BUG SPIKE
//    Same trend idea as night/weekend, but applied to bug-related
//    commit messages. An increasing bug rate signals spiralling
//    technical debt / burnout.
// ──────────────────────────────────────────────────────────────────────
const calcBugSpike = (commits) => {
    return calcTrend(commits, c => containsKeyword(c.message, BUG_KEYWORDS));
};

// ══════════════════════════════════════════════════════════════════════
// MAIN: calculateBurnout
// ══════════════════════════════════════════════════════════════════════
const calculateBurnout = (commits) => {
    // --- Edge case: no commits at all ---
    if (!commits || commits.length === 0) {
        return {
            burnoutScore: 0,
            burnoutStatus: 'Healthy',
            signals: {
                nightTrend: 0,
                weekendTrend: 0,
                consistencyScore: 0,
                commitSpike: 0,
                ownershipPressure: 0,
                bugSpike: 0,

            }
        };
    }

    // --- Pre-compute shared data structures ---

    // Commits per calendar day
    const commitsPerDay = {};
    const authorCounts = {};

    commits.forEach(commit => {
        const dateKey = commit.date.format('YYYY-MM-DD');
        commitsPerDay[dateKey] = (commitsPerDay[dateKey] || 0) + 1;
        authorCounts[commit.author] = (authorCounts[commit.author] || 0) + 1;
    });



    // Sort commits chronologically for trend calculations
    const chronological = [...commits].sort((a, b) => a.date.valueOf() - b.date.valueOf());

    // --- Calculate each signal ---

    // Night trend: are night commits (10 PM – 5 AM) increasing?
    const nightTrend = calcTrend(chronological, c => {
        const h = c.date.hour();
        return h >= 22 || h < 5;
    });

    // Weekend trend: are weekend commits increasing?
    const weekendTrend = calcTrend(chronological, c => {
        const d = c.date.day();
        return d === 0 || d === 6; // Sunday = 0, Saturday = 6
    });

    const consistencyScore = calcConsistencyScore(commitsPerDay);
    const commitSpike = calcCommitSpike(commitsPerDay);
    const ownershipPressure = calcOwnershipPressure(authorCounts, commits.length);
    const bugSpike = calcBugSpike(chronological);


    // --- Weighted burnout formula ---
    const raw =
        0.20 * nightTrend +
        0.15 * weekendTrend +
        0.20 * consistencyScore +
        0.15 * commitSpike +
        0.15 * ownershipPressure +
        0.15 * bugSpike;

    // Scale to 0–100 and clamp
    const burnoutScore = Math.round(Math.min(100, Math.max(0, raw * 100)) * 100) / 100;

    // Determine status label
    let burnoutStatus;
    if (burnoutScore <= 30) {
        burnoutStatus = 'Healthy';
    } else if (burnoutScore <= 60) {
        burnoutStatus = 'Medium';
    } else {
        burnoutStatus = 'High Risk';
    }

    return {
        burnoutScore,
        burnoutStatus,

        // signals: {
        //     nightTrend: Math.round(nightTrend * 1000) / 1000,
        //     weekendTrend: Math.round(weekendTrend * 1000) / 1000,
        //     consistencyScore: Math.round(consistencyScore * 1000) / 1000,
        //     commitSpike: Math.round(commitSpike * 1000) / 1000,
        //     ownershipPressure: Math.round(ownershipPressure * 1000) / 1000,
        //     bugSpike: Math.round(bugSpike * 1000) / 1000
        // }
    };
};

module.exports = { calculateBurnout };