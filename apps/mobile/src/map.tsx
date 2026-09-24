import type { ParishJumuiya } from '@ebenezer/shared';
import { useMemo, type ReactElement } from 'react';
import { WebView } from 'react-native-webview';

export function JumuiyaMap({
  points,
  selectedId,
  gold,
  ink,
  onSelect,
}: {
  points: ParishJumuiya[];
  selectedId: string | null;
  gold: string;
  ink: string;
  onSelect: (id: string) => void;
}) {
  const html = useMemo(() => {
    const marks = points
      .filter((item) => item.lat != null && item.lng != null)
      .map((item) => ({
        id: item.id,
        name: item.name,
        place: item.place,
        lat: item.lat,
        lng: item.lng,
        mine: item.id === selectedId,
      }));
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html, body, #map { height: 100%; margin: 0; background: #E9E6DF; }
  .leaflet-control-attribution { font-size: 10px; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  const points = ${JSON.stringify(marks)};
  const map = L.map('map', { zoomControl: false, attributionControl: true });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
  const bounds = [];
  points.forEach((point) => {
    const marker = L.circleMarker([point.lat, point.lng], {
      radius: point.mine ? 11 : 8,
      color: point.mine ? ${JSON.stringify(gold)} : ${JSON.stringify(ink)},
      weight: 2,
      fillColor: point.mine ? ${JSON.stringify(gold)} : '#F6F4F0',
      fillOpacity: 1
    }).addTo(map);
    marker.bindPopup('<strong>' + point.name + '</strong><br>' + point.place);
    marker.on('click', () => {
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(point.id);
    });
    bounds.push([point.lat, point.lng]);
  });
  if (bounds.length) map.fitBounds(bounds, { padding: [28, 28] });
</script>
</body>
</html>`;
  }, [gold, ink, points, selectedId]);

  const MapView = WebView as unknown as (props: {
    originWhitelist?: string[];
    source?: { html: string };
    style?: object;
    onMessage?: (event: { nativeEvent: { data: string } }) => void;
    setSupportMultipleWindows?: boolean;
  }) => ReactElement;
  return (
    <MapView
      originWhitelist={['*']}
      source={{ html }}
      style={{ height: 280, backgroundColor: 'transparent' }}
      onMessage={(event) => onSelect(event.nativeEvent.data)}
      setSupportMultipleWindows={false}
    />
  );
}
