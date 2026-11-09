# Nearby campus weather

Live atmosphere uses a nearby surface observation. The station name and observation timestamp identify where and when conditions were measured. The campus clock has its own time source. The weather representation, scenery and sound are Asymmetri interpretations of the measurements.

## Station selection

Distances are straight-line approximations from the fixed explorer coordinates to the published station coordinates. Every visitor to a campus uses the same pair.

| Campus | Preferred observation | Alternate observation |
| --- | --- | --- |
| UBC | Vancouver International Airport, YVR/CYVR, about 9 km. ECCC's Vancouver City Page supplies the English condition, observation time and wind. The originator is NAV CANADA. [City Page](https://api.weather.gc.ca/collections/citypageweather-realtime/items/bc-74?f=json) · [ECCC station registry](https://api.weather.gc.ca/collections/swob-stations/items/1108395?f=json) | West Vancouver, CWWA, about 10 km. ECCC's Meteorological Service of Canada supplies surface observations at this automated station. [Station registry](https://api.weather.gc.ca/collections/swob-stations/items/1108824?f=json) · [Latest measurement](https://api.weather.gc.ca/collections/swob-realtime/items?msc_id-value=1108824&sortby=-obs_date_tm&limit=1&f=json) |
| Stanford | Palo Alto Airport, KPAO, about 6 km. [NWS station](https://api.weather.gov/stations/KPAO) | Mountain View, Moffett Field, KNUQ, about 11 km. [NWS station](https://api.weather.gov/stations/KNUQ) |
| CWRU | Cleveland, Burke Lakefront Airport, KBKL, about 6 km. [NWS station](https://api.weather.gov/stations/KBKL) | Cleveland Hopkins International Airport, KCLE, about 23 km. [NWS station](https://api.weather.gov/stations/KCLE) |

The ECCC primary reads only `currentConditions` and requires the YVR station code. Richmond and Vancouver City Pages can name the same station. West Vancouver provides an independent instrument site. A positive one-minute rainfall measurement supports rain effects. Dry or wind-only readings leave the sky neutral and identify the missing sky coverage. The adapter checks units and available quality flags. The measurements sampled at 08:00 and 20:00 UTC on November 8, 2026 included wind at both YVR and CWWA. [YVR surface observations](https://api.weather.gc.ca/collections/swob-realtime/items?msc_id-value=1108395&datetime=2026-11-08T08:00:00Z&f=json) · [West Vancouver surface observations](https://api.weather.gc.ca/collections/swob-realtime/items?msc_id-value=1108824&datetime=2026-11-08T08:00:00Z&f=json)

The NWS adapter validates the station in the latest observation and reads its description, measured wind, decoded weather and cloud layers. Light and heavy precipitation reports control effect intensity. Fog can accompany rain or snow. Vicinity-only showers retain the station's observed sky. A missing wind measurement suppresses wind effects. [NWS API and identification guidelines](https://www.weather.gov/documentation/services-web-api) · [NWS observation schema](https://api.weather.gov/openapi.json)

## November 8 station coverage

NWS observations queried for 00:00 through 23:00 UTC gave eight KPAO reports with a gap from the 04:00 hour through the 15:00 hour. Moffett Field supplied 49 reports in that interval, including at least one in every hour of that overnight gap. Burke Lakefront supplied 111 reports and Hopkins 102, with both covering every UTC hour from 00 through 22. These are sampled reporting histories. Future station availability varies. [Palo Alto history](https://api.weather.gov/stations/KPAO/observations?start=2026-11-08T00:00:00Z&end=2026-11-08T23:00:00Z) · [Moffett Field history](https://api.weather.gov/stations/KNUQ/observations?start=2026-11-08T00:00:00Z&end=2026-11-08T23:00:00Z) · [Burke Lakefront history](https://api.weather.gov/stations/KBKL/observations?start=2026-11-08T00:00:00Z&end=2026-11-08T23:00:00Z) · [Hopkins history](https://api.weather.gov/stations/KCLE/observations?start=2026-11-08T00:00:00Z&end=2026-11-08T23:00:00Z)

At 23:59 UTC on November 8 the local Next server returned these actual station observations over HTTP. The first response for each campus was HTTP 200 with `Cache-Control: no-store`. The immediate repeat for each retained the original observation and returned `cached: true`.

| Campus | Actual reporting station | Observed UTC | Condition | Wind (km/h) |
| --- | --- | --- | --- | --- |
| UBC | Vancouver International Airport | 23:00 | Partly Cloudy | 21 |
| Stanford | Mountain View, Moffett Field | 23:15 | Clear | 11.16 |
| CWRU | Cleveland, Burke Lakefront Airport | 23:40 | Clear | 20.376 |

Stanford's primary had last reported at 21:47 UTC. This exercised genuine fallback. The separate West Vancouver feed returned zero millimetres of rain in the last minute and wind of 0.5 km/h at 23:57 UTC. Controlled tests exercise snow, heavy rain, coincident fog and service outages.

## Endpoint and freshness

`GET /labs/campus-weather-api/[campus]` accepts `ubc`, `stanford` and `cwru`. The route uses fixed upstream endpoints and discards query parameters. Provider requests contain no visitor coordinates, cookies, IP address or account identifiers. Unsupported campuses return HTTP 404. Unsupported mutations return HTTP 405.

The response carries `observation`, `cached` and `nextCheckAt`. Both times use ISO UTC. A fresh fetch uses the preferred station, tries the alternate when necessary, then retains an eligible earlier observation if both fail. The server checks age on delivery including during its cooldown. Exactly 90 minutes after `observedAt` is usable. A future observation or an age greater than 90 minutes is ineligible. With no eligible report, the endpoint returns `observation: null` and the visitor sees “Weather unavailable.”

Concurrent GET requests share one in-flight refresh per campus. The next refresh is eligible 15 minutes after the previous attempt began, including after failures. Each provider fetch has a four-second timeout. The cache is a bounded, disposable part of the website process. The existing single-process production layout shares this cache among visitors. A restart begins with an empty cache. A deployment scaled across processes or Worker isolates would need a shared coordinator to apply the same upstream limit across replicas.

Run `node --test projects/campus-atmosphere/weather.test.mjs` using the repository Node version. The tests invoke the exported route handler with controlled provider HTTP responses and a controlled clock, including concurrent visitors and exact millisecond boundaries.

## Rights and attribution

ECCC's August 2026 Data Services End-use Licence 2.1.1 permits commercial reuse, adaptation and redistribution with source and applicable contributor credit. The YVR station metadata identifies NAV CANADA, and its observation includes the credit “Observational data provided by NAV CANADA. All rights reserved.” YVR reports carry that notice and the ECCC provider name. The West Vancouver station identifies the Meteorological Service of Canada and carries the ECCC credit. The Canadian licence applies to these inputs. [ECCC licence](https://eccc-msc.github.io/open-data/licence/readme_en/) · [YVR source and attribution field](https://api.weather.gc.ca/collections/swob-realtime/items?msc_id-value=1108395&sortby=-obs_date_tm&limit=1&f=json)

NWS makes its information public domain unless indicated otherwise and permits lawful reuse with limits on claims of authorship, endorsement and official status for modified content. U.S. reports credit the U.S. National Weather Service. Government insignia are outside this implementation. [NWS terms](https://www.weather.gov/disclaimer)
