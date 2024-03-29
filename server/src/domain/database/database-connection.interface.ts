export default interface DatabaseConnection {
  open(): Promise<void>
  close(): Promise<void>
  query<T>(queryString: string, queryArguments: any[]): Promise<T[]>
  mutate(queryString: string, queryArguments: any[]): Promise<void>
}
