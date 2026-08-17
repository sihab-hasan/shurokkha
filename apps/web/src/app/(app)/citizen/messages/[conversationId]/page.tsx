import AppResourceDetail from "@/components/app/app-resource-detail"
export default async function Page({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = await params
  return (
    <AppResourceDetail
      title="Conversation"
      resourceLabel="Message"
      resourceId={conversationId}
      backHref="/citizen/messages"
    />
  )
}
