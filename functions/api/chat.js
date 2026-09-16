// Global AI Mahlet - Updated Controller Script
// Fixes voice response, makes responses professional/slang-free, and handles New Chat management.

document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const nodeSelect = document.getElementById('node-select');
    const langSelect = document.getElementById('lang-select');
    const menuToggle = document.getElementById('menu-toggle');
    const appDrawer = document.getElementById('app-drawer');
    const closeMenu = document.getElementById('close-menu');
    const searchChats = document.getElementById('search-chats');
    const recentList = document.getElementById('recent-list');
    const settingsBtn = document.getElementById('settings-btn');
    const tempChatToggle = document.getElementById('temp-chat-toggle');

    const cameraBtn = document.getElementById('camera-btn');
    const photoBtn = document.getElementById('photo-btn');
    const fileBtn = document.getElementById('file-btn');
    const recordBtn = document.getElementById('record-btn');
    const cameraInput = document.getElementById('camera-input');
    const photoInput = document.getElementById('photo-input');
    const fileInput = document.getElementById('file-input');

    // Inject New Chat button dynamically into the drawer menu safely
    const drawerContainer = appDrawer.querySelector('div');
    const newChatBtn = document.createElement('button');
    newChatBtn.className = 'new-chat-btn action-btn';
    newChatBtn.style.cssText = 'width: 100%; margin-bottom: 10px; background: #28a745; font-weight: bold;';
    newChatBtn.innerText = '+ New Chat';
    appDrawer.insertBefore(newChatBtn, drawerContainer.nextSibling);

    let chatSessions = [{ title: "Welcome Chat", history: [] }];
    let activeIndex = 0;

    menuToggle.addEventListener('click', () => appDrawer.classList.toggle('open'));
    closeMenu.addEventListener('click', () => appDrawer.classList.remove('open'));
    settingsBtn.addEventListener('click', () => alert("Settings panel: Customization and preference options."));

    function renderList(filter = '') {
        recentList.innerHTML = '';
        chatSessions.filter(c => c.title.toLowerCase().includes(filter)).forEach((c, idx) => {
            recentList.innerHTML += `
                <div class="recent-item">
                    <span onclick="window.switchChat(${idx})">${c.title}</span>
                    <div class="recent-actions">
                        <button onclick="window.renameChat(${idx})">Rename</button>
                        <button onclick="window.deleteChat(${idx})">Delete</button>
                    </div>
                </div>`;
        });
    }

    window.switchChat = function(idx) {
        activeIndex = idx;
        chatBox.innerHTML = '';
        chatSessions[idx].history.forEach(m => {
            chatBox.innerHTML += `<div><b>${m.sender}:</b> ${m.text}</div>`;
        });
        appDrawer.classList.remove('open');
    };

    window.deleteChat = function(idx) {
        chatSessions.splice(idx, 1);
        if (chatSessions.length === 0) {
            chatSessions.push({ title: "Welcome Chat", history: [] });
        }
        activeIndex = 0;
        window.switchChat(0);
        renderList(searchChats.value.toLowerCase());
    };

    window.renameChat = function(idx) {
        let n = prompt("Rename chat:", chatSessions[idx].title);
        if (n) {
            chatSessions[idx].title = n;
            renderList(searchChats.value.toLowerCase());
        }
    };

    newChatBtn.addEventListener('click', () => {
        chatSessions.unshift({ title: "New Conversation", history: [] });
        activeIndex = 0;
        chatBox.innerHTML = `<div>Welcome. Please choose a mode or type your question below.</div>`;
        renderList();
        appDrawer.classList.remove('open');
    });

    searchChats.addEventListener('input', (e) => renderList(e.target.value.toLowerCase()));
    renderList();

    cameraBtn.addEventListener('click', () => cameraInput.click());
    photoBtn.addEventListener('click', () => photoInput.click());
    fileBtn.addEventListener('click', () => fileInput.click());

    function pushMessage(sender, text) {
        chatBox.innerHTML += `<div><b>${sender}:</b> ${text}</div>`;
        if (!tempChatToggle.checked) {
            chatSessions[activeIndex].history.push({ sender, text });
            if (chatSessions[activeIndex].title === "Welcome Chat" || chatSessions[activeIndex].title === "New Conversation") {
                chatSessions[activeIndex].title = text.length > 25 ? text.substring(0, 25) + '...' : text;
            }
            renderList(searchChats.value.toLowerCase());
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function getAIResponse(inputPrompt) {
        let text = inputPrompt.toLowerCase().replace(/\bfad\b/g, 'bad').replace(/\bteh\b/g, 'the').replace(/\bhav\b/g, 'have');
        let mode = nodeSelect.value;
        let lang = langSelect.value;
        let reply = "";

        if (text.startsWith('search ') || text.startsWith('what is ') || text.startsWith('who is ') || text.startsWith('tell me about ')) {
            let q = text.replace('search ', '').replace('what is ', '').replace('who is ', '').replace('tell me about ', '');
            try {
                let res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`);
                let data = await res.json();
                reply = (data.query && data.query.search.length > 0) ? `🌐 Online Search Result for "${q}": ${data.query.search[0].snippet.replace(/(<([^>]+)>)/gi, "")}... (Source: Wikipedia)` : `I searched online for "${q}", but could not find a direct match.`;
            } catch (e) {
                reply = "I tried searching online, but encountered a network issue.";
            }
        } else {
            // Professional responses, completely slang-free
            if (mode === 'friend') {
                if (text.includes('hi') || text.includes('hello') || text.includes('greetings')) {
                    reply = "Hello. I am here to support you. How are you feeling today?";
                } else if (text.includes('stress') || text.includes('bad') || text.includes('sad') || text.includes('hard') || text.includes('problem')) {
                    reply = "I understand that you are going through a difficult moment. Take a deep breath. Would you like to talk about what is causing this stress so we can address it step by step?";
                } else {
                    const professionalFriendReplies = [
                        "I understand your perspective. Please share more details so I can assist you effectively.",
                        "That is an interesting point. How would you like to proceed with this?",
                        "I am listening and ready to help you analyze this situation thoroughly."
                    ];
                    reply = professionalFriendReplies[Math.floor(Math.random() * professionalFriendReplies.length)];
                }
            } else if (mode === 'b2b') {
                reply = "For business-to-business growth, focusing on high-value client acquisition, robust relationship management, and secure long-term contracts is essential.";
            } else if (mode === 'b2c') {
                reply = "For business-to-consumer success, ensuring a seamless user checkout experience, transparent pricing, and responsive customer support are vital.";
            } else if (mode === 'learning') {
                reply = "📚 Learning mode active: Let us analyze this topic methodically. Which academic subject or concept would you like to focus on today?";
            } else if (mode === 'languages') {
                reply = "🗣️ Languages mode active: Let us practice. Please provide a sentence or phrase you wish to study, and I will assist you with translation, correct pronunciation rules, and grammar analysis.";
            }
        }

        let aiLbl = `AI (${mode.toUpperCase()} [${lang.toUpperCase()}])`;
        pushMessage(aiLbl, reply);
    }

    cameraInput.addEventListener('change', (e) => {
        if (e.target.files[0]) pushMessage("You", "[Captured Photo from Camera]");
    });
    photoInput.addEventListener('change', (e) => {
        if (e.target.files[0]) pushMessage("You", `[Uploaded Photo: ${e.target.files[0].name}]`);
    });
    fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) pushMessage("You", `[Uploaded File: ${e.target.files[0].name}]`);
    });

    let isRec = false;
    recordBtn.addEventListener('click', async () => {
        isRec = !isRec;
        if (isRec) {
            recordBtn.style.background = '#d9534f';
            chatBox.innerHTML += `<div><b>System:</b> Recording audio... Click mic again to stop.</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            recordBtn.style.background = '#444';
            pushMessage("You", "[Voice Recording Sent]");
            await getAIResponse("I have sent a voice message regarding my current situation and need professional support.");
        }
    });

    async function handleSend() {
        let raw = userInput.value.trim();
        if (!raw) return;
        pushMessage("You", raw);
        userInput.value = '';
        await getAIResponse(raw);
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
});
                                
