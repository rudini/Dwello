# Workflow notes: #1221

| Rule | What happened | Proposed change |
|---|---|---|
| `docs/architecture/fitness-functions.md`, Ä1 (`fat-file` and `fat-module`) | The new check grew `calculation.service.ts` past its `fat-file` limit (482 > 461), so it moved to a file of its own. After the merge of `main`, `fat-module` then refused that file: it raised the module dependencies of `calculation` (16 > 15) and `statement` (22 > 21). The way out was to move `getUncategorizedInvoices` out of `invoice.service` and `apartmentsOf` into `apartment.service`, so that no caller gained an edge. The two checks push in opposite directions, and each fix took a fitness run to find. | Say in `fitness-functions.md`, under «Fette Dateien und Module», how to split a fat file without a new module edge: into a module the callers already import, or by moving a caller's only use of another module along with it. Or have `fat-file` name the modules a new file may go into. |
