"use client"

import { useState } from "react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import { Input } from "@shurokkha/ui/components/input"
import { Label } from "@shurokkha/ui/components/label"
import { NativeSelect } from "@shurokkha/ui/components/native-select"
import { Skeleton } from "@shurokkha/ui/components/skeleton"
import { Textarea } from "@shurokkha/ui/components/textarea"
import { Trash2 } from "lucide-react"

import {
  useDocumentMutations,
  useMyDocuments,
} from "@/features/account-lifecycle/hooks/use-account-lifecycle"

import { DOCUMENT_TYPES, type DocumentType } from "@shurokkha/contracts"

const STATUS_STYLES: Record<string, string> = {
  uploaded: "border-amber-500/30 bg-amber-500/15 text-amber-700",
  verified: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  rejected: "border-destructive/30 bg-destructive/15 text-destructive",
}

export function DocumentsClient() {
  const { data, isLoading } = useMyDocuments()
  const { upload, remove } = useDocumentMutations()

  const [documentType, setDocumentType] = useState<DocumentType>("nid")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !file) return
    upload.mutate(
      {
        document_type: documentType,
        title,
        description: description || null,
        file,
      },
      {
        onSuccess: () => {
          setTitle("")
          setDescription("")
          setFile(null)
        },
      }
    )
  }

  const items = data ?? []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload a document</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="document_type">Type</Label>
                <NativeSelect
                  id="document_type"
                  value={documentType}
                  onChange={(e) =>
                    setDocumentType(e.target.value as DocumentType)
                  }
                >
                  {DOCUMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="file">File (PDF / JPG / PNG, max 10MB) *</Label>
              <Input
                id="file"
                type="file"
                accept="application/pdf,image/jpeg,image/png"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                required
              />
            </div>
            <Button type="submit" disabled={upload.isPending}>
              {upload.isPending ? "Uploading…" : "Upload"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No documents uploaded yet.
            </p>
          ) : (
            items.map((d) => (
              <div
                key={d.document_id}
                className="flex items-center justify-between gap-2 rounded-md border p-3 text-sm"
              >
                <div>
                  <div className="font-medium">{d.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {d.document_type} · #{d.document_id} · {d.file_name} ·{" "}
                    {(d.size_bytes / 1024).toFixed(1)} KB
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      STATUS_STYLES[d.status] ??
                      "border-muted-foreground/30 bg-muted text-muted-foreground"
                    }
                  >
                    {d.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => remove.mutate(d.document_id)}
                    disabled={remove.isPending}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
