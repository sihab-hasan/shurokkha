"use client"

import { useQuery } from "@tanstack/react-query"

import { getShurokkhaApi } from "@/lib/api"

import { operationsQueryKeys } from "./query-keys"
import type {
  ActiveTeamRow,
  AreaSeverityRow,
  CitizenStatsRow,
  FacilityLocationRow,
  JoinRow,
  ReportSummaryCard,
  ShelterSummaryRow,
} from "./types"

export function useReportSummary() {
  const api = getShurokkhaApi()
  return useQuery({
    queryKey: operationsQueryKeys.reports.summary(),
    queryFn: async () => {
      const res = await api.admin.reports.summary()
      return (res.data ?? {}) as ReportSummaryCard
    },
  })
}

export function useAreaSeverity() {
  const api = getShurokkhaApi()
  return useQuery({
    queryKey: operationsQueryKeys.reports.areaSeverity(),
    queryFn: async () => {
      const res = await api.admin.reports.areaSeverity()
      return (res.data ?? []) as unknown as AreaSeverityRow[]
    },
  })
}

export function useActiveTeams() {
  const api = getShurokkhaApi()
  return useQuery({
    queryKey: operationsQueryKeys.reports.activeTeams(),
    queryFn: async () => {
      const res = await api.admin.reports.activeTeams()
      return (res.data ?? []) as unknown as ActiveTeamRow[]
    },
  })
}

export function useCitizenStats() {
  const api = getShurokkhaApi()
  return useQuery({
    queryKey: operationsQueryKeys.reports.citizenStats(),
    queryFn: async () => {
      const res = await api.admin.reports.citizenStats()
      return (res.data ?? []) as unknown as CitizenStatsRow[]
    },
  })
}

export function useShelterSummaryView() {
  const api = getShurokkhaApi()
  return useQuery({
    queryKey: operationsQueryKeys.reports.shelterSummaryView(),
    queryFn: async () => {
      const res = await api.admin.reports.shelterSummaryView()
      return (res.data ?? []) as unknown as ShelterSummaryRow[]
    },
  })
}

export function useInnerJoin() {
  const api = getShurokkhaApi()
  return useQuery({
    queryKey: operationsQueryKeys.reports.innerJoin(),
    queryFn: async () => {
      const res = await api.admin.reports.innerJoin()
      return (res.data ?? []) as unknown as JoinRow[]
    },
  })
}

export function useLeftJoin() {
  const api = getShurokkhaApi()
  return useQuery({
    queryKey: operationsQueryKeys.reports.leftJoin(),
    queryFn: async () => {
      const res = await api.admin.reports.leftJoin()
      return (res.data ?? []) as unknown as JoinRow[]
    },
  })
}

export function useRightJoin() {
  const api = getShurokkhaApi()
  return useQuery({
    queryKey: operationsQueryKeys.reports.rightJoin(),
    queryFn: async () => {
      const res = await api.admin.reports.rightJoin()
      return (res.data ?? []) as unknown as JoinRow[]
    },
  })
}

export function useFullOuterJoin() {
  const api = getShurokkhaApi()
  return useQuery({
    queryKey: operationsQueryKeys.reports.fullOuterJoin(),
    queryFn: async () => {
      const res = await api.admin.reports.fullOuterJoin()
      return (res.data ?? []) as unknown as JoinRow[]
    },
  })
}

export function useFacilityLocations() {
  const api = getShurokkhaApi()
  return useQuery({
    queryKey: operationsQueryKeys.reports.facilityLocations(),
    queryFn: async () => {
      const res = await api.admin.reports.facilityLocations()
      return (res.data ?? []) as unknown as FacilityLocationRow[]
    },
  })
}
