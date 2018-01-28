/* To mock live api urls with local static data; default false */
spa.api.mock = true;

/* If live-api-server is not same as front-end-ui server; */
//spa.api.baseUrl = 'https://live-api-server-address:port/';

/* live-api url prefix to identify Live-Api calls */
app['api'] = { liveApiPrefix: 'api/' };

/* All API Urls */
/* $ prefix in Key refers to dataUrl for the component */

/* ! in url => force to mock location */
/* ~ in url => force to live location */
/* {urlParamName}  => if live, replaced with actual urlParamValue
                   => if mock, replaced with string '_urlParamName'
  {<urlParamName>} => replaced with actual urlParamValue
  {{<urlParamName>}} => replaced with actual urlParamValue only for mock, removes entire param for live
*/
$.extend(spa.api.urls, {

  //Component Data APIs (Default GET)
  // $componentA: 'api/path/to/componentA-data',
  // $componentB: '!api/path/to/componentB-data/{urlParam1}/{<urlParam2>}',
  // $componentC: '~api/path/to/componentC-data/{urlParamX}/{<urlParamY>}',
  // $componentC: '~api/path/to/componentC-data/{{<urlParamX>}}/{<urlParamY>}',

  //Action based REST APIs (GET/POST/PUT/DELETE)
  // readFormA: '!api/path/to/read/data',
  // saveFormA: '~api/path/to/save/data'

});