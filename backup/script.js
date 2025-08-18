// Configuration
const GITHUB_USERNAME = 'baendlorel'; // Your GitHub username
const GITHUB_API_BASE = 'https://api.github.com';

// State management
let allRepositories = [];
let filteredRepositories = [];

// DOM elements
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');
const packagesGrid = document.getElementById('packages-grid');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalReposElement = document.getElementById('total-repos');
const npmPackagesElement = document.getElementById('npm-packages');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadRepositories();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilter);
    });
}

// Load repositories from GitHub API
async function loadRepositories() {
    try {
        showLoading();
        
        // Fetch repositories
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repositories = await response.json();
        
        // Filter out forks and private repos, and enrich with package info
        allRepositories = await Promise.all(
            repositories
                .filter(repo => !repo.fork && !repo.private)
                .map(async repo => await enrichRepositoryData(repo))
        );
        
        filteredRepositories = [...allRepositories];
        
        updateStats();
        renderRepositories();
        hideLoading();
        
    } catch (error) {
        console.error('Error loading repositories:', error);
        showError();
    }
}

// Enrich repository data with additional information
async function enrichRepositoryData(repo) {
    const enrichedRepo = {
        ...repo,
        isNpmPackage: false,
        packageInfo: null,
        readme: null
    };
    
    try {
        // Check if repository has package.json
        const packageResponse = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/contents/package.json`);
        
        if (packageResponse.ok) {
            const packageData = await packageResponse.json();
            const packageContent = JSON.parse(atob(packageData.content));
            
            enrichedRepo.isNpmPackage = true;
            enrichedRepo.packageInfo = packageContent;
            
            // Get NPM package stats if available
            try {
                const npmResponse = await fetch(`https://registry.npmjs.org/${packageContent.name}`);
                if (npmResponse.ok) {
                    const npmData = await npmResponse.json();
                    enrichedRepo.npmStats = {
                        version: npmData['dist-tags']?.latest || 'unknown',
                        downloads: 'unknown' // NPM doesn't provide download stats directly
                    };
                }
            } catch (npmError) {
                console.log(`NPM data not found for ${packageContent.name}`);
            }
        }
        
        // Try to get README for better description
        try {
            const readmeResponse = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/readme`);
            if (readmeResponse.ok) {
                const readmeData = await readmeResponse.json();
                enrichedRepo.readme = atob(readmeData.content);
            }
        } catch (readmeError) {
            console.log(`README not found for ${repo.name}`);
        }
        
    } catch (error) {
        console.log(`Error enriching ${repo.name}:`, error);
    }
    
    return enrichedRepo;
}

// Update statistics
function updateStats() {
    const npmPackages = allRepositories.filter(repo => repo.isNpmPackage);
    
    totalReposElement.textContent = allRepositories.length;
    npmPackagesElement.textContent = npmPackages.length;
    
    // Animate numbers
    animateNumber(totalReposElement, allRepositories.length);
    animateNumber(npmPackagesElement, npmPackages.length);
}

// Animate number counting
function animateNumber(element, target) {
    const duration = 1000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Render repositories
function renderRepositories() {
    if (filteredRepositories.length === 0) {
        packagesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: var(--text-muted);"></i>
                <p>No packages found matching your criteria. (´・ω・`)</p>
            </div>
        `;
        return;
    }
    
    packagesGrid.innerHTML = filteredRepositories.map(repo => createPackageCard(repo)).join('');
}

// Create package card HTML
function createPackageCard(repo) {
    const primaryLanguage = repo.language || 'Unknown';
    const description = repo.description || 'No description available';
    const topics = repo.topics || [];
    
    // Get package-specific information
    const isNpm = repo.isNpmPackage;
    const packageName = repo.packageInfo?.name || repo.name;
    const packageVersion = repo.npmStats?.version || repo.packageInfo?.version || 'unknown';
    
    // Format dates
    const updatedDate = new Date(repo.updated_at).toLocaleDateString();
    
    // Determine package type for filtering
    const packageTypes = [];
    if (isNpm) packageTypes.push('npm');
    if (topics.includes('library') || repo.name.includes('lib')) packageTypes.push('library');
    if (topics.includes('tool') || topics.includes('cli')) packageTypes.push('tool');
    
    return `
        <div class="package-card" data-package-types="${packageTypes.join(' ')}" data-name="${repo.name.toLowerCase()}" data-description="${description.toLowerCase()}">
            <div class="package-header">
                <div>
                    <h3 class="package-title">${packageName}</h3>
                    ${isNpm ? `<span class="package-version">v${packageVersion}</span>` : ''}
                </div>
                <span class="package-language">${primaryLanguage}</span>
            </div>
            
            <p class="package-description">${description}</p>
            
            <div class="package-stats">
                <div class="stat">
                    <i class="fas fa-star"></i>
                    <span>${repo.stargazers_count}</span>
                </div>
                <div class="stat">
                    <i class="fas fa-code-branch"></i>
                    <span>${repo.forks_count}</span>
                </div>
                <div class="stat">
                    <i class="fas fa-clock"></i>
                    <span>${updatedDate}</span>
                </div>
                ${repo.size ? `
                <div class="stat">
                    <i class="fas fa-database"></i>
                    <span>${formatBytes(repo.size * 1024)}</span>
                </div>
                ` : ''}
            </div>
            
            ${topics.length > 0 ? `
            <div class="package-topics">
                ${topics.slice(0, 5).map(topic => `<span class="topic">${topic}</span>`).join('')}
                ${topics.length > 5 ? `<span class="topic">+${topics.length - 5} more</span>` : ''}
            </div>
            ` : ''}
            
            <div class="package-links">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="package-link secondary">
                    <i class="fab fa-github"></i>
                    View Code
                </a>
                ${isNpm ? `
                <a href="https://www.npmjs.com/package/${packageName}" target="_blank" rel="noopener noreferrer" class="package-link primary">
                    <i class="fab fa-npm"></i>
                    NPM Package
                </a>
                ` : repo.homepage ? `
                <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="package-link primary">
                    <i class="fas fa-external-link-alt"></i>
                    Live Demo
                </a>
                ` : ''}
            </div>
        </div>
    `;
}

// Handle search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredRepositories = [...allRepositories];
    } else {
        filteredRepositories = allRepositories.filter(repo => {
            const searchableText = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
            return searchableText.includes(searchTerm);
        });
    }
    
    renderRepositories();
}

// Handle filter
function handleFilter(event) {
    const filterType = event.target.dataset.filter;
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter repositories
    if (filterType === 'all') {
        filteredRepositories = [...allRepositories];
    } else {
        filteredRepositories = allRepositories.filter(repo => {
            switch (filterType) {
                case 'npm':
                    return repo.isNpmPackage;
                case 'library':
                    return repo.topics?.includes('library') || repo.name.includes('lib');
                case 'tool':
                    return repo.topics?.includes('tool') || repo.topics?.includes('cli');
                default:
                    return true;
            }
        });
    }
    
    // Also apply current search if any
    const currentSearch = searchInput.value.toLowerCase().trim();
    if (currentSearch) {
        filteredRepositories = filteredRepositories.filter(repo => {
            const searchableText = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
            return searchableText.includes(currentSearch);
        });
    }
    
    renderRepositories();
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function showLoading() {
    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';
    packagesGrid.style.display = 'none';
}

function hideLoading() {
    loadingElement.style.display = 'none';
    packagesGrid.style.display = 'grid';
}

function showError() {
    loadingElement.style.display = 'none';
    errorElement.style.display = 'block';
    packagesGrid.style.display = 'none';
}

// Add some fun interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add easter egg for Konami code
    let konamiCode = [];
    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konami.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konami.join(',')) {
            // Easter egg activated!
            document.body.style.animation = 'rainbow 2s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
            
            // Show a fun message
            const message = document.createElement('div');
            message.innerHTML = '🎉 Konami Code Activated! You found the secret! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧';
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--gradient);
                color: white;
                padding: 2rem;
                border-radius: 16px;
                font-size: 1.2rem;
                text-align: center;
                z-index: 9999;
                box-shadow: 0 20px 40px var(--shadow);
            `;
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 3000);
            
            konamiCode = [];
        }
    });
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
