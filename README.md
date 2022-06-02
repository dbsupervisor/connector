# DBSupervisor.com Connector

This is a small service which enables you to connect your database to [DBSupervisor.com](https://dbsupervisor.com). It acts as a secure proxy between your database and the [DBSupervisor](https://dbsupervisor.com) API, providing bi-directional data transfer which enables advanced database insights and management with [DBSupervisor.com](https://dbsupervisor.com).

This connector is designed to be used in production-grade environments and does not require the sharing of passwords or SSH tunnels to function.

The connector is lightweight, secure and production ready, and uses minimal resources.

## Installation

```sh
npm install dbsupervisor-connector
```

## Usage

```sh
Usage: dbsupervisor-connector [options]

Options:
  -V, --version            output the version number.
  -i, --uri [uri]          Database URI.
  -a, --api-key <api-key>  DBSupervisor.com organization API key. Get this from https://dashboard.dbsupervisor.com.
  -b, --backend <backend>  DBSupervisor backend (default: "wss://api.dbsupervisor.com").
  -h, --help               display help for command.
```

### Example usage

```sh
npx dbsupervisor-connector -i postgres://user:pass@localhost:5432/postgres -a <your-dbsupervisor-api-key>
```

Your API key can be obtained from your [dbsupervisor.com Dashboard](https://dashboard.dbsupervisor.com/)
