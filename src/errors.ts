export class MissingExtensionError extends Error {
  constructor(databaseName: string, extensionName: string) {
    super(
      `Database '${databaseName}' missing required extension '${extensionName}'`,
    )
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof MissingExtensionError) {
    console.error(error.message)
  } else {
    console.error(`Unknown error occurred`)
    process.exit(1)
  }
}
