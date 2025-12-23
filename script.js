// Postcard Creator App
let currentFrame = null;
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

// Sample data for decorations (you can replace these with actual image paths)
const decorations = {
    frames: [
        { id: 'frame1', src: 'images/frames/frame1.png', name: 'Holly Frame' },
        { id: 'frame2', src: 'images/frames/frame2.png', name: 'Snow Frame' },
        { id: 'frame3', src: 'images/frames/frame3.png', name: 'Gold Frame' },
    ],
    stickers: [
        { id: 'sticker1', src: 'images/stickers/santa.png', name: 'Santa' },
        { id: 'sticker2', src: 'images/stickers/Christmastree.png', name: 'Christmas Tree' },
        { id: 'sticker3', src: 'images/stickers/gift.png', name: 'Gift' },
        { id: 'sticker4', src: 'images/stickers/reindeer.png', name: 'Reindeer' },
        { id: 'sticker5', src: 'images/stickers/gingerbread.png', name: 'Gingerbread' },
        { id: 'sticker6', src: 'images/stickers/candycane.png', name: 'Candy Cane' },
        { id: 'sticker7', src: 'images/stickers/jinglebells.png', name: 'Jingle Bells' },
        { id: 'sticker8', src: 'images/stickers/wreath.png', name: 'Wreath' },
        { id: 'sticker9', src: 'images/stickers/stocking.png', name: 'Stocking' },
        { id: 'sticker10', src: 'images/stickers/snow.png', name: 'Snow' },
        { id: 'sticker11', src: 'images/stickers/blue_ornament.png', name: 'Blue Ornament' },
        { id: 'sticker12', src: 'images/stickers/redornament.png', name: 'Red Ornament' },
        { id: 'sticker13', src: 'images/stickers/yellowornament.png', name: 'Yellow Ornament' },
    ],
    stamps: [
        { id: 'stamp1', src: 'images/stamps/stamp1.png', name: 'Stamp 1' },
        { id: 'stamp2', src: 'images/stamps/stamp2.png', name: 'Stamp 2' },
        { id: 'stamp3', src: 'images/stamps/stamp3.png', name: 'Stamp 3' },
        { id: 'stamp4', src: 'images/stamps/stamp4.png', name: 'Stamp 4' },
        { id: 'stamp5', src: 'images/stamps/stamp5.png', name: 'Stamp 5' },
        { id: 'stamp6', src: 'images/stamps/stamp6.png', name: 'Stamp 6' },
        { id: 'stamp7', src: 'images/stamps/stamp7.png', name: 'Stamp 7' },
    ]
};

// Initialize the app
function init() {
    loadDecorations();
    setupEventListeners();
}

// Load all decorations into the sidebar
function loadDecorations() {
    const framesContainer = document.getElementById('frames-container');
    const stickersContainer = document.getElementById('stickers-container');
    const stampsContainer = document.getElementById('stamps-container');

    // Load frames
    decorations.frames.forEach(frame => {
        const item = createToolItem(frame, 'frame');
        framesContainer.appendChild(item);
    });

    // Load stickers
    decorations.stickers.forEach(sticker => {
        const item = createToolItem(sticker, 'sticker');
        stickersContainer.appendChild(item);
    });

    // Load stamps
    decorations.stamps.forEach(stamp => {
        const item = createToolItem(stamp, 'stamp');
        stampsContainer.appendChild(item);
    });
}

// Create a tool item element
function createToolItem(data, type) {
    const div = document.createElement('div');
    div.className = 'tool-item';
    div.setAttribute('data-type', type);
    div.setAttribute('data-id', data.id);
    div.setAttribute('title', data.name);
    
    const img = document.createElement('img');
    img.src = data.src;
    img.alt = data.name;
    img.onerror = function() {
        // If image doesn't exist, show a placeholder
        this.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23999'%3E${data.name}%3C/text%3E%3C/svg%3E`;
    };
    
    div.appendChild(img);
    
    div.addEventListener('click', () => addToPostcard(data, type));
    
    return div;
}

// Add decoration to postcard
function addToPostcard(data, type) {
    const postcardContent = document.getElementById('postcard-content');
    
    if (type === 'frame') {
        // Remove existing frame if any
        if (currentFrame) {
            currentFrame.remove();
        }
        
        const frameDiv = document.createElement('div');
        frameDiv.className = 'placed-item placed-frame';
        frameDiv.innerHTML = `<img src="${data.src}" alt="${data.name}">`;
        postcardContent.appendChild(frameDiv);
        currentFrame = frameDiv;
    } else {
        // Add sticker or stamp
        const item = document.createElement('div');
        item.className = `placed-item placed-${type}`;
        item.innerHTML = `<img src="${data.src}" alt="${data.name}"><div class="resize-handle"></div>`;
        
        // Random initial position
        const maxX = 500;
        const maxY = 300;
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        
        item.style.left = x + 'px';
        item.style.top = y + 'px';
        
        // Make draggable and resizable
        makeDraggable(item);
        makeResizable(item);
        
        // Click to delete
        item.addEventListener('dblclick', function() {
            if (confirm('Remove this item?')) {
                this.remove();
            }
        });
        
        postcardContent.appendChild(item);
    }
}

// Make elements draggable
function makeDraggable(element) {
    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', startDrag);
}

function startDrag(e) {
    e.preventDefault();
    draggedElement = this;
    draggedElement.classList.add('dragging');
    
    const rect = draggedElement.getBoundingClientRect();
    const postcardRect = document.getElementById('postcard-content').getBoundingClientRect();
    
    if (e.type === 'touchstart') {
        offsetX = e.touches[0].clientX - rect.left;
        offsetY = e.touches[0].clientY - rect.top;
    } else {
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    }
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDrag);
}

function drag(e) {
    if (!draggedElement) return;
    
    const postcardRect = document.getElementById('postcard-content').getBoundingClientRect();
    let clientX, clientY;
    
    if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    let x = clientX - postcardRect.left - offsetX;
    let y = clientY - postcardRect.top - offsetY;
    
    // Keep within bounds
    x = Math.max(0, Math.min(x, postcardRect.width - draggedElement.offsetWidth));
    y = Math.max(0, Math.min(y, postcardRect.height - draggedElement.offsetHeight));
    
    draggedElement.style.left = x + 'px';
    draggedElement.style.top = y + 'px';
}

function stopDrag() {
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
        draggedElement = null;
    }
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', stopDrag);
}

// Setup event listeners
function setupEventListeners() {
    // Add message button
    document.getElementById('add-message-btn').addEventListener('click', addMessage);
    
    // Clear button
    document.getElementById('clear-btn').addEventListener('click', clearPostcard);
    
    // Download button
    document.getElementById('download-btn').addEventListener('click', downloadPostcard);
}

// Make elements resizable
let resizingElement = null;
let startWidth = 0;
let startHeight = 0;
let startX = 0;
let startY = 0;

function makeResizable(element) {
    const resizeHandle = element.querySelector('.resize-handle');
    if (!resizeHandle) return;
    
    resizeHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        resizingElement = element;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;
        
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });
}

function resize(e) {
    if (!resizingElement) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    const newWidth = startWidth + deltaX;
    const newHeight = startHeight + deltaY;
    
    if (newWidth > 30 && newHeight > 30) {
        resizingElement.style.width = newWidth + 'px';
        resizingElement.style.height = newHeight + 'px';
    }
}

function stopResize() {
    resizingElement = null;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

// Add message to postcard
function addMessage() {
    const messageText = document.getElementById('message-input').value.trim();
    
    if (!messageText) {
        alert('Please write a message first!');
        return;
    }
    
    const postcardContent = document.getElementById('postcard-content');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'placed-item placed-message';
    
    // Create text node
    const textSpan = document.createElement('span');
    textSpan.textContent = messageText;
    textSpan.style.pointerEvents = 'none';
    
    messageDiv.appendChild(textSpan);
    messageDiv.innerHTML += '<div class="delete-btn" title="Remove">×</div><div class="resize-handle"></div>';
    
    // Position in center
    messageDiv.style.left = '100px';
    messageDiv.style.top = '150px';
    messageDiv.style.width = '250px';
    
    makeDraggable(messageDiv);
    makeResizable(messageDiv);
    
    // Delete button click
    const deleteBtn = messageDiv.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        messageDiv.remove();
    });
    
    postcardContent.appendChild(messageDiv);
    
    // Clear input
    document.getElementById('message-input').value = '';
}

// Clear all items from postcard
function clearPostcard() {
    if (confirm('Clear all items from your postcard?')) {
        document.getElementById('postcard-content').innerHTML = '';
        currentFrame = null;
    }
}

// Download postcard as image
function downloadPostcard() {
    const postcard = document.getElementById('postcard');
    
    // Use html2canvas library for better quality
    // For now, we'll alert the user
    alert('To download your postcard, you can:\n1. Take a screenshot\n2. Or install html2canvas library for automatic download');
    
    // If you want to add html2canvas:
    // Uncomment below and add <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script> to index.html
    
    /*
    html2canvas(postcard, {
        backgroundColor: null,
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'christmas-postcard.png';
        link.href = canvas.toDataURL();
        link.click();
    });
    */
}

// Audio toggle functionality
function setupAudioToggle() {
    const video = document.getElementById('bg-video');
    const audioToggle = document.getElementById('audio-toggle');
    
    audioToggle.addEventListener('click', function() {
        if (video.muted) {
            video.muted = false;
            audioToggle.textContent = '🔊';
            audioToggle.title = 'Mute Audio';
        } else {
            video.muted = true;
            audioToggle.textContent = '🔇';
            audioToggle.title = 'Unmute Audio';
        }
    });
}

// Snowfall effect
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = '❄';
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
    
    document.body.appendChild(snowflake);
    
    setTimeout(() => {
        snowflake.remove();
    }, 5000);
}

// Create snowflakes continuously
setInterval(createSnowflake, 200);

// Cursor snow trail
document.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.7) { // Only create occasionally
        const snow = document.createElement('div');
        snow.className = 'cursor-snow';
        snow.textContent = '❄';
        snow.style.left = e.pageX + 'px';
        snow.style.top = e.pageY + 'px';
        document.body.appendChild(snow);
        
        setTimeout(() => {
            snow.remove();
        }, 2000);
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
    setupAudioToggle();
});