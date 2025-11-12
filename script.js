// Theme Management
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);

// Theme toggle functionality
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Navigation Management (for index.html)
const navLinks = document.querySelectorAll('.nav-link[data-section]');
const sections = document.querySelectorAll('.content-section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links and sections
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Show corresponding section
        const sectionId = link.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
    });
});

// Portfolio Management
const imageUpload = document.getElementById('imageUpload');
const portfolioGrid = document.getElementById('portfolioGrid');
const emptyPortfolio = document.getElementById('emptyPortfolio');

// Load portfolio images from localStorage
function loadPortfolio() {
    const images = JSON.parse(localStorage.getItem('portfolioImages')) || [];
    
    if (images.length === 0 && emptyPortfolio) {
        emptyPortfolio.style.display = 'block';
        if (portfolioGrid) portfolioGrid.style.display = 'none';
        return;
    }
    
    if (emptyPortfolio) emptyPortfolio.style.display = 'none';
    if (portfolioGrid) {
        portfolioGrid.style.display = 'grid';
        portfolioGrid.innerHTML = '';
        
        images.forEach((image, index) => {
            const item = createPortfolioItem(image, index);
            portfolioGrid.appendChild(item);
        });
    }
}

// Create portfolio item element
function createPortfolioItem(imageSrc, index) {
    const div = document.createElement('div');
    div.className = 'portfolio-item';
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = `Artwork ${index + 1}`;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = () => deleteImage(index);
    
    div.appendChild(img);
    div.appendChild(deleteBtn);
    
    return div;
}

// Handle image upload
if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const images = JSON.parse(localStorage.getItem('portfolioImages')) || [];
                images.push(event.target.result);
                localStorage.setItem('portfolioImages', JSON.stringify(images));
                loadPortfolio();
            };
            
            reader.readAsDataURL(file);
        }
        
        // Reset input
        e.target.value = '';
    });
}

// Delete image from portfolio
function deleteImage(index) {
    const images = JSON.parse(localStorage.getItem('portfolioImages')) || [];
    images.splice(index, 1);
    localStorage.setItem('portfolioImages', JSON.stringify(images));
    loadPortfolio();
}

// Dream Notes Management
const dreamTitle = document.getElementById('dreamTitle');
const dreamContent = document.getElementById('dreamContent');
const saveDream = document.getElementById('saveDream');
const dreamsList = document.getElementById('dreamsList');
const emptyDreams = document.getElementById('emptyDreams');

let editingDreamIndex = null;

// Load dreams from localStorage
function loadDreams() {
    const dreams = JSON.parse(localStorage.getItem('dreams')) || [];
    
    if (dreams.length === 0 && emptyDreams) {
        emptyDreams.style.display = 'block';
        if (dreamsList) dreamsList.style.display = 'none';
        return;
    }
    
    if (emptyDreams) emptyDreams.style.display = 'none';
    if (dreamsList) {
        dreamsList.style.display = 'flex';
        dreamsList.innerHTML = '';
        
        dreams.forEach((dream, index) => {
            const entry = createDreamEntry(dream, index);
            dreamsList.appendChild(entry);
        });
    }
}

// Create dream entry element
function createDreamEntry(dream, index) {
    const div = document.createElement('div');
    div.className = 'dream-entry';
    
    div.innerHTML = `
        <div class="dream-header">
            <h3 class="dream-title">${dream.title || 'Untitled Dream'}</h3>
            <span class="dream-date">${dream.date}</span>
        </div>
        <p class="dream-content">${dream.content}</p>
        <div class="dream-actions">
            <button class="edit-btn" onclick="editDream(${index})">Edit</button>
            <button class="dream-delete-btn" onclick="deleteDream(${index})">Delete</button>
        </div>
    `;
    
    return div;
}

// Save dream
if (saveDream) {
    saveDream.addEventListener('click', () => {
        const title = dreamTitle.value.trim();
        const content = dreamContent.value.trim();
        
        if (!content) {
            alert('Please write some dream content!');
            return;
        }
        
        const dreams = JSON.parse(localStorage.getItem('dreams')) || [];
        const dreamData = {
            title: title || 'Untitled Dream',
            content: content,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        };
        
        if (editingDreamIndex !== null) {
            // Update existing dream
            dreams[editingDreamIndex] = dreamData;
            editingDreamIndex = null;
            saveDream.textContent = 'Save Dream';
        } else {
            // Add new dream
            dreams.unshift(dreamData);
        }
        
        localStorage.setItem('dreams', JSON.stringify(dreams));
        
        // Clear inputs
        dreamTitle.value = '';
        dreamContent.value = '';
        
        loadDreams();
    });
}

// Edit dream
function editDream(index) {
    const dreams = JSON.parse(localStorage.getItem('dreams')) || [];
    const dream = dreams[index];
    
    if (dreamTitle && dreamContent && saveDream) {
        dreamTitle.value = dream.title;
        dreamContent.value = dream.content;
        editingDreamIndex = index;
        saveDream.textContent = 'Update Dream';
        
        // Scroll to input
        dreamTitle.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Delete dream
function deleteDream(index) {
    if (confirm('Are you sure you want to delete this dream?')) {
        const dreams = JSON.parse(localStorage.getItem('dreams')) || [];
        dreams.splice(index, 1);
        localStorage.setItem('dreams', JSON.stringify(dreams));
        loadDreams();
    }
}

// Make functions globally accessible
window.editDream = editDream;
window.deleteDream = deleteDream;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolio();
    loadDreams();
    
    // Handle hash navigation
    const hash = window.location.hash;
    if (hash) {
        const section = hash.substring(1);
        const link = document.querySelector(`[data-section="${section}"]`);
        if (link) {
            link.click();
        }
    }
});