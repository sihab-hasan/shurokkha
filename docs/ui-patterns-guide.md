# Shurokkha UI Patterns Guide

`@shurokkha/ui-patterns` is the product-composition layer between low-level
primitives and application-specific domain UI.

## Extract a pattern when

A composition should become a pattern when at least one is true:

1. it repeats across multiple routes or applications;
2. it owns meaningful responsive/accessibility behavior;
3. it represents a stable screen archetype independent of backend entities.

Do not extract a pattern merely because a card looks unique.

## Pattern groups

| Group         | Responsibility                                                    |
| ------------- | ----------------------------------------------------------------- |
| Layout        | shells, content containers, split/master-detail, explorer layouts |
| Navigation    | page/section headers, tabs, page actions                          |
| Dashboard     | KPI/metric/widget composition                                     |
| Collections   | list/grid/result surfaces and pagination slots                    |
| Data table    | tabular data, selection, sort, density, loading/empty states      |
| Entity        | detail headers, metadata, status, summary, actions                |
| Forms         | field groups, form grids, sections, actions, validation           |
| Feedback      | loading, empty, error, access denied, freshness, status banners   |
| Workflow      | status, timeline, approvals, routes                               |
| Progress      | multi-step journeys and process state                             |
| Messaging     | conversations and threads                                         |
| Notifications | notification item/list patterns                                   |
| Search        | global search, dialog, results                                    |
| Reporting     | report headers, filters, viewer, export                           |
| Selectors     | entity and hierarchy selection                                    |
| Overlays      | detail drawer, quick view, action dialog                          |
| Attachments   | upload/list/preview                                               |
| Auth          | shared auth shell, headers, outcome states                        |

## Density

Pattern density is contextual:

- public-facing compositions: comfortable spacing;
- standard workspace: default spacing;
- data tables/toolbars: compact option when information density requires it.

Do not invent a second component geometry for compact mode. Compact mode reduces
padding/gaps; it does not change the visual language.

## Status

Patterns use semantic state tokens only:

```text
neutral → muted
info    → info
success → success
warning → warning
danger  → danger
```

No raw hue utilities are allowed in `ui-patterns` for reusable state meaning.

## Page composition

### Overview/dashboard

```text
PageHeader
DashboardGrid
  KpiCard / MetricCard / WidgetFrame
secondary ContentSection(s)
```

### List/search

```text
PageHeader
FilterBar / DataTableToolbar
CollectionView or DataTable
CollectionFooter / pagination
```

### Entity/detail

```text
EntityHeader
EntitySummary / EntityMetadata
EntityTabs
activity/workflow/related content
```

### Form

```text
PageHeader
FormSection
  FormGrid
  FieldGroup
FormActions
```

### Report

```text
ReportHeader
ReportFilters
ReportViewer
ReportExport
```

### Messaging

Use the messaging pattern as the primary page body. Do not nest it inside an
unrelated dashboard card.

## Public-page rule

`ui-patterns` provides `ContentContainer`, `PageHeader`, and `SectionHeader`, but
public domain sections remain in `apps/web`. Public sections use whitespace and
surface shifts rather than full-width divider lines.

## Accessibility contract

Patterns must preserve:

- semantic headings and landmarks;
- keyboard reachability and visible focus;
- accessible names for icon-only controls;
- table heading/selection semantics;
- form error association;
- dialog/drawer focus behavior;
- meaningful loading, empty, error, and permission states;
- responsive reflow at zoom/mobile widths.

The pattern package should rely on shared UI primitives for low-level widget
behavior instead of rebuilding keyboard interactions.
