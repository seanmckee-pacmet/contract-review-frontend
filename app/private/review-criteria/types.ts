export interface Clause {
  id: string
  name: string
  description: string
}

export interface CriteriaGroup {
  id: string
  name: string
  clauses: Clause[]
}