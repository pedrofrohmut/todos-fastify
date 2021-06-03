export default interface DatabaseConnection {
  open(): Promise<void>
  close(): Promise<void>
}
