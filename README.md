# Clean Beaches Map — Χάρτης Καθαριότητας Παραλιών Αττικής

Διαδραστικός χάρτης με τα αποτελέσματα μικροβιολογικών αναλύσεων θαλασσινού νερού
σε **51 σημεία δειγματοληψίας** στην Αττική, καθώς και τις **ακτές με Γαλάζια Σημαία**.

An interactive map of seawater microbial-quality results for 51 sampling points across
Attica, Greece, plus the Blue Flag–awarded beaches.

## Δεδομένα / Data

Πηγή: **ΠΑΚΟΕ** – Πανελλήνιο Κέντρο Οικολογικών Ερευνών. Δειγματοληψία **15/06/2026**.

| Πηγή | Σημεία |
|---|---|
| Παραλίες Πειραιά → Ανάβυσσος (Σαρωνικός) | 21 |
| Ακτές Ανατολικής Αττικής (Θυμάρι → Σχινιάς) | 30 |
| Σύγκριση με ακτές Γαλάζιας Σημαίας | 15 εγγραφές (11 σημεία) |

### Όρια καταλληλότητας

Σύμφωνα με την Οδηγία **2006/7/ΕΚ** για την ποιότητα των υδάτων κολύμβησης
(ΚΥΑ Η.Π. 8600/416/Ε103, ΦΕΚ 356/Β/26.02.2009):

- *E. coli* — **250** cfu/100 ml
- Εντερόκοκκοι — **100** cfu/100 ml

## Λειτουργίες / Features

- Χάρτης Leaflet με χρωματική κωδικοποίηση: 🟢 κατάλληλη / 🔴 ακατάλληλη
- Το **μέγεθος** κάθε σημείου αντιστοιχεί στο φορτίο *E. coli*
- Φίλτρα καταλληλότητας και **περιοχής** (Σαρωνικός / Ανατολική Αττική)
- Αναζήτηση παραλίας, περιοχής ή δήμου
- Ξεχωριστό επίπεδο **⚑ Γαλάζιες Σημαίες** (προαιρετική εμφάνιση)
- Popup με ακριβείς μετρήσεις, ώρα δειγματοληψίας και συντεταγμένες

## Εκτέλεση / Running

Στατική σελίδα — χωρίς build step. Χρειάζεται απλός HTTP server
(τα αρχεία φορτώνονται σχετικά):

```bash
python -m http.server 8099
# άνοιγμα http://127.0.0.1:8099/
```

## Αρχεία / Files

| Αρχείο | Περιεχόμενο |
|---|---|
| `index.html` | Δομή σελίδας (sidebar + χάρτης) |
| `data.js` | Δεδομένα δειγματοληψίας & Γαλάζιων Σημαιών |
| `app.js` | Λογική χάρτη, φίλτρα, popups |
| `style.css` | Εμφάνιση |

## Σημειώσεις / Caveats

- Οι χαρακτηρισμοί **Κ/Α** είναι αυτοί **του δελτίου ΠΑΚΟΕ** και διατηρήθηκαν αυτούσιοι.
  Σε λίγες περιπτώσεις μια τιμή υπερβαίνει το όριο ενώ το σημείο χαρακτηρίζεται κατάλληλο
  (π.χ. Θυμάρι 4η παραλία: 117 εντερόκοκκοι).
- Στο δελτίο **Γαλάζιων Σημαιών** οι συντεταγμένες αφορούν το *πλησιέστερο σημείο
  δειγματοληψίας ΠΑΚΟΕ*, όχι την ίδια τη βραβευμένη ακτή· γι' αυτό ορισμένες εγγραφές
  μοιράζονται σημείο και εμφανίζονται ομαδοποιημένες.

## Άδεια / License

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

Copyright (C) 2026 Johnmaras

Το πρόγραμμα αυτό είναι ελεύθερο λογισμικό: μπορείτε να το αναδιανείμετε ή/και να το
τροποποιήσετε υπό τους όρους της **GNU Affero General Public License**, όπως δημοσιεύεται
από το Free Software Foundation, είτε της έκδοσης 3, είτε (κατ' επιλογή σας) οποιασδήποτε
μεταγενέστερης έκδοσης.

Διανέμεται με την ελπίδα ότι θα είναι χρήσιμο, αλλά **ΧΩΡΙΣ ΚΑΜΙΑ ΕΓΓΥΗΣΗ** — χωρίς καν
τη σιωπηρή εγγύηση ΕΜΠΟΡΕΥΣΙΜΟΤΗΤΑΣ ή ΚΑΤΑΛΛΗΛΟΤΗΤΑΣ ΓΙΑ ΣΥΓΚΕΚΡΙΜΕΝΟ ΣΚΟΠΟ.
Δείτε τη [GNU Affero General Public License](LICENSE) για περισσότερες λεπτομέρειες.

---

This program is free software: you can redistribute it and/or modify it under the terms of
the **GNU Affero General Public License** as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but **WITHOUT ANY WARRANTY**;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the [GNU Affero General Public License](LICENSE) for more details.

You should have received a copy of the GNU Affero General Public License along with this
program. If not, see <https://www.gnu.org/licenses/>.

### Σημείωση AGPL §13 / Network use

Η AGPL απαιτεί ότι, αν τρέξετε τροποποιημένη έκδοση αυτού του λογισμικού σε **διακομιστή**
και επιτρέψετε σε χρήστες να αλληλεπιδράσουν μαζί του μέσω δικτύου, πρέπει να τους
προσφέρετε πρόσβαση στον **πηγαίο κώδικα** της τροποποιημένης έκδοσης. Γι' αυτό η σελίδα
περιλαμβάνει σύνδεσμο προς το αποθετήριο.

If you run a modified version of this software on a server and let users interact with it
over a network, you must offer those users access to the modified version's source code.
The page therefore links back to this repository.

### Δεδομένα / Data

Τα **δεδομένα** των μετρήσεων ανήκουν στο **ΠΑΚΟΕ** – Πανελλήνιο Κέντρο Οικολογικών Ερευνών
([pakoe.gr](https://www.pakoe.gr)) και παρατίθενται με αναφορά στην πηγή· δεν καλύπτονται
από την άδεια AGPL-3.0, η οποία αφορά τον κώδικα.

Χάρτης: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (ODbL).
