(function (LocalHub) {
  const GUMI_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast?latitude=36.1195&longitude=128.3446&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FSeoul&forecast_days=1';

  const weatherTextMap = {
    ko: { 0:'맑음', 1:'대체로 맑음', 2:'부분적으로 흐림', 3:'흐림', 45:'안개', 48:'서리 안개', 51:'약한 이슬비', 53:'이슬비', 55:'강한 이슬비', 61:'약한 비', 63:'비', 65:'강한 비', 71:'약한 눈', 73:'눈', 75:'강한 눈', 80:'소나기', 81:'소나기', 82:'강한 소나기', 95:'뇌우', 96:'우박을 동반한 뇌우', 99:'강한 우박 뇌우' },
    en: { 0:'Clear sky', 1:'Mainly clear', 2:'Partly cloudy', 3:'Overcast', 45:'Fog', 48:'Rime fog', 51:'Light drizzle', 53:'Drizzle', 55:'Heavy drizzle', 61:'Light rain', 63:'Rain', 65:'Heavy rain', 71:'Light snow', 73:'Snow', 75:'Heavy snow', 80:'Rain showers', 81:'Rain showers', 82:'Heavy showers', 95:'Thunderstorm', 96:'Thunderstorm with hail', 99:'Heavy hail thunderstorm' },
    ja: { 0:'快晴', 1:'ほぼ晴れ', 2:'一部曇り', 3:'曇り', 45:'霧', 48:'着氷性の霧', 51:'弱い霧雨', 53:'霧雨', 55:'強い霧雨', 61:'弱い雨', 63:'雨', 65:'強い雨', 71:'弱い雪', 73:'雪', 75:'大雪', 80:'にわか雨', 81:'にわか雨', 82:'激しいにわか雨', 95:'雷雨', 96:'ひょうを伴う雷雨', 99:'激しいひょう雷雨' },
    zh: { 0:'晴朗', 1:'大致晴朗', 2:'局部多云', 3:'阴天', 45:'雾', 48:'雾凇', 51:'小毛毛雨', 53:'毛毛雨', 55:'强毛毛雨', 61:'小雨', 63:'雨', 65:'大雨', 71:'小雪', 73:'雪', 75:'大雪', 80:'阵雨', 81:'阵雨', 82:'强阵雨', 95:'雷暴', 96:'伴冰雹雷暴', 99:'强冰雹雷暴' }
  };

  LocalHub.features.createWeather = ({ Vue, currentLang, localeCode, t }) => {
    const { reactive, computed, watch } = Vue;
    const weather = reactive({
      loading: false,
      loaded: false,
      error: '',
      temperature: null,
      apparentTemperature: null,
      humidity: null,
      windSpeed: null,
      windDirection: null,
      precipitation: null,
      weatherCode: 3,
      minTemperature: null,
      maxTemperature: null,
      rainProbability: null,
      updatedTimestamp: null
    });

    const weatherDescription = computed(() => (
      weatherTextMap[currentLang.value]?.[weather.weatherCode]
      || weatherTextMap[currentLang.value]?.[3]
      || ''
    ));

    const weatherIcon = computed(() => {
      const code = weather.weatherCode;
      if (code === 0) return 'fa-solid fa-sun';
      if ([1, 2].includes(code)) return 'fa-solid fa-cloud-sun';
      if ([3, 45, 48].includes(code)) return 'fa-solid fa-cloud';
      if ([71, 73, 75].includes(code)) return 'fa-solid fa-snowflake';
      if ([95, 96, 99].includes(code)) return 'fa-solid fa-cloud-bolt';
      return 'fa-solid fa-cloud-rain';
    });

    const weatherUpdatedAt = computed(() => {
      if (!weather.updatedTimestamp) return '';
      return new Intl.DateTimeFormat(localeCode.value, {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }).format(weather.updatedTimestamp);
    });

    const normalizeNumber = (value, shouldRound = false) => {
      const number = Number(value);
      if (!Number.isFinite(number)) return null;
      return shouldRound ? Math.round(number) : number;
    };

    // Open-Meteo에서 구미의 현재·일간 기상 데이터를 가져온다.
    const fetchWeather = async () => {
      if (weather.loading) return;
      weather.loading = true;
      weather.error = '';

      try {
        const response = await fetch(GUMI_FORECAST_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const current = data.current || {};
        const daily = data.daily || {};

        weather.temperature = normalizeNumber(current.temperature_2m, true);
        weather.apparentTemperature = normalizeNumber(current.apparent_temperature, true);
        weather.humidity = normalizeNumber(current.relative_humidity_2m);
        weather.windSpeed = normalizeNumber(current.wind_speed_10m);
        weather.windDirection = normalizeNumber(current.wind_direction_10m);
        weather.precipitation = normalizeNumber(current.precipitation);
        weather.weatherCode = normalizeNumber(current.weather_code) ?? 3;
        weather.maxTemperature = normalizeNumber(daily.temperature_2m_max?.[0], true);
        weather.minTemperature = normalizeNumber(daily.temperature_2m_min?.[0], true);
        weather.rainProbability = normalizeNumber(daily.precipitation_probability_max?.[0]) ?? 0;
        weather.updatedTimestamp = new Date();
        weather.loaded = true;
      } catch (error) {
        console.warn('날씨 데이터 호출 실패:', error.message);
        weather.error = t('weather_error');
      } finally {
        weather.loading = false;
      }
    };

    const ensureWeather = () => {
      if (!weather.loaded && !weather.loading) fetchWeather();
    };

    watch(currentLang, () => {
      if (weather.error) weather.error = t('weather_error');
    });

    return {
      weather,
      weatherDescription,
      weatherIcon,
      weatherUpdatedAt,
      fetchWeather,
      ensureWeather
    };
  };
})(window.LocalHub);
