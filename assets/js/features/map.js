(function (LocalHub) {
  const INITIAL_LIST_LIMIT = 80;
  const LIST_PAGE_SIZE = 80;

  const MARKER_COLORS = {
    관광지: '#16a34a',
    레포츠: '#ea580c',
    문화시설: '#2563eb',
    쇼핑: '#ca8a04',
    숙박: '#9333ea',
    여행코스: '#0f766e',
    음식점: '#dc2626',
    축제: '#db2777'
  };

  LocalHub.features.createMap = ({ Vue, Leaflet, mapData, localText, translateCategory }) => {
    const { ref, computed, nextTick, watch } = Vue;
    const items = Array.isArray(mapData?.items) ? mapData.items : [];

    const selectedMapType = ref('전체');
    const mapSearchQuery = ref('');
    const mapListLimit = ref(INITIAL_LIST_LIMIT);

    const mapTypes = [
      { name: '전체', value: '전체', count: items.length },
      ...(mapData?.categories || [])
    ];

    const filteredMapItems = computed(() => {
      const query = mapSearchQuery.value.trim().toLocaleLowerCase();

      return items.filter((item) => {
        const matchesType = selectedMapType.value === '전체'
          || item.contentType === selectedMapType.value;

        if (!matchesType || !query) return matchesType;

        const searchableText = [
          localText(item.title),
          localText(item.addr1),
          localText(item.addr2),
          localText(item.contentTypeName),
          item.tel
        ].join(' ').toLocaleLowerCase();

        return searchableText.includes(query);
      });
    });

    const visibleMapItems = computed(() => (
      filteredMapItems.value.slice(0, mapListLimit.value)
    ));

    const remainingMapItemCount = computed(() => Math.max(
      0,
      filteredMapItems.value.length - visibleMapItems.value.length
    ));

    let leafletMap = null;
    let markerLayer = null;
    let canvasRenderer = null;
    let searchTimer = null;
    const markersByContentId = new Map();

    const escapeHtml = (value) => String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

    const formatAddress = (item) => [localText(item.addr1), localText(item.addr2)]
      .filter(Boolean)
      .join(' ');

    const formatEventDate = (dateValue) => {
      if (!/^\d{8}$/.test(dateValue || '')) return '';
      return `${dateValue.slice(0, 4)}.${dateValue.slice(4, 6)}.${dateValue.slice(6, 8)}`;
    };

    const createPopupContent = (item) => {
      const title = escapeHtml(localText(item.title));
      const address = escapeHtml(formatAddress(item));
      const category = escapeHtml(translateCategory(localText(item.contentTypeName)));
      const image = item.firstimage
        ? `<img src="${escapeHtml(item.firstimage)}" alt="" loading="lazy" style="width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:8px;">`
        : '';
      const telephone = item.tel
        ? `<p style="margin:5px 0 0;color:#64748b;font-size:11px;">☎ ${escapeHtml(item.tel)}</p>`
        : '';
      const eventPeriod = item.eventstartdate
        ? `<p style="margin:5px 0 0;color:#475569;font-size:11px;">${formatEventDate(item.eventstartdate)}${item.eventenddate ? ` ~ ${formatEventDate(item.eventenddate)}` : ''}</p>`
        : '';

      return `
        <div style="width:210px;line-height:1.4;">
          ${image}
          <strong style="display:block;color:#4338ca;font-size:14px;">${title}</strong>
          <p style="margin:5px 0 0;color:#64748b;font-size:11px;">${address || '-'}</p>
          ${eventPeriod}
          ${telephone}
          <span style="display:inline-block;margin-top:7px;padding:2px 6px;border-radius:999px;background:#eef2ff;color:#4338ca;font-size:10px;font-weight:700;">${category}</span>
        </div>`;
    };

    const updateMapMarkers = () => {
      if (!leafletMap || !markerLayer) return;

      markerLayer.clearLayers();
      markersByContentId.clear();

      filteredMapItems.value.forEach((item) => {
        if (!item.hasCoordinates) return;

        const markerColor = MARKER_COLORS[item.contentType] || '#4f46e5';
        const marker = Leaflet.circleMarker([item.lat, item.lng], {
          renderer: canvasRenderer,
          radius: 6,
          color: '#ffffff',
          weight: 1.5,
          fillColor: markerColor,
          fillOpacity: 0.9
        })
          .bindPopup(() => createPopupContent(item), { maxWidth: 250 })
          .addTo(markerLayer);

        markersByContentId.set(item.contentid, marker);
      });
    };

    const initMap = () => {
      if (!Leaflet || !document.getElementById('leaflet-map')) return;

      if (leafletMap) leafletMap.remove();

      leafletMap = Leaflet.map('leaflet-map', {
        preferCanvas: true
      }).setView([36.119485, 128.34446], 10);

      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(leafletMap);

      canvasRenderer = Leaflet.canvas({ padding: 0.5 });
      markerLayer = Leaflet.layerGroup().addTo(leafletMap);
      updateMapMarkers();
    };

    const filterMapType = (type) => {
      selectedMapType.value = type;
      mapListLimit.value = INITIAL_LIST_LIMIT;
      nextTick(updateMapMarkers);
    };

    const focusOnMapItem = (item) => {
      if (!item?.hasCoordinates || !leafletMap) return;

      leafletMap.setView([item.lat, item.lng], 14);
      markersByContentId.get(item.contentid)?.openPopup();
    };

    const loadMoreMapItems = () => {
      mapListLimit.value += LIST_PAGE_SIZE;
    };

    watch(mapSearchQuery, () => {
      mapListLimit.value = INITIAL_LIST_LIMIT;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(updateMapMarkers, 180);
    });

    return {
      selectedMapType,
      mapSearchQuery,
      mapTypes,
      filteredMapItems,
      visibleMapItems,
      remainingMapItemCount,
      initMap,
      filterMapType,
      focusOnMapItem,
      loadMoreMapItems
    };
  };
})(window.LocalHub);
