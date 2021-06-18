import DatabaseConnection from "../../../../../src/domain/database/database-connection.interface"

export class MockConnectionReturnEmpty implements DatabaseConnection {
  async open(): Promise<void> {}
  async close(): Promise<void> {}
  async query<T>(_queryString: string, _queryArguments: any[]): Promise<T[]> {
    return []
  }
}

export class MockConnectionReturnOne implements DatabaseConnection {
  constructor(private readonly arg: object) {}
  async open(): Promise<void> {}
  async close(): Promise<void> {}
  async query<T>(_queryString: string, _queryArguments: any[]): Promise<T[]> {
    // @ts-ignore
    return [this.arg]
  }
}
