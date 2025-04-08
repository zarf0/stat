//**index js */

//**Book Shelf Section js */
// Shelf Scroll Buttons
document.querySelectorAll('.shelf-group').forEach(shelfGroup => {
    const shelfContainer = shelfGroup.querySelector('.shelf-container');
    const prevButton = shelfGroup.closest('.mb-16').querySelector('.shelf-prev');
    const nextButton = shelfGroup.closest('.mb-16').querySelector('.shelf-next');

    prevButton.addEventListener('click', () => {
        shelfContainer.scrollBy({ left: -300, behavior: 'smooth' });
    });

    nextButton.addEventListener('click', () => {
        shelfContainer.scrollBy({ left: 300, behavior: 'smooth' });
    });
});


// Global variable
let currentEditId = null;

// ====================== Instagram Modal ======================
document.addEventListener('DOMContentLoaded', function () {
    // Auto-show Instagram modal after 1 second delay
    setTimeout(showInstagramModal, 1000);

    // Edit buttons event listeners
    document.querySelectorAll('.edit-comment-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const commentId = e.target.dataset.commentId;
            const content = e.target.dataset.commentContent;
            openEditModal(commentId, content);
        });
    });

    // Save updated comment
    const saveBtn = document.getElementById('saveCommentBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            const newContent = document.getElementById('editCommentContent').value;

            if (!currentEditId) {
                alert("No comment ID found!");
                return;
            }

            fetch(`/edit-comment/${currentEditId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getGlobalCSRFToken()
                },
                body: JSON.stringify({ content: newContent })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById(`comment-text-${currentEditId}`).textContent = newContent;
                        closeEditModal();
                    } else {
                        alert('Error updating comment: ' + (data.error || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to update comment');
                });
        });
    }

    // ====================== Chart Initialization ======================
    if (typeof Chart !== 'undefined') {
        const categoryChart = document.getElementById('categoryChart');
        if (categoryChart) {
            new Chart(categoryChart, {
                type: 'doughnut',
                data: {
                    labels: window.category_labels || [],
                    datasets: [{
                        data: window.category_data || [],
                        backgroundColor: ['#059669', '#3B82F6', '#8B5CF6', '#F59E0B']
                    }]
                }
            });
        }

        const activityChart = document.getElementById('activityChart');
        if (activityChart) {
            new Chart(activityChart, {
                type: 'line',
                data: {
                    labels: window.monthly_labels || [],
                    datasets: [{
                        label: 'Books Read',
                        data: window.monthly_data || [],
                        borderColor: '#059669',
                        tension: 0.3
                    }]
                }
            });
        }

        const genreChart = document.getElementById('genreChart');
        if (genreChart) {
            new Chart(genreChart, {
                type: 'bar',
                data: {
                    labels: window.genre_labels || [],
                    datasets: [{
                        label: 'Books',
                        data: window.genre_data || [],
                        backgroundColor: '#059669'
                    }]
                }
            });
        }
    }
});

// ====================== Instagram Modal Functions ======================
function showInstagramModal() {
    const modal = document.getElementById('instagramModal');
    if (modal) modal.classList.remove('hidden');
}

function hideInstagramModal() {
    const modal = document.getElementById('instagramModal');
    if (modal) modal.classList.add('hidden');
}

// ====================== CSRF Token Helper ======================
function getGlobalCSRFToken() {
    const tokenMeta = document.querySelector('meta[name="csrf-token"]');
    return tokenMeta ? tokenMeta.content : '';
}

// ====================== Comment Modal Functions ======================
function openEditModal(commentId, content) {
    currentEditId = commentId;
    document.getElementById('editCommentContent').value = content;
    document.getElementById('editCommentModal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('editCommentModal').classList.add('hidden');
}

// ====================== Delete Comment ======================
function confirmDelete(commentId) {
    if (confirm("Are you sure you want to delete this comment?")) {
        deleteComment(commentId);
    }
}

function deleteComment(commentId) {
    fetch(`/comment/delete/${commentId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getGlobalCSRFToken()
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                alert(data.error);
            }
        });
}

//**base.html js */

// Toggle mobile menu
document.addEventListener("DOMContentLoaded", function () {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Toggle user dropdown menu
    const userMenuBtn = document.getElementById("userMenuBtn");
    const userDropdown = document.getElementById("userDropdown");

    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener("click", function () {
            userDropdown.classList.toggle("hidden");
        });

        document.addEventListener("click", function (event) {
            if (!userMenuBtn.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.add("hidden");
            }
        });
    }

    // Toggle mobile search input
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const mobileSearchContainer = document.getElementById('mobileSearchContainer');

    if (mobileSearchBtn && mobileSearchContainer) {
        mobileSearchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileSearchContainer.classList.toggle('hidden');

            if (!mobileSearchContainer.classList.contains('hidden')) {
                const mobileSearchInput = mobileSearchContainer.querySelector('input');
                mobileSearchInput.focus();

                mobileSearchInput.addEventListener('keypress', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        mobileSearchInput.closest('form').submit();
                    }
                });
            }
        });

        document.addEventListener('click', (e) => {
            if (!mobileSearchContainer.contains(e.target) && !mobileSearchBtn.contains(e.target)) {
                mobileSearchContainer.classList.add('hidden');
            }
        });
    }

    // Navbar background change on scroll (only for index)
    const navbar = document.getElementById("navbar");
    const isIndexPage = window.location.pathname === "/"; // Adjust if needed

    function updateNavbar() {
        const shouldChange = window.scrollY > (window.innerWidth > 768 ? 500 : 300);

        if (isIndexPage) {
            if (shouldChange) {
                navbar.classList.add("bg-[#003049]", "shadow-md", "text-black");
                navbar.classList.remove("bg-transparent", "text-white");
            } else {
                navbar.classList.remove("bg-[#003049]", "shadow-md", "text-black");
                navbar.classList.add("bg-transparent", "text-white");
            }
        } else {
            navbar.classList.add("bg-[#003049]", "shadow-md", "text-black");
            navbar.classList.remove("bg-transparent", "text-white");
        }
    }

    if (navbar) {
        updateNavbar();
        if (isIndexPage) {
            window.addEventListener("scroll", updateNavbar);
        }
    }
});

//**AUTHOR_PROFILE.HTML */
document.addEventListener('DOMContentLoaded', () => {
    const shareButton = document.getElementById('shareButton');
    const shareDropdown = document.getElementById('shareDropdown');

    if (shareButton && shareDropdown) {
        shareButton.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent bubbling to document
            shareDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!shareButton.contains(e.target) && !shareDropdown.contains(e.target)) {
                shareDropdown.classList.add('hidden');
            }
        });
    }

    // Optional: auto-close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            shareDropdown?.classList.add('hidden');
        }
    });
});

// Native Sharing Function (global scope)
function shareNative(title = 'Profile', text = 'Check this out') {
    const shareData = {
        title: title,
        text: text,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch((err) => {
            console.error('Sharing failed:', err);
        });
    } else {
        alert('Web Share API not supported in your browser.');
    }
}

//**CREATE POST.HTML */
class AdvancedEditor {
    constructor() {
        this.editor = document.getElementById('editor');
        this.hiddenContent = document.getElementById('hiddenContent');
        this.undoStack = [];
        this.redoStack = [];
        this.currentState = '';
        this.isFullscreen = false;
        this.originalStyles = {};

        this.initialize();
    }

    initialize() {
        // Initialize content
        this.editor.innerHTML = this.hiddenContent.value;
        
        // Event listeners
        this.editor.addEventListener('input', () => this.saveState());
        this.editor.addEventListener('keydown', (e) => this.handleMarkdownShortcuts(e));
        
        // Initialize modules
        this.initImageUpload();
        this.initEmojiPicker();
        this.initAutoSave();
        this.initWordCounter();

        setInterval(() => this.updateWordCount(), 1000);
    }

    // Selection handling
    saveSelection() {
        const sel = window.getSelection();
        this.lastSelection = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    }

    restoreSelection() {
        if (this.lastSelection) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(this.lastSelection);
        }
    }

    // Formatting commands
    format(command, value = null) {
        this.saveSelection();
        document.execCommand(command, false, value);
        this.restoreSelection();
    }

    // Image handling
    initImageUpload() {
        document.getElementById('imageUpload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.insertImage(event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    insertImage(src) {
        this.format('insertHTML', `<img src="${src}" class="editor-image" />`);
    }

    // Undo/Redo
    saveState() {
        this.undoStack.push(this.currentState);
        this.currentState = this.editor.innerHTML;
    }

    undo() {
        if (this.undoStack.length > 0) {
            this.redoStack.push(this.currentState);
            this.currentState = this.undoStack.pop();
            this.editor.innerHTML = this.currentState;
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            this.undoStack.push(this.currentState);
            this.currentState = this.redoStack.pop();
            this.editor.innerHTML = this.currentState;
        }
    }

    // Markdown shortcuts
    handleMarkdownShortcuts(e) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const text = range.startContainer.textContent;
        
        // Bold: **text**
        if (e.key === ' ' && text.endsWith('**')) {
            this.handleMarkdownFormatting('**', 'strong');
        }
        // Italic: *text*
        else if (e.key === ' ' && text.endsWith('*')) {
            this.handleMarkdownFormatting('*', 'em');
        }
    }

    handleMarkdownFormatting(mdChar, tag) {
        const range = window.getSelection().getRangeAt(0);
        const text = range.startContainer.textContent;
        const start = text.lastIndexOf(mdChar);
        
        if (start !== -1 && text.lastIndexOf(mdChar, start - 1) !== -1) {
            range.setStart(range.startContainer, start - mdChar.length);
            range.setEnd(range.endContainer, range.endOffset);
            
            const content = range.toString().replace(new RegExp(mdChar, 'g'), '');
            const element = document.createElement(tag);
            element.textContent = content;
            
            range.deleteContents();
            range.insertNode(element);
        }
    }

    // Emoji picker
    initEmojiPicker() {
        this.emojiPicker = document.getElementById('emojiPicker');
        document.getElementById('emojiBtn').addEventListener('click', () => {
            this.emojiPicker.classList.toggle('hidden');
        });
    }

    insertEmoji(emoji) {
        this.format('insertText', emoji);
        this.emojiPicker.classList.add('hidden');
    }

    // Fullscreen mode
    toggleFullscreen() {
        const container = document.getElementById('editorContainer');
        if (!this.isFullscreen) {
            this.originalStyles = {
                position: container.style.position,
                zIndex: container.style.zIndex,
                top: container.style.top,
                left: container.style.left,
                width: container.style.width,
                height: container.style.height,
            };
            
            Object.assign(container.style, {
                position: 'fixed',
                zIndex: '9999',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
            });
        } else {
            Object.assign(container.style, this.originalStyles);
        }
        this.isFullscreen = !this.isFullscreen;
    }

    // Auto-save
    initAutoSave() {
        setInterval(() => {
            localStorage.setItem('autoSaveContent', this.editor.innerHTML);
        }, 30000);

        window.addEventListener('load', () => {
            const saved = localStorage.getItem('autoSaveContent');
            if (saved && confirm('Restore auto-saved content?')) {
                this.editor.innerHTML = saved;
            }
        });
    }

    // Word counter
    initWordCounter() {
        this.wordCountElement = document.getElementById('wordCount');
    }

    updateWordCount() {
        const text = this.editor.textContent;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        this.wordCountElement.textContent = `${words.length} words`;
    }

    // Table creation
    insertTable(rows = 3, cols = 3) {
        const table = document.createElement('table');
        table.className = 'editor-table';
        
        for (let i = 0; i < rows; i++) {
            const tr = table.insertRow();
            for (let j = 0; j < cols; j++) {
                tr.insertCell().innerHTML = '&nbsp;';
            }
        }
        
        this.format('insertElement', table);
    }

    // Link insertion
    insertLink() {
        const url = prompt('Enter URL:');
        if (url) {
            this.format('createLink', url);
        }
    }

    // Code block insertion
    insertCodeBlock() {
        this.format('insertHTML', '<pre><code>// Your code here</code></pre>');
    }

    // Form submission
    updateHiddenContent() {
        this.hiddenContent.value = this.editor.innerHTML;
    }
}

// Initialize editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.editor = new AdvancedEditor();
});

//**UPDATE PROFILE */
function togglePasswordVisibility(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
}

//**WISHLIST */
function handleCardClick(event, url) {
    // Check if click was on remove button or its children
    if (!event.target.closest('.remove-button')) {
        window.location.href = url;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const gridBtn = document.getElementById('gridBtn');
    const listBtn = document.getElementById('listBtn');
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');

    // Check localStorage for saved preference
    const savedView = localStorage.getItem('viewPreference') || 'grid';
    if (savedView === 'list') toggleView('list');

    gridBtn.addEventListener('click', () => toggleView('grid'));
    listBtn.addEventListener('click', () => toggleView('list'));

    function toggleView(view) {
        if (view === 'grid') {
            gridView.classList.remove('hidden');
            listView.classList.add('hidden');
            gridBtn.classList.replace('text-slate-400', 'text-slate-600');
            listBtn.classList.replace('text-slate-600', 'text-slate-400');
        } else {
            gridView.classList.add('hidden');
            listView.classList.remove('hidden');
            gridBtn.classList.replace('text-slate-600', 'text-slate-400');
            listBtn.classList.replace('text-slate-400', 'text-slate-600');
        }
        localStorage.setItem('viewPreference', view);
    }
});
