# Demo records for persona tasks

For the caller of a persona run, not for the persona: it reads only `README.md`, and must not see IDs or states set up on purpose.

`persona-stack.sh` loads the demo data (`backend/demo/demo-data.sql`, statements from `backend/src/db/demo-data.ts`) with fixed IDs. Before naming a record in a persona's task, look it up here, so the task names the tenant who really holds that contract. Personas that save at the same time each get their own building (`CLAUDE.md`, Workflow 5); with three buildings, at most three personas save at once, the others only look.

| Building (ID) | Apartment | Tenant | Contract ID | State |
|---|---|---|---|---|
| Musterhaus Zentrum (`11111111-1111-1111-1111-111111111111`) | 1.01 | Hans Müller | `b0000001-0001-0001-0001-000000000001` | open-ended since 01.03.2021; statement 2025 sent |
| | 1.01 | Kevin Fischer | `b0000001-0001-0001-0001-000000000099` | terminated, ended 28.02.2021 |
| | 1.02 | Anna Schmidt | `b0000001-0001-0001-0001-000000000002` | open-ended since 01.06.2022; statement 2025 draft |
| | 2.01 | Pierre Dubois (fr) | `b0000001-0001-0001-0001-000000000003` | open-ended since 01.01.2023; statement 2025 draft |
| | 3.01 | Maria Rossi (it) | `b0000001-0001-0001-0001-000000000005` | open-ended since 01.09.2020; statement 2025 draft |
| | 2.02, 3.02 | – | – | vacant |
| Seepark Residenz (`22222222-2222-2222-2222-222222222222`) | A1 | Thomas Weber | `b0000002-0002-0002-0002-000000000001` | open-ended since 01.04.2022; statement 2025 draft |
| | A2 | Sarah Meier | `b0000002-0002-0002-0002-000000000002` | terminated, ended 30.06.2025; statement 2025 draft |
| | A2 | Nina Brunner | `b0000002-0002-0002-0002-000000000003` | open-ended since 01.07.2025; statement 2025 draft |
| | B2 | Marco Bernasconi (it) | `b0000002-0002-0002-0002-000000000004` | open-ended since 01.07.2023; statement 2025 draft |
| | B1 | – | – | vacant |
| Alpenblick (`33333333-3333-3333-3333-333333333333`) | EG | Laura Keller | `b0000003-0003-0003-0003-000000000001` | open-ended since 01.11.2022; no statement 2025 (invoices missing on purpose) |
| | OG1 | Kevin Fischer | `b0000003-0003-0003-0003-000000000002` | open-ended since 01.05.2021; no statement 2025 |
| | OG2 | – | – | vacant |

Every contract that ran in 2024 has a paid statement 2024. There is no fixed-term contract and none that starts in the future: a task that needs one has the persona create it in its own building.
