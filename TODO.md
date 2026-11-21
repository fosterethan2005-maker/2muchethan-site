# To do

## Live stream schedule (planned, not started)
- [ ] Schedule comes from streams scheduled in YouTube Studio; no site edits needed to add one.
- [ ] Banner switches from "Next stream" to "Currently live" + link when the stream actually starts (site checks YouTube about every 60s around stream time).
- [ ] Banner clears within about a minute of the stream ending, then shows the next scheduled stream.
- [ ] Default stream time: 5:00 PM Mountain.
- [ ] Show times in each visitor's local time zone. If it can't be detected, show Mountain time and label it (e.g. "5:00 PM MST").
- [ ] Needs: a free YouTube Data API key (restricted to 2muchethan.com, read-only) and pushing to GitHub so the updater runs.
- [ ] Open question: MST all year (Arizona-style), or Mountain Time that switches to MDT in summer?
- [ ] Open question: also show a weekly "usually live" pattern, or only streams scheduled on YouTube?
