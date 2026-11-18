# Store listing: proposed text and screenshots

Proposed wording for the App Store and Google Play listings, written to be found by the words soldiers search for
("AFT", "ACFT", "Army Fitness Test", "scoring chart") and to say what the app does in the first line. Nothing here
changes automatically: paste it into App Store Connect and the Play Console yourself, and compare against what is
live first (the current subtitle, keywords and short description are not visible from outside the consoles, so they
are not compared here).

Character counts are checked against each store's limit.

## App Store (iOS)

| Field | Limit | Proposed | Count |
| --- | --- | --- | --- |
| Name | 30 | AFT & ACFT Score Calculator | 27 |
| Subtitle | 30 | Army Fitness Test Scoring | 25 |
| Keywords | 100 | army,pt,fitness,test,scoring,chart,goal,planner,percentile,deadlift,plank,2mile,run,pushup,sdc,hrp | 98 |
| Promotional text | 170 | Updated for the current Army Fitness Test standards. Score all five events, plan your goal total and see how you rank. Free, works offline. | 139 |

Notes:

- Apple indexes the name, subtitle and keywords together, and the keyword field should not repeat words already in the
  name or subtitle. "Army", "Fitness" and "Test" are in the subtitle, so drop them from the keyword list if you want
  room for others (for example "soldier", "points", "ruck").
- Changing the name or subtitle goes through App Review with a new version. **Promotional text can be edited at any
  time without a new build**, so it is the cheapest thing to change first (for example "Standards updated 7 July 2026").
- Keep "ACFT" in the name: the test was renamed AFT, but many people still search the old name.

### Description (iOS and Play full description, up to 4000)

> Score the U.S. Army Fitness Test (AFT, formerly the ACFT) in seconds.
>
> Enter your age, your standard (male or combat MOS, or female non-combat) and your results. The app shows the points
> for each event and your total out of 500, using the current Army scoring charts. It works offline.
>
> - All five events: Maximum Deadlift, Hand-Release Push-Up (T-Push Ups), Sprint-Drag-Carry, Plank and Two-Mile Run
> - Goal planner: pick a target total and see what each event needs to get there
> - Percentiles: with an account, see how your scores compare with other soldiers' saved results, without anyone's
>   name or details being shown
> - Save your scores and track your progress over time
> - Share your total with your unit
> - Waist-to-height ratio check
> - Standards current as of 7 July 2026 (shown on the home screen)
>
> The scoring tables are checked cell by cell against the Army's published charts.
>
> This is an independent tool. It is not affiliated with, endorsed by or sponsored by the U.S. Army or the Department
> of Defense.

Update "current as of" whenever the tables change (it is `standards_as_of` in `data/aft_tables_250601.json`). Add the
"Share your total" line only once the share button is in a released build.

## Google Play

| Field | Limit | Proposed | Count |
| --- | --- | --- | --- |
| Title | 30 | AFT Score Calculator - Army PT | 30 |
| Short description | 80 | Score the Army Fitness Test: event scores, total, goal planner and percentiles. | 79 |

Full description: the same text as above.

## Screenshots

Existing sets are in `portfolio-worktrees\play-assets\aft-score-calculator` (Play) and `docs/screenshots` (README).
What to change, in order of payoff:

1. **Screenshot 1 should show the answer.** It currently ends with the percentile card showing "Calculating..." and the
   total bar cut off. Retake it with the percentile loaded and the **TOTAL SCORE** bar visible, so the result is on the
   first image. The first two images are what most people see in search results.
2. **Add one screenshot of the scoring charts** (the website's charts or the in-app chart view), captioned "Every
   event, every age group".
3. **Add one of the Share button** once it ships, captioned "Share your score with your unit".
4. Keep a caption on every image; they already read well ("Your AFT score in seconds").

Retake on a device or emulator with the same data used today (age 25, male or combat MOS, deadlift 200, push-ups 40,
SDC 2:00, plank 2:30, 2MR 17:00) so the numbers stay consistent across images.

## Ratings

The app now asks for a rating right after a score is saved or shared (at most once every 120 days; the stores apply
their own limits too), instead of at random when the calculator opens. See `components/Calculator/reviewPrompt.js`.
