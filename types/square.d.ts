declare module "square" {
  export class Client {
    constructor(config: any)
    ordersApi: any
    paymentsApi: any
  }

  export const Environment: {
    Sandbox: string
    Production: string
  }
}
