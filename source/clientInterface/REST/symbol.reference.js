// symbols used in the middleware context, for next middlewares to use.
export const context = {
  clientSideProjectConfig: Symbol('clientSideProjectConfig'),
  parsed: {
    path: 'path',
    filePath: Symbol('parsed:filePath'),
    atSign: Symbol('parsed:atSign'),
    dollarSign: Symbol('pased:dollarSign'),
  },
}
