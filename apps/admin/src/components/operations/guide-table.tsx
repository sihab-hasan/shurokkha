"use client"

import Link from "next/link"
import { Trash2 } from "lucide-react"

import { Badge } from "@shurokkha/ui/components/badge"
import { Button } from "@shurokkha/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shurokkha/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shurokkha/ui/components/table"

import { adminRoutes } from "@/config/routes"
import { useGuides } from "@/hooks/operations/use-guides"

import { Can } from "@/components/auth/can"
import { statusBadgeClass } from "./badges"

export function GuideTable() {
  const { data, isLoading, remove } = useGuides()

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>Guides</span>
            <Badge variant="outline" className="font-mono text-xs">
              {data.length} records
            </Badge>
          </CardTitle>
          <CardDescription>
            Preparedness and recovery knowledge base articles.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Read (min)</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Loading guides...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No guides yet. Create one to publish knowledge.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.guide_id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-medium">
                      <Link
                        href={adminRoutes.operations.guides.detail(
                          row.guide_id
                        )}
                        className="hover:underline"
                      >
                        #{row.guide_id}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="line-clamp-1 text-sm font-medium">
                        {row.title}
                      </div>
                      <span className="line-clamp-1 text-xs text-muted-foreground">
                        /{row.slug}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {row.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusBadgeClass(row.status)}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {row.author_name || "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {row.reading_time_minutes}
                    </TableCell>
                    <TableCell className="text-right">
                      <Can role="admin">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => remove.mutate(row.guide_id)}
                          disabled={remove.isPending}
                          title="Delete Guide"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </Can>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
