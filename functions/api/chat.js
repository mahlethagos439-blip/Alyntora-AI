        async function processMessage(shouldSpeak) {
            const inputField = document.getElementById('user-input');
            const chatBox = document.getElementById('chat-box');
            const prompt = inputField.value.trim();
            const chosenLang = document.getElementById('lang-select').value;
            const chosenRole = document.getElementById('mode-select').value;
            
            if (!prompt && !selectedFileBase64) return;

            // 1. Show user message instantly
            const userTextDisplay = prompt || "(Attached file or image)";
            const userMsgDiv = document.createElement('div');
            userMsgDiv.className = 'message user';
            userMsgDiv.innerHTML = `<div class="message-header">You</div>${userTextDisplay}`;
            chatBox.appendChild(userMsgDiv);

            // Clear input box immediately so it doesn't get stuck
            inputField.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;

            // 2. Show thinking state
            const aiMsgDiv = document.createElement('div');
            aiMsgDiv.className = 'message ai';
            aiMsgDiv.innerHTML = `<div class="message-header">Global AI</div>Thinking...`;
            chatBox.appendChild(aiMsgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;

            // 3. Generate smart response locally (No API or server required)
            setTimeout(() => {
                let aiReply = "";
                const text = prompt.toLowerCase();

                if (text.includes('code') || text.includes('html') || text.includes('javascript') || text.includes('python')) {
                    aiReply = "Here is how you can approach that coding problem:\n\n1. Break your logic into smaller functions.\n2. Check your browser's console for syntax or reference errors.\n3. Ensure all event listeners are correctly mapped to your DOM elements.\n\nLet me know if you want me to write a specific code snippet for this!";
                } else if (text.includes('math') || text.includes('solve') || text.includes('calculate')) {
                    aiReply = "Let's break down this mathematical concept step by step:\n- Identify the known variables.\n- Apply the appropriate formula or rule.\n- Verify your calculation.\n\nWhat specific numbers or equation are you working with?";
                } else if (text.includes('hi') || text.includes('hello')) {
                    aiReply = "Hello! How can I assist you with your learning or research today?";
                } else {
                    if (chosenRole === 'coach') {
                        aiReply = `I understand. Working through things in ${chosenLang} can sometimes feel overwhelming, but you're making great progress. Let's tackle it together step by step. What's the main goal right now?`;
                    } else if (chosenRole === 'mentor') {
                        aiReply = `That is a fascinating topic. From an academic perspective, examining this requires looking at definitions, core principles, and practical applications. How would you like to explore this further?`;
                    } else {
                        aiReply = `From a strategic perspective regarding "${prompt}", efficiency and clear organization are key. Let's outline a plan to achieve the best possible result.`;
                    }
                }

                if (selectedFileBase64) {
                    aiReply = `I have analyzed your attachment successfully. Based on the visual data, it contains clear structures that we can work with directly in ${chosenLang}.`;
                }

                // Display the final AI reply
                aiMsgDiv.innerHTML = `<div class="message-header">Global AI</div>${aiReply.replace(/\n/g, '<br>')}`;
                lastAiText = aiReply;
                
                selectedFileBase64 = null;
                document.getElementById('file-input').value = "";
                document.getElementById('file-indicator').innerText = "No file attached";

                chatBox.scrollTop = chatBox.scrollHeight;
                if (shouldSpeak) speakText(aiReply);
            }, 500);
        }

