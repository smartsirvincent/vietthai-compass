import { BANGKOK_TRANSIT_LINES, BANGKOK_TRANSIT_STATIONS } from "@/lib/bangkok-transit";

export function BangkokTransitStationFields({ defaultValue = [] }: { defaultValue?: string[] }) {
  return (
    <fieldset className="bangkok-station-fields">
      <legend>曼谷捷運站</legend>
      <p>依店家所在商圈選擇可作為到達參考的站點；可複選。非曼谷商家請留空。</p>
      <div className="bangkok-station-options">
        {BANGKOK_TRANSIT_LINES.map((line) => (
          <div className="bangkok-station-group" key={line.id}>
            <strong>{line.label}</strong>
            {line.stations.map((stationId) => {
              const station = BANGKOK_TRANSIT_STATIONS.find((item) => item.id === stationId)!;
              return <label className="checkbox-field" key={station.id}><input type="checkbox" name="transitStationIds" value={station.id} defaultChecked={defaultValue.includes(station.id)} /><span>{station.nameZh}站（{station.name}）</span></label>;
            })}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
