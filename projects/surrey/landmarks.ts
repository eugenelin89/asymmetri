// SPDX-License-Identifier: MIT — source-backed locations, explicitly stylized architecture.
import type { City, Point } from "./types";
export function landmarks(city: City) {
  const civic = (name: string, fallback: Point): Point => city.civic.find(p => p.name === name)?.centre ?? fallback;
  const park = city.parks.find(p => p.name === "Holland Park")?.shape[0];
  const holland: Point = park ? [park.reduce((s, p) => s + p[0], 0) / park.length, park.reduce((s, p) => s + p[1], 0) / park.length] : [-150, 580];
  return [
    { id: "station", name: "Surrey Central Station", point: [80, 0] as Point, height: 18 },
    { id: "central", name: "Central City", point: civic("CENTRAL CITY", [-4, 355]), height: 36 },
    { id: "sfu", name: "SFU Surrey · Central City", point: civic("SFU", [-42, 197]), height: 120 },
    { id: "hall", name: "Surrey City Hall", point: civic("SURREY CITY HALL", [-17, -202]), height: 40 },
    { id: "library", name: "City Centre Library", point: civic("CITY CENTRE LIBRARY", [-27, -122]), height: 26 },
    { id: "civic", name: "Civic Plaza", point: [20, -166] as Point, height: 8 },
    { id: "tower", name: "3 Civic Plaza", point: civic("KPU (CIVIC PLAZA)", [64, -115]), height: 168 },
    { id: "holland", name: "Holland Park", point: holland, height: 10 },
  ];
}
export const architecturalReferences = [
  { place: "Surrey Central Station", url: "https://officemb.ca/projects/surrey-central-skytrain-station/", cues: "Glazed north stationhouse, entrances and vertical circulation." },
  { place: "Central City / SFU", url: "https://www.sfu.ca/surrey/about/our-locations/sfu-at-central-city.html", cues: "Mall, university space and office tower composition." },
  { place: "Central City atrium", url: "https://structurecraft.com/projects/central-city-atrium-facade", cues: "Sweeping glass facade, timber columns and concrete canopy." },
  { place: "City Hall", url: "https://kasian.com/project/surrey-city-hall-and-civic-centre/", cues: "Cantilevered roof and glass atrium." },
  { place: "City Centre Library", url: "https://reveryarchitecture.com/projects/surrey-city-centre-library/", cues: "Angled concrete/glass walls, white floor ribbons and skylights." },
  { place: "Civic Plaza", url: "https://www.surrey.ca/news-events/events/surrey-civic-plaza", cues: "Public outdoor space, separate from the tall Civic Plaza building." },
  { place: "Holland Park", url: "https://www.surrey.ca/parks-recreation/parks/holland-park", cues: "Gardens, fountain and amphitheatre." },
];
