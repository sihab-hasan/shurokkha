import { Container } from "@shurokkha/ui/layout/container"
import { PageHeader } from "@shurokkha/ui/layout/page-header"
import { Section } from "@shurokkha/ui/layout/section"

import { DocumentsClient } from "./_components/documents-client"

export default function DocumentsPage() {
  return (
    <Section className="space-y-6">
      <Container padded={false} className="space-y-6">
        <PageHeader
          title="Document Vault"
          description="Upload identification, photos, and other evidence. Used to verify assistance requests."
        />
        <DocumentsClient />
      </Container>
    </Section>
  )
}
