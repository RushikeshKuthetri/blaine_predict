// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  // baseUrl:'https://i4.utclconnect.com/uat/opt/blaine/',
  // baseUrl:'http://172.16.0.211:8080/uat/opt/blaine/'
  // baseUrl:'https://i4.utclconnect.com/api/opt/blaine/',

  // dev
  baseUrl:'https://id87gxb95c.execute-api.ap-south-1.amazonaws.com/dev/opt/blaine/',
  baseUrlApi:'https://id87gxb95c.execute-api.ap-south-1.amazonaws.com/dev/',
  socketUrl:'wss://681yawzbge.execute-api.ap-south-1.amazonaws.com/dev/',
  redirectUri:'https://dev.d24ohd8z0zwg7d.amplifyapp.com/'

  // local
  // baseUrl:'http://localhost:3000/local/opt/blaine/',
  // baseUrlApi:'http://localhost:3000/local/',
  // socketUrl:'ws://localhost:3001/',

  // uat
  // baseUrl:'https://0207pwadeh.execute-api.ap-south-1.amazonaws.com/uat/opt/blaine/',
  // baseUrlApi:'https://0207pwadeh.execute-api.ap-south-1.amazonaws.com/uat/',
  // socketUrl:'wss://xb4waofs5e.execute-api.ap-south-1.amazonaws.com/uat/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
