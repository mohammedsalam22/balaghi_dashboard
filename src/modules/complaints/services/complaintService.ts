import type { Complaint } from '../types'

// Mock data service for complaints
// In a real application, this would make API calls
export const complaintService = {
  // Get all complaints
  getAll: async (): Promise<Complaint[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    return mockComplaints
  },

  // Get complaint by ID
  getById: async (id: string): Promise<Complaint | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return mockComplaints.find((complaint) => complaint.id === id)
  },

  // Add new complaint
  create: async (complaint: Omit<Complaint, 'id'>): Promise<Complaint> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const newComplaint: Complaint = {
      ...complaint,
      id: `C-${new Date().getFullYear()}-${String(mockComplaints.length + 1).padStart(3, '0')}`,
    }
    mockComplaints.push(newComplaint)
    return newComplaint
  },

  // Update complaint
  update: async (id: string, updates: Partial<Complaint>): Promise<Complaint | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const index = mockComplaints.findIndex((complaint) => complaint.id === id)
    if (index !== -1) {
      mockComplaints[index] = { ...mockComplaints[index], ...updates }
      return mockComplaints[index]
    }
    return undefined
  },

  // Delete complaint
  delete: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const index = mockComplaints.findIndex((complaint) => complaint.id === id)
    if (index !== -1) {
      mockComplaints.splice(index, 1)
      return true
    }
    return false
  },
}

// Mock data
const mockComplaints: Complaint[] = [
  {
    id: 'C-2024-001',
    category: 'Infrastructure',
    status: 'In Progress',
    priority: 'High',
    title: 'Broken Street Light',
    description:
      'The street light near the intersection of Main St and 5th Ave has been non-functional for over a week. Residents are concerned about safety during evening hours.',
    reporter: 'John Smith',
    location: 'Main St & 5th Ave',
    date: '2024-01-15',
  },
  {
    id: 'C-2024-002',
    category: 'Roads',
    status: 'Pending',
    priority: 'High',
    title: 'Potholes on Elm Street',
    description:
      'Multiple large potholes have formed on Elm Street between 2nd and 4th blocks, causing damage to vehicles and creating traffic hazards.',
    reporter: 'Sarah Johnson',
    location: 'Elm Street',
    date: '2024-01-14',
  },
  {
    id: 'C-2024-003',
    category: 'Noise',
    status: 'Pending',
    priority: 'Medium',
    title: 'Noise Complaint - Construction',
    description:
      'Construction work starting before 7 AM causing disturbance to residents. Requesting enforcement of noise ordinance hours.',
    reporter: 'Michael Chen',
    location: 'Oak Avenue',
    date: '2024-01-14',
  },
  {
    id: 'C-2024-004',
    category: 'Parks',
    status: 'Resolved',
    priority: 'Medium',
    title: 'Park Maintenance Request',
    description:
      'Playground equipment at Central Park needs repairs. Several swings are broken and the slide has loose bolts.',
    reporter: 'Emily Davis',
    location: 'Central Park',
    date: '2024-01-13',
  },
  {
    id: 'C-2024-005',
    category: 'Sanitation',
    status: 'In Progress',
    priority: 'High',
    title: 'Illegal Dumping Site',
    description:
      'Large amount of garbage and construction debris illegally dumped in vacant lot on 3rd Street. Needs immediate cleanup.',
    reporter: 'Robert Wilson',
    location: '3rd Street',
    date: '2024-01-13',
  },
  {
    id: 'C-2024-006',
    category: 'Traffic',
    status: 'Resolved',
    priority: 'High',
    title: 'Traffic Signal Malfunction',
    description:
      'Traffic signal at the intersection of Market St and Broadway is not functioning properly. Yellow light duration is too short.',
    reporter: 'Lisa Anderson',
    location: 'Market St & Broadway',
    date: '2024-01-12',
  },
]

