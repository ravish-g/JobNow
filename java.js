// Homepage search. The sample listings live in index.html.
const searchForm = document.querySelector("#job-search");
const keywordInput = document.querySelector("#keyword");
const locationInput = document.querySelector("#location");
const categoryButtons = document.querySelectorAll("[data-filter]");
const jobCards = document.querySelectorAll(".job");
const resultsHeading = document.querySelector("#openings-heading");
const resultsSummary = document.querySelector("#results-summary");
const clearButton = document.querySelector("#clear-filters");

let selectedCategory = "";
let selectedType = "";

function updateResults() {
    const keyword = keywordInput.value.trim().toLowerCase();
    const location = locationInput.value.trim().toLowerCase();
    const words = keyword.split(/\s+/);
    let visibleCount = 0;

    for (const card of jobCards) {
        const searchableText = (card.textContent + " " + card.dataset.category).toLowerCase();
        const matchesKeyword = words.every(word => searchableText.includes(word));
        const matchesLocation = card.dataset.location.toLowerCase().includes(location);
        const matchesCategory = !selectedCategory || card.dataset.category === selectedCategory;
        const matchesType = !selectedType || card.dataset.type === selectedType;
        card.hidden = !(matchesKeyword && matchesLocation && matchesCategory && matchesType);

        if (!card.hidden) {
            visibleCount++;
        }
    }

    for (const button of categoryButtons) {
        button.setAttribute("aria-pressed", button.dataset.filter === selectedCategory);
    }

    const filters = [keyword, location, selectedCategory, selectedType].filter(Boolean);
    const filterLabel = filters.length ? " · " + filters.join(" / ") : "";
    const countLabel = visibleCount === 1 ? "1 sample opening" : visibleCount + " sample openings";
    resultsSummary.textContent = visibleCount
        ? countLabel + filterLabel
        : "No sample openings match" + filterLabel + ". Try a different search or clear the filters.";
    clearButton.hidden = filters.length === 0;
}

function showResults() {
    updateResults();
    resultsHeading.focus({ preventScroll: true });
    document.querySelector("#openings").scrollIntoView();
}

function resetFilters() {
    searchForm.reset();
    selectedCategory = "";
    selectedType = "";
}

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    selectedCategory = "";
    selectedType = "";
    showResults();
});

for (const button of categoryButtons) {
    button.addEventListener("click", () => {
        resetFilters();
        selectedCategory = button.dataset.filter;
        showResults();
    });
}

document.querySelector("#jobs-link").addEventListener("click", () => {
    resetFilters();
    updateResults();
});

document.querySelector("#internships-link").addEventListener("click", () => {
    resetFilters();
    selectedType = "Internship";
    showResults();
});

document.querySelector("#featured-link").addEventListener("click", () => {
    resetFilters();
    keywordInput.value = "Frontend Developer Intern";
    showResults();
});

clearButton.addEventListener("click", () => {
    resetFilters();
    showResults();
});

// Replace these preview buttons with links when the real pages are ready.
const featureDialog = document.querySelector("#feature-dialog");
const featureDescriptions = {
    "Login / Sign up": "Account registration and login are planned for a later version of JobNow.",
    "Post a job": "The employer posting form is planned for a later version of JobNow."
};

for (const button of document.querySelectorAll("[data-feature]")) {
    button.addEventListener("click", () => {
        const feature = button.dataset.feature;
        document.querySelector("#feature-title").textContent = feature;
        document.querySelector("#feature-description").textContent = featureDescriptions[feature];
        featureDialog.showModal();
    });
}

updateResults();
