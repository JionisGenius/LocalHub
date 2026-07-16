(function (LocalHub) {
  const STORAGE_KEY = 'localhub_lang';
  const DEFAULT_LANGUAGE = 'ko';
  const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja', 'zh'];

  const locales = {
    ko: {
      gumi_gb: '구미/경북',
      home: '홈', board: '익명게시판', map: '지역정보 맵', weather: '날씨',
      calendar: '축제 캘린더', dashboard: '통계 대시보드', game: '구미 생존기', write: '글쓰기',
      hero_title: '구미/경북의 활기찬 이야기,',
      hero_subtitle: '로컬허브에서 만나보세요',
      hero_desc: '행정 인증 관광지부터 골목 상권, 생생한 주민 축제 소식까지 공공데이터 기반으로 투명하고 유익한 지역 밀착형 익명 커뮤니티입니다.',
      go_board: '게시판 보러가기', go_map: '지역 관광 지도', go_game: '구미 생존기',
      what_curious: '무엇이 궁금하신가요?', realtime_feed: '실시간 로컬 피드', view_all: '전체보기',
      monthly_festival: '이달의 축제 소식', view_in_calendar: '캘린더에서 보기',
      empty_post: '작성된 글이 없습니다. 첫 이야기를 남겨보세요!',
      all: '전체', cat_tour: '관광지', cat_leports: '레포츠', cat_culture: '문화시설',
      cat_shopping: '쇼핑', cat_accom: '숙박', cat_course: '여행코스', cat_food: '음식점', cat_festival: '축제공연행사',
      map_title: '구미/경북 스마트 지역정보 맵', map_desc: '업로드된 공공데이터 8종의 장소를 카테고리와 검색어로 찾아보세요.',
      map_search_placeholder: '장소명, 주소, 카테고리 검색', map_place_list: '장소 목록',
      map_click_hint: '클릭 시 위치로 이동', map_no_coordinates: '좌표 없음', map_load_more: '더 보기', map_empty: '검색 결과가 없습니다.',
      weather_title: '경북 구미 현재 날씨', weather_location: '대한민국 경상북도 구미시',
      weather_desc: '실시간 기상 정보와 오늘의 기온 범위를 확인하세요.',
      weather_refresh: '날씨 새로고침', weather_loading: '날씨 정보를 불러오는 중입니다.',
      weather_updated: '업데이트', feels_like: '체감', humidity: '습도', wind_speed: '풍속',
      precipitation: '강수량', wind_direction: '풍향', today_range: '오늘 최저 / 최고',
      rain_probability: '강수 확률', weather_error: '날씨 정보를 불러오지 못했습니다. 인터넷 연결 후 다시 시도해주세요.',
      weather_source: '날씨 데이터: Open-Meteo'
    },
    en: {
      gumi_gb: 'Gumi/Gyeongbuk',
      home: 'Home', board: 'Community', map: 'Local Map', weather: 'Weather',
      calendar: 'Festival Calendar', dashboard: 'Dashboard', game: 'Gumi Survival', write: 'Write',
      hero_title: 'Vibrant stories of Gumi and Gyeongbuk,',
      hero_subtitle: 'discover them at LocalHub',
      hero_desc: 'A transparent local community powered by public data, from certified attractions and neighborhood businesses to resident festival news.',
      go_board: 'Go to Community', go_map: 'Local Tourist Map', go_game: 'Gumi Survival',
      what_curious: 'What are you curious about?', realtime_feed: 'Real-time Local Feed', view_all: 'View All',
      monthly_festival: "This Month's Festivals", view_in_calendar: 'View in Calendar',
      empty_post: 'No posts yet. Leave the first story!',
      all: 'All', cat_tour: 'Tourist Spots', cat_leports: 'Leisure/Sports', cat_culture: 'Culture',
      cat_shopping: 'Shopping', cat_accom: 'Accommodation', cat_course: 'Travel Courses', cat_food: 'Restaurants', cat_festival: 'Festivals/Events',
      map_title: 'Gumi/Gyeongbuk Local Information Map', map_desc: 'Browse places from eight uploaded public datasets by category or keyword.',
      map_search_placeholder: 'Search place, address, or category', map_place_list: 'Places',
      map_click_hint: 'Click to move', map_no_coordinates: 'No coordinates', map_load_more: 'Load more', map_empty: 'No matching places found.',
      weather_title: 'Current Weather in Gumi', weather_location: 'Gumi, Gyeongsangbuk-do, South Korea',
      weather_desc: "Check live conditions and today's temperature range.",
      weather_refresh: 'Refresh weather', weather_loading: 'Loading weather data.',
      weather_updated: 'Updated', feels_like: 'Feels like', humidity: 'Humidity', wind_speed: 'Wind speed',
      precipitation: 'Precipitation', wind_direction: 'Wind direction', today_range: 'Today low / high',
      rain_probability: 'Rain probability', weather_error: 'Unable to load weather data. Please check your connection and try again.',
      weather_source: 'Weather data: Open-Meteo'
    },
    ja: {
      gumi_gb: '亀尾/慶北',
      home: 'ホーム', board: 'コミュニティ', map: '地域情報マップ', weather: '天気',
      calendar: '祭りカレンダー', dashboard: 'ダッシュボード', game: '亀尾サバイバル', write: '投稿する',
      hero_title: '亀尾・慶北の活気ある物語を、',
      hero_subtitle: 'LocalHubで見つけてください',
      hero_desc: '行政認定の観光地や地域商圏、住民の祭り情報まで、公共データに基づく透明で役立つ地域コミュニティです。',
      go_board: '掲示板を見る', go_map: '地域観光マップ', go_game: '亀尾サバイバル',
      what_curious: '何が気になりますか？', realtime_feed: 'ローカルフィード', view_all: 'すべて見る',
      monthly_festival: '今月のお祭り情報', view_in_calendar: 'カレンダーで見る',
      empty_post: '投稿がありません。最初の話を残してみましょう！',
      all: '全体', cat_tour: '観光地', cat_leports: 'レジャースポーツ', cat_culture: '文化施設',
      cat_shopping: 'ショッピング', cat_accom: '宿泊', cat_course: '旅行コース', cat_food: '飲食店', cat_festival: '祭り・公演',
      map_title: '亀尾・慶北 地域情報マップ', map_desc: 'アップロードされた8種類の公共データをカテゴリやキーワードで検索できます。',
      map_search_placeholder: '場所名・住所・カテゴリを検索', map_place_list: '場所一覧',
      map_click_hint: 'クリックで移動', map_no_coordinates: '座標なし', map_load_more: 'さらに表示', map_empty: '検索結果がありません。',
      weather_title: '慶尚北道亀尾の現在の天気', weather_location: '韓国 慶尚北道 亀尾市',
      weather_desc: '現在の気象情報と今日の気温範囲を確認できます。',
      weather_refresh: '天気を更新', weather_loading: '天気情報を読み込んでいます。',
      weather_updated: '更新', feels_like: '体感', humidity: '湿度', wind_speed: '風速',
      precipitation: '降水量', wind_direction: '風向', today_range: '今日の最低 / 最高',
      rain_probability: '降水確率', weather_error: '天気情報を読み込めませんでした。接続を確認してもう一度お試しください。',
      weather_source: '気象データ: Open-Meteo'
    },
    zh: {
      gumi_gb: '龟尾/庆北',
      home: '首页', board: '社区', map: '地区地图', weather: '天气',
      calendar: '节日日历', dashboard: '仪表盘', game: '龟尾生存记', write: '写文章',
      hero_title: '龟尾与庆北的活力故事，',
      hero_subtitle: '尽在LocalHub',
      hero_desc: '从官方认证景点、社区商圈到居民节庆资讯，这是一个基于公共数据、透明且实用的本地社区。',
      go_board: '前往社区', go_map: '当地旅游地图', go_game: '龟尾生存记',
      what_curious: '您对什么感兴趣？', realtime_feed: '实时本地动态', view_all: '查看全部',
      monthly_festival: '本月节日资讯', view_in_calendar: '在日历中查看',
      empty_post: '暂无文章。留下第一个故事吧！',
      all: '全部', cat_tour: '旅游景点', cat_leports: '休闲运动', cat_culture: '文化设施',
      cat_shopping: '购物', cat_accom: '住宿', cat_course: '旅游路线', cat_food: '餐厅', cat_festival: '节日活动',
      map_title: '龟尾／庆北地区信息地图', map_desc: '可按分类或关键词浏览上传的八类公共数据地点。',
      map_search_placeholder: '搜索地点、地址或分类', map_place_list: '地点列表',
      map_click_hint: '点击移动', map_no_coordinates: '无坐标', map_load_more: '加载更多', map_empty: '没有匹配的地点。',
      weather_title: '庆尚北道龟尾当前天气', weather_location: '韩国庆尚北道龟尾市',
      weather_desc: '查看实时天气和今日温度范围。',
      weather_refresh: '刷新天气', weather_loading: '正在加载天气信息。',
      weather_updated: '更新时间', feels_like: '体感', humidity: '湿度', wind_speed: '风速',
      precipitation: '降水量', wind_direction: '风向', today_range: '今日最低 / 最高',
      rain_probability: '降水概率', weather_error: '无法加载天气信息。请检查网络连接后重试。',
      weather_source: '天气数据：Open-Meteo'
    }
  };

  LocalHub.features.createI18n = ({ Vue }) => {
    const { ref, computed } = Vue;
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    const currentLang = ref(SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE);
    const languageMenuOpen = ref(false);

    const localeCode = computed(() => ({
      ko: 'ko-KR', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN'
    })[currentLang.value]);

    const currentLangLabel = computed(() => ({
      ko: '한국어', en: 'English', ja: '日本語', zh: '中文'
    })[currentLang.value]);

    const t = (key) => locales[currentLang.value]?.[key] ?? locales[DEFAULT_LANGUAGE]?.[key] ?? key;

    const translateCategory = (categoryName) => {
      const categoryKeys = {
        전체: 'all', 관광지: 'cat_tour', 레포츠: 'cat_leports', 문화시설: 'cat_culture',
        쇼핑: 'cat_shopping', 숙박: 'cat_accom', 여행코스: 'cat_course', 음식점: 'cat_food',
        축제: 'cat_festival', 축제공연행사: 'cat_festival'
      };
      return t(categoryKeys[categoryName] || categoryName);
    };

    const localText = (value) => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return value ?? '';
      return value[currentLang.value] ?? value.ko ?? value.en ?? Object.values(value)[0] ?? '';
    };

    const changeLanguage = (language) => {
      if (!SUPPORTED_LANGUAGES.includes(language)) return;
      currentLang.value = language;
      localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language;
      languageMenuOpen.value = false;
    };

    document.documentElement.lang = currentLang.value;

    return {
      currentLang,
      currentLangLabel,
      languageMenuOpen,
      localeCode,
      t,
      translateCategory,
      localText,
      changeLanguage
    };
  };
})(window.LocalHub);
