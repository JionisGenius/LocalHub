(function (LocalHub) {
  LocalHub.features.createChatbot = ({ Vue, embeddedData, chatKeywords, formatEventDate }) => {
    const { ref, nextTick } = Vue;
    const showChat = ref(false);
    const showKeyModal = ref(false);
    const apiKey = ref(localStorage.getItem('localhub_api_key') || '');
    const tempApiKey = ref(apiKey.value);
    const chatInput = ref('');
    const chatMessages = ref([
      {
        id: 1,
        sender: 'bot',
        text: '안녕하세요! LocalHub 경북 인공지능 도우미입니다. 구미/경북 권역의 먹거리, 놀거리, 숙소 정보를 데이터 기반으로 안내해 드릴게요. 무엇이 궁금하신가요?'
      }
    ]);

    const scrollChatToBottom = () => {
      nextTick(() => {
        const chatBox = document.getElementById('chat-box');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
      });
    };

    const toggleChat = () => {
      showChat.value = !showChat.value;
      if (showChat.value) scrollChatToBottom();
    };

    const saveApiKey = () => {
      apiKey.value = tempApiKey.value.trim();
      localStorage.setItem('localhub_api_key', apiKey.value);
      showKeyModal.value = false;
      alert('OpenAI API Key가 설정되었습니다. 이제 인공지능이 응답할 수 있습니다.');
    };

    const simulateLocalSearch = (text) => {
      const query = text.toLowerCase();

      if (query.includes('금오산') || query.includes('관광지')) {
        const list = embeddedData.관광지.items
          .map(({ title, addr1 }) => `- 📍 [${title}]: ${addr1}`)
          .join('\n');
        return `🌄 [금오산 및 경북 추천 관광지 정보]\n\n구미/경북의 대표 명소는 다음과 같습니다:\n${list}\n\n도립공원은 하이킹 코스로도 일품이며, 케이블카 및 도선굴 코스를 가장 추천합니다!`;
      }

      if (query.includes('축제') || query.includes('일정')) {
        const list = embeddedData.festival.items
          .map((festival) => `- 🎉 [${festival.title}]: ${formatEventDate(festival.eventstartdate)} ~ ${formatEventDate(festival.eventenddate)} (${festival.addr1})`)
          .join('\n');
        return `🎈 [2026 구미/경북 주요 페스티벌 안내]\n\n${list}\n\n특히 11월에 개최되는 구미라면 축제는 로컬 라면 미식 팝업이 성대하게 열립니다!`;
      }

      if (query.includes('레포츠') || query.includes('캠핑')) {
        const list = embeddedData.레포츠.items
          .map(({ title, addr1 }) => `- ⛺ [${title}]: ${addr1}`)
          .join('\n');
        return `🐎 [액티브 레포츠 & 캠핑 장소 추천]\n\n${list}\n\n금오산 야영장이나 낙동강 캠핑장은 사전 예약제로 운영되며 풍경이 우수합니다.`;
      }

      if (query.includes('시장') || query.includes('쇼핑')) {
        const list = embeddedData.쇼핑.items
          .map(({ title, addr1 }) => `- 🛍️ [${title}]: ${addr1}`)
          .join('\n');
        return `🛒 [전통시장 및 현대 쇼핑센터 가이드]\n\n${list}\n\n새마을중앙시장의 원조 국수와 순대는 현지인들이 적극 추천하는 소울푸드입니다!`;
      }

      if (query.includes('맛집') || query.includes('먹거리')) {
        return '🍕 [구미/경북 대표 로컬푸드 안내]\n\n1. 금리단길 트렌디 브런치 카페\n2. 새마을중앙시장 찹쌀 순대\n3. 원평동 찜갈비 & 매운탕 코스\n\n원하시는 테마의 장소를 말씀하시면 세부 명소를 탐색해 드립니다.';
      }

      return "ℹ️ [LocalHub 안내]\n보내주신 질문을 이해했습니다.\n'관광지', '레포츠', '축제', '시장', '맛집' 등의 키워드를 포함해 질문해주시면 구미/경북의 정적 DB에서 즉시 정확한 장소를 매핑하여 드리겠습니다.\n\n*실제 AI 모델 응답을 원하시면 우측 상단 톱니바퀴 버튼을 눌러 OpenAI sk-... 키를 입력해주세요!*";
    };

    const fetchOpenAIChat = async (text) => {
      if (apiKey.value) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey.value}`
          },
          body: JSON.stringify({
            model: 'gpt-5-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a professional local travel guide chatbot named "LocalHub AI Assistant" for Gumi and Gyeongbuk, South Korea. Answer briefly and friendly in Korean.'
              },
              { role: 'user', content: text }
            ]
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'OpenAI API Error');
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '답변을 가져오지 못했습니다.';
      }

      const invalidPreview = window.location.protocol.startsWith('blob')
        || window.location.protocol.startsWith('file')
        || window.location.origin === 'null'
        || !window.location.origin;

      if (invalidPreview) {
        return `${simulateLocalSearch(text)}\n\n*(안내: 현재 로컬/프리뷰 환경이며 개별 API Key가 설정되지 않았습니다.)*`;
      }

      try {
        const response = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Serverless function error');
        }

        const data = await response.json();
        return data.reply;
      } catch (error) {
        console.warn('Netlify Function 호출 실패:', error.message);
        return `${simulateLocalSearch(text)}\n\n*(안내: 서버리스 함수 연결에 실패하여 로컬 데이터로 답변했습니다.)*`;
      }
    };

    const sendChatMessage = async () => {
      const userText = chatInput.value.trim();
      if (!userText) return;

      chatMessages.value.push({ id: Date.now(), sender: 'user', text: userText });
      chatInput.value = '';
      scrollChatToBottom();

      const loadingId = Date.now() + 1;
      chatMessages.value.push({
        id: loadingId,
        sender: 'bot',
        text: '데이터를 분석하여 답변을 준비하고 있습니다... 🤖'
      });
      scrollChatToBottom();

      try {
        const responseText = await fetchOpenAIChat(userText);
        chatMessages.value = chatMessages.value.filter(({ id }) => id !== loadingId);
        chatMessages.value.push({ id: Date.now() + 2, sender: 'bot', text: responseText });
      } catch (error) {
        chatMessages.value = chatMessages.value.filter(({ id }) => id !== loadingId);
        chatMessages.value.push({
          id: Date.now() + 2,
          sender: 'bot',
          text: `서버와 통신하는 중 오류가 발생했습니다. ${error.message}`
        });
      }

      scrollChatToBottom();
    };

    const sendKeyword = (keyword) => {
      chatInput.value = keyword;
      sendChatMessage();
    };

    return {
      showChat,
      showKeyModal,
      apiKey,
      tempApiKey,
      chatInput,
      chatMessages,
      chatKeywords,
      toggleChat,
      saveApiKey,
      sendChatMessage,
      sendKeyword
    };
  };
})(window.LocalHub);
