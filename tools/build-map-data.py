"""지역 JSON 8종을 브라우저에서 바로 읽는 지도 데이터 모듈로 변환한다."""

from __future__ import annotations

import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = PROJECT_ROOT / "assets/data/source"
OUTPUT_PATH = PROJECT_ROOT / "assets/js/data/map-data.js"

SOURCE_SPECS = (
    ("attractions.json", "관광지", "관광지"),
    ("leports.json", "레포츠", "레포츠"),
    ("culture.json", "문화시설", "문화시설"),
    ("shopping.json", "쇼핑", "쇼핑"),
    ("accommodation.json", "숙박", "숙박"),
    ("travel-courses.json", "여행코스", "여행코스"),
    ("restaurants.json", "음식점", "음식점"),
    ("festivals.json", "축제", "축제공연행사"),
)


def normalize_image_url(value: str) -> str:
    """한국관광공사 이미지의 HTTP 주소를 HTTPS로 통일한다."""
    if value.startswith("http://tong.visitkorea.or.kr/"):
        return "https://" + value.removeprefix("http://")
    return value


def number(value: object) -> float:
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


def normalize_item(raw: dict, map_type: str, display_name: str) -> dict:
    lat = number(raw.get("mapy"))
    lng = number(raw.get("mapx"))

    item = {
        "contentid": str(raw.get("contentid") or ""),
        "title": raw.get("title") or "",
        "addr1": raw.get("addr1") or "",
        "addr2": raw.get("addr2") or "",
        "contentType": map_type,
        "contentTypeName": display_name,
        "lat": lat,
        "lng": lng,
        "hasCoordinates": bool(lat and lng),
        "firstimage": normalize_image_url(raw.get("firstimage") or ""),
        "tel": raw.get("tel") or "",
        "zipcode": raw.get("zipcode") or "",
    }

    # 축제 마커 팝업에서 일정 정보를 표시한다.
    for key in ("eventstartdate", "eventenddate", "eventplace", "playtime", "usetimefestival"):
        if raw.get(key):
            item[key] = raw[key]

    return item


def build_map_data() -> dict:
    items: list[dict] = []
    categories: list[dict] = []

    for filename, map_type, display_name in SOURCE_SPECS:
        source = json.loads((SOURCE_DIR / filename).read_text(encoding="utf-8"))
        category_items = [
            normalize_item(raw, map_type, display_name)
            for raw in source.get("items", [])
        ]
        items.extend(category_items)
        categories.append({
            "name": display_name,
            "value": map_type,
            "count": len(category_items),
        })

    return {
        "region": "구미_경북권",
        "total": len(items),
        "coordinateTotal": sum(item["hasCoordinates"] for item in items),
        "missingCoordinateTotal": sum(not item["hasCoordinates"] for item in items),
        "categories": categories,
        "items": items,
    }


def main() -> None:
    map_data = build_map_data()
    payload = json.dumps(map_data, ensure_ascii=False, separators=(",", ":"))
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        "(function (LocalHub) {\n"
        "  // 업로드된 지역 공공데이터를 지도 전용 형식으로 정규화한 정적 데이터다.\n"
        f"  LocalHub.data.mapData = {payload};\n"
        "})(window.LocalHub);\n",
        encoding="utf-8",
    )

    print(
        f"generated: {OUTPUT_PATH}\n"
        f"items: {map_data['total']}\n"
        f"coordinates: {map_data['coordinateTotal']}\n"
        f"missing coordinates: {map_data['missingCoordinateTotal']}"
    )


if __name__ == "__main__":
    main()
