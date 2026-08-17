import Link from "next/link"
import { MessageCircleMore } from "lucide-react"

import {
  ConversationLayout,
  ConversationList,
  MessageThread,
} from "@shurokkha/ui-patterns/messaging"
import { PageHeader, SectionHeader } from "@shurokkha/ui-patterns/navigation"

export interface AppMessageItem {
  title: string
  href: string
  description: string
  unread?: boolean
}

export interface AppMessagesProps {
  title?: string
  description: string
  items: AppMessageItem[]
  contextTitle: string
  contextDescription: string
}

export function AppMessages({
  title = "Messages",
  description,
  items,
  contextTitle,
  contextDescription,
}: AppMessagesProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />

      <ConversationLayout
        minHeight="34rem"
        conversations={
          <ConversationList
            header={
              <SectionHeader
                title="Conversations"
                description={`${items.length} available`}
                size="sm"
                align="left"
                className="mb-0 max-w-none"
              />
            }
          >
            <div className="divide-y divide-border">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-4 transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
                >
                  <div className="flex items-start gap-3">
                    <span className="relative mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <MessageCircleMore className="size-4" />
                      {item.unread ? (
                        <>
                          <span
                            aria-hidden="true"
                            className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary"
                          />
                          <span className="sr-only">Unread</span>
                        </>
                      ) : null}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </ConversationList>
        }
        detail={
          <div className="p-5">
            <p className="text-sm font-medium">{contextTitle}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {contextDescription}
            </p>
          </div>
        }
      >
        <MessageThread
          isEmpty
          empty={
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <MessageCircleMore className="size-8 text-muted-foreground" />
              <p className="mt-4 font-medium">Select a conversation</p>
              <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                Choose a verified conversation from the list to open its message
                history.
              </p>
            </div>
          }
        />
      </ConversationLayout>
    </div>
  )
}
