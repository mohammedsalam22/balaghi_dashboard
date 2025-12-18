import apiService from '../../../shared/services/apiService'
import { complaintService } from '../../complaints/services/complaintService'
import { governmentAgencyService } from '../../governmentagency/services/governmentAgencyService'
import type { Complaint, ComplaintStatus } from '../../complaints/types'
import type { CitizensListResponse } from '../../citizens/types'

export interface DashboardKpis {
  totalComplaints: number
  openComplaints: number
  resolvedComplaints: number
  rejectedComplaints: number
  totalCitizens: number
  totalAgencies: number
  totalEmployees: number
}

export interface DashboardStatusCount {
  status: ComplaintStatus
  count: number
}

export interface DashboardTrendPoint {
  date: string // YYYY-MM-DD (UTC)
  count: number
}

export interface DashboardRecentComplaint {
  id: string
  trackingNumber: string
  citizenName: string
  agencyName: string
  status: ComplaintStatus
  createdAt: string
}

export interface DashboardData {
  kpis: DashboardKpis
  statusCounts: DashboardStatusCount[]
  trend: DashboardTrendPoint[]
  recentComplaints: DashboardRecentComplaint[]
}

const OPEN_STATUSES: ComplaintStatus[] = ['Pending', 'UnderReview', 'InProgress']

function toUtcDateKey(value: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function buildTrend(complaints: Complaint[], days: number): DashboardTrendPoint[] {
  const map = new Map<string, number>()
  for (const c of complaints) {
    const key = toUtcDateKey(c.createdAt)
    map.set(key, (map.get(key) ?? 0) + 1)
  }

  const today = new Date()
  const points: DashboardTrendPoint[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
    d.setUTCDate(d.getUTCDate() - i)

    const y = d.getUTCFullYear()
    const m = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')
    const key = `${y}-${m}-${day}`

    points.push({ date: key, count: map.get(key) ?? 0 })
  }

  return points
}

function countByStatus(complaints: Complaint[]): Record<ComplaintStatus, number> {
  return complaints.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1
      return acc
    },
    {
      Pending: 0,
      UnderReview: 0,
      InProgress: 0,
      Resolved: 0,
      Rejected: 0,
    } as Record<ComplaintStatus, number>
  )
}

export const dashboardService = {
  getAdminDashboard: async (): Promise<DashboardData> => {
    // Fetch all required data in parallel
    const axiosInstance = apiService.getAxiosInstance()

    const [complaints, agencies, citizensResp] = await Promise.all([
      complaintService.getAll({ isAdmin: true }),
      governmentAgencyService.getAll(),
      axiosInstance
        .get<CitizensListResponse>('/admin/citizens', {
          params: { page: 1, pageSize: 1 },
        })
        .then((r) => r.data),
    ])

    const statusMap = countByStatus(complaints)

    const totalComplaints = complaints.length
    const openComplaints = OPEN_STATUSES.reduce((sum, s) => sum + (statusMap[s] ?? 0), 0)
    const resolvedComplaints = statusMap.Resolved ?? 0
    const rejectedComplaints = statusMap.Rejected ?? 0

    const totalAgencies = agencies.length
    const totalEmployees = agencies.reduce((sum, a) => sum + (a.employees?.length ?? 0), 0)

    const totalCitizens = citizensResp.totalCount ?? 0

    const kpis: DashboardKpis = {
      totalComplaints,
      openComplaints,
      resolvedComplaints,
      rejectedComplaints,
      totalCitizens,
      totalAgencies,
      totalEmployees,
    }

    const statusCounts: DashboardStatusCount[] = (Object.keys(statusMap) as ComplaintStatus[]).map((status) => ({
      status,
      count: statusMap[status] ?? 0,
    }))

    const trend = buildTrend(complaints, 14)

    const recentComplaints: DashboardRecentComplaint[] = [...complaints]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
      .map((c) => ({
        id: c.id,
        trackingNumber: c.trackingNumber,
        citizenName: c.citizenName,
        agencyName: c.agencyName,
        status: c.status,
        createdAt: c.createdAt,
      }))

    return { kpis, statusCounts, trend, recentComplaints }
  },
}
