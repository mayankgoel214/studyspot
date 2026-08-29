-- StudySpot reference data.
--
-- Six real Virginia Tech buildings, in the order the campus map draws them.
-- The `pos` values are percentages over the map container, derived from the
-- building rectangles in src/components/CampusMap.tsx rather than eyeballed, so
-- a marker sits on the building it names.
--
-- What is deliberately NOT here: reports. Occupancy is crowdsourced, and seeding
-- it would mean inventing observations nobody made and then showing them as a
-- live reading. A fresh database therefore reports no occupancy at all until a
-- real person taps Open, Filling or Full — which anyone can do, signed in or
-- not. An empty map that says it is empty is worth more than a full one that is
-- lying.
--
-- Safe to re-run: every insert upserts on the primary key.

insert into public.spots
  (id, name, type, initial, walk_min, hours, open_now, description, amenities, pos, has_group_rooms)
values
  (
    'newman',
    'Newman Library',
    'Library',
    'N',
    4,
    '24 hours during term',
    true,
    'The main library. Silent floors upstairs, louder collaboration space on the ground floor, and the group rooms book out fastest in the week before finals.',
    '{"quiet":true,"outlets":true,"wifi":true,"group":true}'::jsonb,
    '{"x":79.7,"y":22.6}'::jsonb,
    true
  ),
  (
    'squires',
    'Squires Student Center',
    'Student Center',
    'S',
    6,
    '7am - 12am',
    true,
    'Tables around the food court and quieter corners on the upper floors. Busy at lunch, and one of the few places open late that is not a library.',
    '{"quiet":false,"outlets":true,"wifi":true,"group":true}'::jsonb,
    '{"x":51.7,"y":16.4}'::jsonb,
    true
  ),
  (
    'torgersen',
    'Torgersen Hall',
    'Academic Building',
    'T',
    3,
    '7am - 11pm',
    true,
    'The bridge over Alumni Mall has the best natural light on campus and a row of tables along the glass. Outlets are scarce at the window seats.',
    '{"quiet":true,"outlets":false,"wifi":true,"group":true}'::jsonb,
    '{"x":82.9,"y":66.0}'::jsonb,
    true
  ),
  (
    'goodwin',
    'Goodwin Hall',
    'Engineering Building',
    'G',
    9,
    '7am - 10pm',
    true,
    'Engineering building with open study areas on most floors. Further from the Drillfield than it looks, and usually the quietest of the six.',
    '{"quiet":true,"outlets":true,"wifi":true,"group":true}'::jsonb,
    '{"x":18.1,"y":65.2}'::jsonb,
    true
  ),
  (
    'mcbryde',
    'McBryde Hall',
    'Academic Building',
    'M',
    5,
    '7am - 10pm',
    true,
    'Lecture halls that sit empty between classes, plus a handful of tables in the atrium. Good for an hour between lectures, poor for a whole afternoon.',
    '{"quiet":false,"outlets":true,"wifi":true,"group":false}'::jsonb,
    '{"x":50.7,"y":84.8}'::jsonb,
    false
  ),
  (
    'surge',
    'Surge Space Building',
    'Study Space',
    'U',
    11,
    '8am - 8pm',
    true,
    'Overflow space at the edge of campus. Rarely full, rarely lively, and the walk is the price of a table you can count on.',
    '{"quiet":true,"outlets":true,"wifi":true,"group":false}'::jsonb,
    '{"x":16.8,"y":21.2}'::jsonb,
    false
  )
on conflict (id) do update set
  name            = excluded.name,
  type            = excluded.type,
  initial         = excluded.initial,
  walk_min        = excluded.walk_min,
  hours           = excluded.hours,
  open_now        = excluded.open_now,
  description     = excluded.description,
  amenities       = excluded.amenities,
  pos             = excluded.pos,
  has_group_rooms = excluded.has_group_rooms;

insert into public.rooms (id, spot_id, name, floor, capacity)
values
  ('newman-201',    'newman',    'Study Room 201',   '2nd floor', 6),
  ('newman-202',    'newman',    'Study Room 202',   '2nd floor', 6),
  ('newman-310',    'newman',    'Study Room 310',   '3rd floor', 4),
  ('newman-402',    'newman',    'Study Room 402',   '4th floor', 8),
  ('squires-236',   'squires',   'Meeting Room 236', '2nd floor', 8),
  ('squires-244',   'squires',   'Meeting Room 244', '2nd floor', 4),
  ('torgersen-101', 'torgersen', 'Group Room 1010',  '1st floor', 6),
  ('torgersen-320', 'torgersen', 'Bridge Room 3200', '3rd floor', 4),
  ('goodwin-135',   'goodwin',   'Team Room 135',    '1st floor', 6),
  ('goodwin-270',   'goodwin',   'Team Room 270',    '2nd floor', 4)
on conflict (id) do update set
  spot_id  = excluded.spot_id,
  name     = excluded.name,
  floor    = excluded.floor,
  capacity = excluded.capacity;
