import * as React from "react"
import { cn } from "../lib/utils"

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type ValidationIssue = { id?: string; field?: string; message: string }
export type AuthStateTone =
  "neutral" | "info" | "success" | "warning" | "error" | "danger" | "critical"

// ---------------------------------------------------------------------------
// Permissive passthrough type — accepts arbitrary custom props (tone, icon,
// title, actions, items, ...) while still extending HTMLAttributes. Used for
// the wrapper components in this module that act as branded slots.
// ---------------------------------------------------------------------------

type PermissiveProps = React.HTMLAttributes<HTMLDivElement> & {
  [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Simple passthrough wrappers — no custom props, safe to spread directly
// ---------------------------------------------------------------------------

export const ActivityFeed = (props: PermissiveProps) => <div {...props} />
export const CollectionFooter = (props: PermissiveProps) => <div {...props} />
export const CollectionList = (props: PermissiveProps) => <div {...props} />
export const ConversationLayout = (props: PermissiveProps) => <div {...props} />
export const ConversationList = (props: PermissiveProps) => <div {...props} />
export const EntityStatus = (props: PermissiveProps) => <div {...props} />
export const AuthState = (props: PermissiveProps) => <div {...props} />
export const DataFreshness = (props: PermissiveProps) => <div {...props} />
export const AuthHeader = ({
  title,
  description,
  className,
  ...props
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  className?: string
} & Omit<React.HTMLAttributes<HTMLDivElement>, "title">) => (
  <div className={cn("flex flex-col gap-1 text-center", className)} {...props}>
    {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
    {description && (
      <p className="text-sm text-muted-foreground">{description}</p>
    )}
  </div>
)
export const MessageThread = (props: PermissiveProps) => (
  <div className="space-y-4" {...props} />
)
export const NotificationItem = (props: PermissiveProps) => (
  <div
    className="flex items-start gap-4 border-b p-4 last:border-0"
    {...props}
  />
)
export const NotificationList = (props: PermissiveProps) => (
  <div className="flex flex-col" {...props} />
)
interface ProcessStep {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  status?: "complete" | "current" | "upcoming" | "pending"
}

interface ProcessStepsProps extends React.HTMLAttributes<HTMLDivElement> {
  steps?: ProcessStep[]
  orientation?: "horizontal" | "vertical"
  numbered?: boolean
}

export const ProcessSteps = ({
  steps,
  orientation = "vertical",
  numbered = true,
  className,
  ...props
}: ProcessStepsProps) => (
  <div
    className={cn(
      orientation === "horizontal"
        ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        : "flex flex-col gap-4",
      className
    )}
    {...props}
  >
    {(steps ?? []).map((step, index) => (
      <div key={step.id ?? index} className="flex items-start gap-3">
        {numbered ? (
          <span
            className={cn(
              "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              step.status === "complete" &&
                "bg-primary text-primary-foreground",
              step.status === "current" &&
                "bg-primary/20 text-primary ring-2 ring-primary",
              (!step.status ||
                step.status === "upcoming" ||
                step.status === "pending") &&
                "bg-muted text-muted-foreground"
            )}
          >
            {index + 1}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">{step.title}</div>
          {step.description && (
            <p className="text-xs text-muted-foreground">{step.description}</p>
          )}
        </div>
      </div>
    ))}
  </div>
)
export const ReportViewer = (props: PermissiveProps) => (
  <div className="rounded-md border" {...props} />
)
interface CollectionGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns at the largest breakpoint. Smaller breakpoints scale down. */
  columns?: 2 | 3 | 4
}

export const CollectionGrid = ({
  columns = 3,
  className,
  ...props
}: CollectionGridProps) => (
  <div
    className={cn(
      "grid gap-6",
      columns === 2 && "md:grid-cols-2",
      columns === 3 && "md:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "md:grid-cols-2 lg:grid-cols-4",
      className
    )}
    {...props}
  />
)

export const DashboardGrid = ({
  columns = 3,
  className,
  ...props
}: CollectionGridProps) => (
  <div
    className={cn(
      "grid gap-6",
      columns === 2 && "md:grid-cols-2",
      columns === 3 && "md:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "md:grid-cols-2 lg:grid-cols-4",
      className
    )}
    {...props}
  />
)
// ---------------------------------------------------------------------------
// CollectionView — list/detail surface with toolbar + loading/empty/error states
// ---------------------------------------------------------------------------

export type CollectionSurface = "card" | "plain"

interface CollectionViewProps {
  /** Visual treatment. `card` adds a bordered background; `plain` is transparent. */
  surface?: CollectionSurface
  /** Top-of-card toolbar (search, filters, action buttons). */
  toolbar?: React.ReactNode
  /** When true, the `loading` slot is rendered in place of `children`. */
  isLoading?: boolean
  /** Content shown while `isLoading` is true. */
  loading?: React.ReactNode
  /** When true, the `error` slot is rendered in place of `children`. */
  hasError?: boolean
  /** Content shown when `hasError` is true. */
  error?: React.ReactNode
  /** When true and not loading/errored, the `empty` slot replaces `children`. */
  isEmpty?: boolean
  /** Content shown when the collection has no items. */
  empty?: React.ReactNode
  /** Bottom-of-card slot (pagination, summaries). */
  footer?: React.ReactNode
  /** Main collection body — typically a `<CollectionList>` or `<CollectionGrid>`. */
  children?: React.ReactNode
  className?: string
}

export const CollectionView = ({
  surface = "plain",
  toolbar,
  isLoading = false,
  loading,
  hasError = false,
  error,
  isEmpty = false,
  empty,
  footer,
  children,
  className,
}: CollectionViewProps) => (
  <div
    className={cn(
      surface === "card" &&
        "rounded-xl border bg-card text-card-foreground shadow-sm",
      className
    )}
  >
    <div className="space-y-4 p-5">
      {toolbar}
      {isLoading ? loading : hasError ? error : isEmpty ? empty : children}
      {footer}
    </div>
  </div>
)

// ---------------------------------------------------------------------------
// ValidationSummary — only renders when there are issues
// ---------------------------------------------------------------------------

interface ValidationSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  issues?: ValidationIssue[]
}

export const ValidationSummary = ({
  issues,
  className,
  ...props
}: ValidationSummaryProps) => {
  if (!issues || issues.length === 0) return null
  return (
    <div
      className={cn(
        "rounded-md bg-destructive/10 p-4 text-destructive",
        className
      )}
      role="alert"
      {...props}
    >
      <ul className="list-inside list-disc space-y-1 text-sm">
        {issues.map((issue, i) => (
          <li key={i}>{issue.message}</li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FieldGroup — label + optional description + error message wrapper
// ---------------------------------------------------------------------------

interface FieldGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "label"
> {
  label?: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
}

export const FieldGroup = ({
  label,
  description,
  error,
  required,
  children,
  className,
  ...props
}: FieldGroupProps) => (
  <div className={cn("space-y-1.5", className)} {...props}>
    {label && (
      <div className="flex items-center gap-1">
        {label}
        {required && <span className="text-sm text-destructive">*</span>}
      </div>
    )}
    {description && (
      <p className="text-xs text-muted-foreground">{description}</p>
    )}
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
)

// ---------------------------------------------------------------------------
// FormGrid — responsive two-column grid, accepts a `columns` hint
// ---------------------------------------------------------------------------

interface FormGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 4
}

export const FormGrid = ({
  columns = 2,
  className,
  ...props
}: FormGridProps) => (
  <div
    className={cn(
      "grid gap-6",
      columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2",
      className
    )}
    {...props}
  />
)

// ---------------------------------------------------------------------------
// FormSection — titled section with optional description + header actions
// ---------------------------------------------------------------------------

interface FormSectionProps {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  /** When true, reduces vertical spacing between the header and content. */
  compact?: boolean
  children?: React.ReactNode
  className?: string
}

export const FormSection = ({
  title,
  description,
  actions,
  compact = false,
  children,
  className,
}: FormSectionProps) => (
  <div className={cn("space-y-4", className)}>
    {(title || description || actions) && (
      <div
        className={cn(
          "flex items-start justify-between gap-4",
          compact ? "pb-2" : "border-b pb-4"
        )}
      >
        <div className="min-w-0">
          {title && <h3 className="text-base font-semibold">{title}</h3>}
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    )}
    {children}
  </div>
)

// ---------------------------------------------------------------------------
// FormActions — submit / cancel row
// ---------------------------------------------------------------------------

interface FormActionsProps {
  children?: React.ReactNode
  onSecondary?: () => void
  secondaryLabel?: React.ReactNode
  className?: string
}

export const FormActions = ({
  children,
  onSecondary,
  secondaryLabel = "Cancel",
  className,
}: FormActionsProps) => (
  <div className={cn("flex items-center justify-end gap-3 pt-4", className)}>
    {onSecondary && (
      <button
        type="button"
        onClick={onSecondary}
        className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
      >
        {secondaryLabel}
      </button>
    )}
    {children}
  </div>
)

// ---------------------------------------------------------------------------
// EntityHeader — page/modal entity header with breadcrumbs, title, actions
// ---------------------------------------------------------------------------

interface EntityHeaderProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  identifier?: React.ReactNode
  status?: React.ReactNode
  breadcrumbs?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export const EntityHeader = ({
  title,
  subtitle,
  identifier,
  status,
  breadcrumbs,
  actions,
  className,
}: EntityHeaderProps) => (
  <div className={cn("space-y-3", className)}>
    {breadcrumbs && <div>{breadcrumbs}</div>}
    <div className="flex flex-wrap items-start justify-between gap-4">
      {/* `flex-1` so the title block claims remaining row width; combined
          with `min-w-0` this lets a long title wrap instead of pushing
          the action group off-screen. */}
      <div className="min-w-0 flex-1">
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          {title && (
            <h1 className="text-2xl font-bold tracking-tight break-words">
              {title}
            </h1>
          )}
          {status}
        </div>
        {/* `break-all` for long IDs / hashes that have no natural
            break-points — they wrap anywhere instead of overflowing. */}
        {identifier && (
          <p className="mt-1 font-mono text-xs break-all text-muted-foreground">
            #{identifier}
          </p>
        )}
      </div>
      {/* `min-w-0 max-w-full` so a wide actions row (3+ buttons) can wrap
          onto a second line within the dialog instead of forcing the
          header row wider than the popup. `shrink-0` is kept off so the
          actions block can shrink and wrap when space is tight. */}
      {actions && <div className="max-w-full min-w-0">{actions}</div>}
    </div>
  </div>
)

// ---------------------------------------------------------------------------
// EntitySummary — titled content card with description
// ---------------------------------------------------------------------------

interface EntitySummaryProps {
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export const EntitySummary = ({
  title,
  description,
  footer,
  children,
  className,
}: EntitySummaryProps) => (
  // `min-w-0` lets the card itself shrink below intrinsic content width,
  // so a single child with a long unbroken value won't force the card
  // (and therefore its parent dialog) wider than allowed.
  <div
    className={cn("min-w-0 space-y-4 rounded-xl border bg-card p-6", className)}
  >
    {(title || description) && (
      // Same rationale for the header block.
      <div className="min-w-0">
        {title && (
          <h2 className="text-lg font-semibold break-words">{title}</h2>
        )}
        {description && (
          <p className="mt-0.5 text-sm break-words text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    )}
    {children}
    {footer && (
      <div className="border-t pt-4 text-sm text-muted-foreground">
        {footer}
      </div>
    )}
  </div>
)

// ---------------------------------------------------------------------------
// EntityMetadata — key/value pair list inside EntitySummary
// ---------------------------------------------------------------------------

interface EntityMetadataItem {
  label: React.ReactNode
  value?: React.ReactNode
}

interface EntityMetadataProps {
  items?: EntityMetadataItem[]
  className?: string
}

export const EntityMetadata = ({ items, className }: EntityMetadataProps) => {
  if (!items || items.length === 0) return null
  return (
    <dl className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {items.map((item, i) => (
        // `min-w-0` lets the grid cell shrink below its intrinsic content
        // width so a single long value (URL, free-form description,
        // unbroken string) can't force the whole 2-col grid past its
        // parent. Combined with `break-words` on `<dd>`, every value
        // wraps cleanly inside its half of the dialog.
        <div key={i} className="flex min-w-0 flex-col gap-0.5">
          <dt className="text-xs font-medium text-muted-foreground">
            {item.label}
          </dt>
          <dd className="text-sm break-words">
            {item.value ?? <span className="text-muted-foreground">—</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}

// ---------------------------------------------------------------------------
// WidgetFrame — card container with optional title
// ---------------------------------------------------------------------------

interface WidgetFrameProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

export const WidgetFrame = ({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: WidgetFrameProps) => (
  <div
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  >
    {(title || description || actions) && (
      <div className="flex items-start justify-between gap-3 border-b p-6 py-4">
        <div className="min-w-0">
          {title && <h3 className="font-semibold">{title}</h3>}
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
)
