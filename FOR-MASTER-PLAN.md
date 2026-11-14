# Για πέρασμα στο MASTER-PLAN.md

- Γράφτηκε το Σάββατο 14 Νοεμβρίου 2026, μετά την έναρξη, με βοήθεια AI (Claude). Το `MASTER-PLAN.md` και το `verified-facts.md` **δεν άλλαξαν**. Τα περνάς εσύ.
- Κάθε ενότητα λέει στα ελληνικά **πού πάει** και **γιατί**. Το κείμενο για επικόλληση είναι στα αγγλικά, όπως το σχέδιο.
- Οι αριθμοί μετρήθηκαν σήμερα από τα 48 CSV του `greece-firms-data`, με τα φίλτρα του σχεδίου (`type = 0`, MODIS `confidence` ≥ 30, VIIRS όχι `l`). Είναι γρήγορος έλεγχος έξω από το pipeline. Στη σελίδα του project μπαίνουν μόνο οι αριθμοί του pipeline.
- Η αναλυτική εξήγηση στα ελληνικά είναι στο `CHATGPT-ENRICHED-EL.md`.

---

## 1. Ανοιχτά σημεία που κλείνουν

### 1.1 Όρια του MODIS confidence

**Πού:** ενότητα 4 (Step 1), ενότητα 14 (σημείο 4), και `verified-facts.md` 9.7 (σημείο 2).
**Γιατί:** ήταν «unverified». Τώρα επαληθεύτηκε, άρα το όριο 30 δεν είναι δική σας σύμβαση αλλά το επίσημο όριο της κλάσης low.

```
MODIS confidence classes: VERIFIED (MODIS Collection 6 and 6.1 Active Fire Product
User's Guide v1.0, section 8.4.3, Table 11).
low: 0 <= C < 30, nominal: 30 <= C < 80, high: 80 <= C <= 100.
Dropping MODIS detections below 30 removes exactly the official low-confidence class,
the same class we drop for VIIRS ("l").
```

### 1.2 Πρώτη ημερομηνία Aqua

**Πού:** ενότητα 0 (αλλαγή 1) και ενότητα 4 (Step 3).
**Γιατί:** το σχέδιο το έγραφε «from memory».

```
Aqua start: VERIFIED. The FIRMS FAQ gives "July 2002". The first Aqua detection in the
Greece files is 4 July 2002. MODIS detections for 2000 and 2001 are Terra only.
```

### 1.3 Ημερομηνία NOAA-21

**Πού:** `verified-facts.md` 2.1.
**Γιατί:** δύο σελίδες της NASA δίνουν διαφορετική ημερομηνία. Δεν επηρεάζει το project.

```
NOAA-21 availability: sources disagree. The FIRMS Archive Download page gave 1 Mar 2023;
the FIRMS FAQ says 17 January 2024. We do not use NOAA-21. Do not quote a date.
```

### 1.4 Μέγεθος pixel

**Πού:** `verified-facts.md` 4.4 (οι «unverified» τιμές).
**Γιατί:** τα δικά σας αρχεία συμφωνούν με αυτές τις τιμές.

```
Pixel area from the Greece files (scan x track): MODIS median 1.32 km2, 95th percentile
5.61 km2, maximum 9.6 km2. VIIRS (S-NPP and NOAA-20) median about 0.20 km2,
maximum 0.62 km2. Consistent with the unverified figures in section 4.4.
VIIRS swath width: 3,040 km (VERIFIED, FIRMS FAQ).
```

### 1.5 Θέση των αρχείων

**Πού:** ενότητα 6 («Already downloaded»).

```
On the second team machine the same 48 files are in
C:\Users\diama\Desktop\NASA\greece-firms-data (folders modis, viirs-snpp, viirs-jpss1).
Row counts match: 46,350 / 90,442 / 49,563.
```

---

## 2. Τιμές-στόχοι για το pipeline

**Πού:** ενότητα 9.7 (Sanity checks), ως αναμενόμενες τιμές. Όχι στη σελίδα του project.
**Γιατί:** αν το pipeline δώσει κάτι πολύ διαφορετικό, υπάρχει λάθος κάπου.

```
Quick check on the Greece country files, 14 Nov 2026 (after the start, outside the
pipeline). Use as expected values only.

F1 = S-NPP / MODIS (Terra + Aqua), Feb 2012 to Dec 2019
  pooled: 37,448 / 10,978 = 3.41
  day: 3.04      night: 5.54
  per year 2013 to 2019: 3.07 to 3.72
  per year 2020 to 2025 (drift era, not used for the fit): 3.03 to 3.99

F1 (Terra only) = S-NPP / Terra, Feb 2012 to Dec 2019: 37,448 / 4,766 = 7.86
  (Aqua only, for reference: 37,448 / 6,212 = 6.03)

F2 = NOAA-20 / S-NPP, 2019 to 2025
  pooled: 37,673 / 36,168 = 1.04
  per year: 1.05, 1.06, 1.05, 1.08, 1.01, 1.12, 0.95
  2018 (NOAA-20 starts 1 April): 0.87

August, cleaned counts
  2007: MODIS 3,052
  2021: MODIS 1,694   S-NPP 6,703   NOAA-20 6,893
  2023: MODIS 1,670   S-NPP 5,420   NOAA-20 5,736
```

Αυτά συμφωνούν με τον γρήγορο έλεγχο πριν από την έναρξη που αναφέρει η ενότητα 0 (λόγος περίπου 3,4, Αύγουστος 2021 = 6.703).

---

## 3. Το ψεύτικο άλμα σε αριθμούς

**Πού:** ενότητα 5 (Proof 1) και ενότητα 12 (βίντεο, δευτερόλεπτα 0 έως 5).

```
Median yearly MODIS hotspots, 2003 to 2011: 1,730
Median yearly MODIS hotspots, 2012 to 2019: 1,355   (activity did not rise)
Median yearly naive sum MODIS + S-NPP, 2012 to 2017: 6,518   (a jump of almost 4x)
2021: MODIS alone 2,271; naive sum of all three sources 20,869   (9x)
```

---

## 4. Γιατί το φίλτρο `type` είναι απαραίτητο

**Πού:** ενότητα 4 (Step 1), ως αιτιολόγηση.

```
Share of rows that are not vegetation fires (type 2 or 3):
MODIS 1.6%, S-NPP 16.9%, NOAA-20 14.5%.
VIIRS sees about ten times more static heat sources than MODIS. Without the type filter
F1 would be inflated.
Share of low-confidence rows: MODIS 4.4%, S-NPP 5.6%, NOAA-20 4.9%.
```

---

## 5. Κοινές περίοδοι των πηγών

**Πού:** ενότητα 4 (Steps 3 και 4), ως πίνακας αναφοράς.

```
| Sources together            | Shared period             | Used for                         |
|-----------------------------|---------------------------|----------------------------------|
| MODIS and S-NPP             | 20 Jan 2012 to 2 Nov 2026 | Full overlap                     |
| MODIS and S-NPP, no drift   | Feb 2012 to Dec 2019      | Fitting F1                       |
| S-NPP and NOAA-20           | 1 Apr 2018 to 2 Nov 2026  | Fitting F2 (full years 2019-2025)|
| MODIS, S-NPP and NOAA-20    | 1 Apr 2018 to 2 Nov 2026  | Cross-check                      |
| MODIS and NOAA-20           | 1 Apr 2018 to present     | The only overlap still running   |

The country files stop at 2025, so the measurable overlap today is 2012 to 2025.
```

---

## 6. Ο κανόνας «σταθερά περάσματα τη μέρα»

**Πού:** ενότητα 4 (Step 2). Εξηγεί γιατί Terra + Aqua προστίθενται ενώ οι VIIRS όχι.
**Γιατί:** ένας κριτής θα ρωτήσει ακριβώς αυτό.

```
Same instrument does not mean same measurement. What must stay constant across the
record is the number of overpasses per day.

- Terra (about 10:30 and 22:30) and Aqua (about 13:30 and 01:30) carry the same
  instrument but pass at different times. Each pass is a new observation, so they are
  summed: 4 looks per day, constant from July 2002.
- Before July 2002 only Terra flew: 2 looks per day. That period needs its own factor
  (7.86 against 3.41 in the quick check).
- S-NPP, NOAA-20 and NOAA-21 share one orbit about 25 minutes apart and see nearly the
  same thing (NOAA-20 / S-NPP = 1.04). They are never summed. One at a time keeps
  VIIRS at 2 looks per day. Summing them would raise the looks from 2 to 4 in 2018 and
  to 6 later, a rise in counts with no change on the ground.
```

### 6.1 MODIS και VIIRS δεν πέταξαν ποτέ στην ίδια τροχιά

**Πού:** ενότητα 4 (Step 3), ως αιτιολόγηση του παραθύρου 2012 έως 2019, και ενότητα 4 («Limits»).
**Γιατί:** εξηγεί ότι ο συντελεστής περιέχει και τη διαφορά τροχιάς και ώρας, όχι μόνο τα χιλιόμετρα.

```
MODIS and VIIRS never shared an orbit, before or after the drift.

| Satellite                | Instrument | Altitude     | Local overpass (before drift) |
|--------------------------|------------|--------------|-------------------------------|
| Terra                    | MODIS      | about 705 km | about 10:30 and 22:30         |
| Aqua                     | MODIS      | about 705 km | about 13:30 and 01:30         |
| S-NPP, NOAA-20, NOAA-21  | VIIRS      | about 824 km | about 13:30 and 01:30         |

- Aqua and VIIRS: different orbit and altitude, same time of day. They saw a fire in
  the same phase (early afternoon, after midnight), not at the same minute and not from
  the same angle. This is why published comparisons usually pair VIIRS with Aqua.
- Terra and VIIRS: never close. Terra is a morning satellite; VIIRS has no morning pass.
- After the drift (Terra from 27 Feb 2020, Aqua from 8 Mar 2021) Terra passes earlier
  and Aqua later, so Aqua moves away from the VIIRS overpass time. This is the reason
  F1 is fitted on 2012 to 2019 only.
- Even in 2012 to 2019 the two sensors did not make the same measurement. F1 (3.41)
  includes the orbit and overpass-time difference, not only the pixel-size difference.

Altitudes are from general knowledge, not checked on 14 Nov. Overpass times agree with
the NASA pages read (VIIRS Land page; Earthdata drift alert in verified-facts.md).
```

### 6.2 Σχεδόν ταυτόχρονες μετρήσεις MODIS και VIIRS

**Πού:** ενότητα 4 (Step 3), ως αιτιολόγηση για τα μηνιαία σύνολα. Προαιρετικά ενότητα 5, ως έκτη απόδειξη.
**Γιατί:** απαντά στο «υπάρχουν μετρήσεις την ίδια στιγμή στο ίδιο σημείο;». Υπάρχουν μόνο με τον Aqua και μόνο κάποιες μέρες.

```
Near-simultaneous detections, Greece, Feb 2012 to Dec 2019 (quick check).
For each MODIS hotspot: is there an S-NPP hotspot on the same day within about 2 km?

| Time difference | Aqua hotspots with a match | Days | Terra hotspots with a match |
|-----------------|----------------------------|------|-----------------------------|
| up to 2 min     |   166 (2.7%)               |  37  |   0                         |
| up to 5 min     |   522 (8.4%)               | 119  |   2                         |
| up to 10 min    | 1,014 (16.3%)              | 228  |  19                         |
| up to 30 min    | 2,468 (39.7%)              | 506  | 101 (2.1%)                  |
| up to 60 min    | 3,728 (60.0%)              | 742  | 368 (7.7%)                  |

Totals: 6,212 Aqua hotspots, 4,766 Terra hotspots.

- Aqua and S-NPP fly at different altitudes, so their orbits line up only periodically.
  On those days they pass the same place minutes apart; on other days up to an hour
  or more apart.
- Terra passes about three hours before VIIRS, so it has no near-simultaneous passes.
- These coincidences are the cleanest way to compare the sensors (the approach of
  Fu et al. 2020), but they are too few for our record: 119 days in 8 years at the
  5-minute limit, Aqua only. The calendar counts every pass of every day, so F1 is
  fitted on monthly totals.
- Optional proof 6: the S-NPP / Aqua ratio on coincident days only. Not computed.
- Caveat: a match within 2 km is not proof of the same fire. A MODIS pixel reaches
  9.6 km2 at the swath edge.
```

### 6.3 Τι δείχνουν οι συμπτώσεις: από τι αποτελείται ο συντελεστής

**Πού:** ενότητα 5, ως έκτη απόδειξη (Proof 6), και στη σελίδα μεθόδου.
**Γιατί:** στις συμπτώσεις η φωτιά είναι ίδια και αλλάζει μόνο ο αισθητήρας. Έτσι φαίνεται πόσο οφείλεται στην ευαισθησία και πόσο στα χιλιόμετρα.

```
Aqua vs S-NPP on near-simultaneous passes, Greece, Feb 2012 to Dec 2019 (quick check).

| Measured                                              | <= 5 min | <= 10 min |
|-------------------------------------------------------|----------|-----------|
| Days with a coincident pass                           | 147      | 277       |
| S-NPP / Aqua in the same pass, day                    | 3.96     | 3.79      |
| S-NPP / Aqua in the same pass, night                  | 7.38     | 6.80      |
| 0.1-degree cells where S-NPP saw fire: also seen by Aqua | 22%   | 23%       |
| 0.1-degree cells where Aqua saw fire: also seen by S-NPP | 70%   | 70%       |
| S-NPP / Aqua pixel ratio inside cells both saw        | 2.83     | 2.41      |

The gap has two parts:
- Sensitivity (the large part): at the same moment Aqua sees about 1 in 4 of the places
  where VIIRS sees fire.
- Resolution (the "kilometres" part): where both see the same fire, VIIRS gives about
  2.4 to 2.8 pixels per MODIS pixel.

How to compute it (Proof 6):
1. Per day, keep Aqua and S-NPP hotspots whose acq_time differs by at most 5 or 10
   minutes. Day and night separately.
2. Put them on common cells of about 0.1 degree (well above the MODIS pixel size).
3. Measure (a) the share of VIIRS cells Aqua also saw, (b) the pixel ratio in shared
   cells.
4. Fit the real factor F1 on monthly totals as planned. That is what enters the record.
5. Compare. Agreement between the coincidence ratio and the monthly Aqua ratio is
   independent evidence that F1 measures the sensor.

Why coincidences cannot replace the monthly factor:
- Aqua only. Terra has no coincident passes, and the record uses all four MODIS passes.
- No large fires: no shared cell had 20 or more Aqua pixels on a coincident pass.
- Small sample: 597 Aqua hotspots by day and 85 by night at the 5-minute limit.
- The CSV has no row for a pass that detected nothing, so only passes where both
  sensors recorded something are visible. The 22% is probably optimistic.
```

### 6.4 Τι είναι εφικτό και τι όχι

**Πού:** ενότητα 4 («Limits we state openly») και ενότητα 12 (σελίδα, «Limits»).
**Γιατί:** ξεκαθαρίζει τι υπόσχεται το εργαλείο.

```
What the harmonization can and cannot do.

Can: one record from 2000 to today in which months and years from the MODIS era
compare fairly with the VIIRS era. Evidence from the quick check: the yearly factor is
stable (3.07 to 3.72, about +-10%), the coincident passes explain where it comes from,
and the order of the big years (2007, 2023, 2021) matches EFFIS burned area.

Cannot: turn each MODIS hotspot into what VIIRS would have seen. The fires MODIS missed
are unknown and cannot be placed on the map. The method corrects totals, not single
fires.

| User question                                                   | Answerable?            |
|-----------------------------------------------------------------|------------------------|
| Was August 2007 worse than August 2021 in Greece?               | Yes, with a range      |
| Which months usually have the most activity in a region?        | Yes                    |
| Where exactly did a small fire burn in 2005?                    | No                     |
| How many hotspots did one village have in one month of 2003?    | Unreliable: the factor |
|                                                                 | is an average and does |
|                                                                 | not hold for very small|
|                                                                 | areas or counts        |

The challenge asks for the first kind of question (calendar by month and year, against
the median).
```

---

## 7. Η δοκιμή του κοινού πλέγματος

**Πού:** ενότητα 4 (νέα παράγραφος «Why not a common grid»), ενότητα 3 (Skip), και στη σελίδα μεθόδου.
**Γιατί:** δείχνει με αριθμούς ότι το πρόβλημα δεν είναι μόνο τα χιλιόμετρα. Είναι καλό επιχείρημα για το Validity.

```
Why a common grid does not harmonize the record (Greece, Feb 2012 to Dec 2019).
"Active cell-days" = grid cells with at least one hotspot on a given day.

| What is counted                  | MODIS  | S-NPP  | Ratio |
|----------------------------------|--------|--------|-------|
| Hotspots, no grid                | 10,978 | 37,448 | 3.41  |
| Active cell-days, cells ~1 km    | 10,326 | 27,086 | 2.62  |
| Active cell-days, cells ~5.5 km  |  7,066 | 20,142 | 2.85  |
| Active cell-days, cells ~11 km   |  6,256 | 17,949 | 2.87  |
| Active cell-days, cells ~28 km   |  5,265 | 14,655 | 2.78  |

Gridding lowers the ratio from 3.4 to about 2.8 and no further, whatever the cell size.
Only 9% to 20% of the VIIRS active cell-days also have a MODIS detection.

The "different kilometres" problem is two problems:
1. One fire lights more small pixels than large ones. A grid reduces this (small part).
2. MODIS never sees the small fires at all. That is sensitivity, not pixel size, and
   only a factor measured on the overlap years covers it (large part).
```

---

## 8. VIIRS 750 m

**Πού:** ενότητα 3. Είτε στο «Skip» με αιτιολόγηση, είτε ως τρίτο Value-add (C), μετά τα A και B. Και στην ενότητα 12 (ερωτήσεις κριτών).
**Γιατί:** το ChatGPT το πρότεινε ως κύρια λύση. Η απόφαση αν θα μπει είναι της ομάδας.

### Τα γεγονότα

```
VIIRS produces two independent active fire products (VERIFIED, NASA VIIRS Land page and
FIRMS FAQ):
- 750 m (VNP14 for S-NPP, VJ114 for NOAA-20): M-bands. A replica of the MODIS
  Collection 6 algorithm, built for continuity with the MODIS 1 km record.
- 375 m (VNP14IMG, VJ114IMG): I-bands plus M13. Detects smaller fires and maps large
  fire perimeters better. Finds more fire pixels than the 750 m product, most of all
  at night.
Both come from the same instrument on the same satellite at the same instant, so their
periods are identical and they must never be summed.
```

### Γιατί δεν είναι η κύρια πηγή

```
Why the main record uses the 375 m product:
1. FIRMS distributes MODIS 1 km and VIIRS 375 m only. The 750 m product is on LP DAAC
   as 6-minute swath files (VNP14) or a daily 1 km grid (VNP14A1), behind an Earthdata
   login, with no per-country CSV and no Area API. Download not tested.
2. The challenge lists FIRMS as its only resource and asks for the "greater detail" of
   VIIRS.
3. The 750 m product also starts in 2012, has a different pixel size from MODIS and no
   morning overpass. A factor would still be needed.
4. Reading 14 years of swath files does not fit in 30 hours.
```

### Αν μπει, πώς (προαιρετικό)

```
Optional value-add C: the 750 m product as a bridge, for one case only (North Evia,
August 2021), and only after every must-have works.

| Step | Compared                                      | Isolates                           |
|------|-----------------------------------------------|------------------------------------|
| 1    | MODIS vs VIIRS 750 m, 2012 to 2019            | Instrument and overpass time       |
| 2    | VIIRS 750 m vs 375 m, same satellite, instant | Resolution and sensitivity only    |
| 3    | Step 1 x step 2                               | Should reproduce the direct F1     |

Gain: we can say how much of the 3.4 comes from resolution and how much from the rest.
The final factor is the same as the direct measurement.
```

### Κάνει το 750 m το αποτέλεσμα πιο αναξιόπιστο;

**Πού:** ενότητα 3 (Skip ή Value-add C) και ενότητα 14 (Open decisions), ως αιτιολόγηση της απόφασης.

```
Does adding the 750 m product hurt reliability?
- Summed with the others: yes. 750 m and 375 m are the same fire, same satellite, same
  instant. Every fire would count twice.
- As a link in the main record (MODIS -> 750 m -> 375 m): yes, slightly. The factor
  becomes a product of two measurements and their errors add. The direct MODIS-to-375 m
  comparison has one step and one error.
- As a side check only: no. Fit F1 directly, then see whether the route through 750 m
  gives the same number. If they disagree the main record is untouched.

| With 750 m as a check        | Result                                             |
|------------------------------|----------------------------------------------------|
| Final factor                 | Same                                               |
| Reliability of the record    | Same                                               |
| "How much is resolution?"    | Cleaner, but already answered by the Aqua / S-NPP  |
|                              | coincidences (section 6.3)                         |
| Work                         | Unknown: not on FIRMS, download not tested         |

Recommendation: compare the two FIRMS products only. Name the 750 m product on the
project page as a next step: it is NASA's continuity product and would separate the
resolution effect cleanly.
```

---

## 9. Τι απορρίπτουμε από τις ιδέες του ChatGPT

**Πού:** ενότητα 3 (Skip).

```
Also skipped (suggested by ChatGPT on 14 Nov, not asked for by the challenge):
- A fire alert or warning system.
- A day-by-day calendar. The challenge asks for months and years against the median.
- Matching detections one to one between sensors, or a 1 km co-location grid
  (see the grid test).
- Summing MODIS, VIIRS 750 m and VIIRS 375 m.
```

---

## 10. Από το επίσημο κείμενο της πρόκλησης

**Πού:** ενότητα 1 και ενότητα 12 («The problem»).
**Γιατί:** να χρησιμοποιεί η σελίδα τα λόγια της NASA.

```
From the challenge page (read 14 Nov 2026):
- The harmonization goal, in NASA's words: by the end "the sensor of origin no longer
  matters". Use this phrase on the project page.
- NASA names three differences between the sensors: spatial resolution, sensitivity,
  and observation schedule. Our factor covers all three on average; a grid covers part
  of the first only.
- Difficulty: Intermediate and Advanced. Subjects: Earth Science, Software.
- Suggested extras we already cover: draw an area or enter latitude and longitude,
  accessible colour ramps, anomalies against multi-year values, CSV download.
```

---

## 11. Υποψήφιο εύρημα (must-have 9)

**Πού:** ενότητα 3 (must-have 9) και `PROJECT-PAGE-CHOICES.md` σειρά 22, ως αυτό που περιμένετε να δείτε.
**Γιατί:** δίνει την απάντηση στο «ήταν το 2007 χειρότερο από το 2021 και το 2023;». Χρειάζεται επιβεβαίωση από το pipeline με χωριστούς συντελεστές μέρας και νύχτας.

```
Expected finding (quick check, to be confirmed by the pipeline):
2007 = 5,970 MODIS hotspots x 3.41 x 1.04 = about 21,200 NOAA-20-equivalent hotspots
(range about 19,100 to 23,100).
2021 = 9,545 and 2023 = 9,376 real NOAA-20 hotspots.
2007 had roughly twice the hotspot activity of 2021 or 2023.
EFFIS burned area gives the same order: 271,715 ha (2007), 174,773 ha (2023),
130,744 ha (2021).
```

---

## 12. Όρια που προστίθενται

**Πού:** ενότητα 4 («Limits we state openly»).

```
- A hotspot is the centre of a flagged pixel, not the position of the fire. We know
  only that at least one fire lies inside the pixel (FIRMS FAQ).
- NASA does not recommend hotspots for estimating burned area (FIRMS FAQ).
- The factor is not one number: night is about 5.5 and day about 3.0 in the quick
  check, and single years range from 3.07 to 3.72.
```

---

## 13. Ερωτήσεις κριτών που προστίθενται

**Πού:** ενότητα 12 («Be ready for three questions»).

```
- "Why do you add Terra and Aqua but not the VIIRS satellites?"
  Different overpass times against the same orbit. See the looks-per-day rule.
- "Why not put both sensors on a 1 km grid?"
  We tested it: the ratio falls from 3.4 to about 2.8 and stays there. Most of the gap
  is fires MODIS never saw.
- "Why not the VIIRS 750 m product, which NASA built for MODIS continuity?"
  FIRMS does not distribute it, and the challenge asks for the detail of the 375 m
  product. It would still need a factor.
```

---

## 14. Πηγές και δήλωση AI

**Πού:** ενότητα 15 (References) και `REFERENCES.md`.

```
- NASA Space Apps 2026 challenge page:
  https://www.spaceappschallenge.org/2026/challenges/modis-and-viirs-hot-spots/
- FIRMS FAQ, NASA Earthdata: https://www.earthdata.nasa.gov/data/tools/firms/faq
- NASA VIIRS Land, Active Fire Product:
  https://viirsland.gsfc.nasa.gov/Products/NASA/FireESDR.html
- Giglio, Schroeder, Hall: MODIS Collection 6 and 6.1 Active Fire Product User's Guide,
  version 1.0:
  https://earthdata.nasa.gov/s3fs-public/2023-09/MODIS_C6_C6.1_Fire_User_Guide_1.0.pdf
```

**Πού:** ενότητα 16 (AI-use log), ενότητα 7 (AI tools) και `AI_USE.md`.

```
| 14 Nov 2026 | ChatGPT | Plain-language explanation of the topic in Greek. Its
suggestions (VIIRS 750 m as the main source, a 1 km grid, an alert system) were checked
and not adopted. |
| 14 Nov 2026 | Claude | Fact-check of the ChatGPT conversation against NASA pages;
quick counts on the Greece country files (ratios, grid test); the notes in
CHATGPT-ENRICHED-EL.md and FOR-MASTER-PLAN.md. |
```

---

## 15. Τι δεν έχει επαληθευτεί

Μην τα γράψεις ως βέβαια:

- Το προβλεπόμενο τέλος του Terra (Φεβ 2027) και του Aqua (Σεπ 2027): μόνο από περίληψη αναζήτησης. Συμφωνεί με το «second-hand» του `verified-facts.md`.
- Το πλάτος λωρίδας του MODIS (περίπου 2.330 km): από γενική γνώση.
- Τα ύψη τροχιάς (περίπου 705 km και περίπου 824 km) στην ενότητα 6.1: από γενική γνώση.
- Η λήψη των δεδομένων VIIRS 750 m: δεν δοκιμάστηκε.
- Η ημερομηνία έναρξης του 750 m για NOAA-20 και NOAA-21: δεν ελέγχθηκε.
- Όλοι οι αριθμοί των ενοτήτων 2, 3, 4, 7 και 11: γρήγορος έλεγχος, όχι αποτέλεσμα του pipeline.

---

## 16. Αρχεία αποδεικτικών στοιχείων (Person B, 14 Νοε)

**Πού:** ενότητα 9.1 (Repository layout) και ενότητα 11 (τι κάνει ο B).
**Γιατί:** το σχέδιο δεν ονομάζει φάκελο για τα αρχεία που πληκτρολογεί ο B. Τα έβαλα σε νέο φάκελο ώστε να μη συγκρούονται με το pipeline του A.

```
Evidence files (typed from verified-facts.md by Person B) live in
hotspot/pipeline/evidence/:
- copernicus_evros_2023.csv / .json   (10 products; verified bounding box)
- copernicus_evia_2021.json           (7,313 ha on 5 Aug, 50,909 ha on 11 Aug;
                                       bounding box is an ESTIMATE)
- effis_greece_yearly.csv             (2006 to 2026; 2026 marked complete=false)
Proofs read these files. The Evia box stays UNVERIFIED until read off the EMSR527 map.
```

Update, same day: `greece.geojson` added to `hotspot/pipeline/evidence/`. Source: Natural Earth
1:10m Admin 0 Countries (public domain), feature ADM0_A3 = GRC, MultiPolygon, 6,096 points,
coordinates rounded to 4 decimals, 109 KB. Extent: 19.63 to 28.24 E, 34.82 to 41.75 N.
Not widened at the coast yet (plan section 13 says to widen only if it clips NASA's rows).
Add Natural Earth to REFERENCES.md.
