# poi-app
Point of Interest Web App

This is an implementation of the POI Web App at the "excellent" grading-band level.

Users can sign up, sign in and are able to add, update, and view points of interest which are made up of a name, description and image. The name and description can be updated. There is a user dashboard where they can view their points of interest and a general POI board where they can view points of interest from all users. There is also a user settings page where they can update their details.

There is now also an admin dashboard where the administrator can view all users, delete users, add points of interest.

The database has been moved to the cloud.

I attempted to deploy the project to Glitch, but am getting an error that looks like it has something to do with Hapi:

```
/rbd/pnpm-volume/e51f919d-1b48-4328-93d0-28072c6d1112/node_modules/.registry.npmjs.org/@hapi/hapi/19.1.1/node_modules/@hapi/hapi/lib/core.js:51
    actives = new WeakMap();                                                   // Active requests being processed
            ^
SyntaxError: Unexpected token =
    at new Script (vm.js:80:7)
    at createScript (vm.js:274:10)
    at Object.runInThisContext (vm.js:326:10)
    at Module._compile (internal/modules/cjs/loader.js:664:28)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)
    at Module.load (internal/modules/cjs/loader.js:600:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:539:12)
    at Function.Module._load (internal/modules/cjs/loader.js:531:3)
    at Module.require (internal/modules/cjs/loader.js:637:17)
    at require (internal/modules/cjs/helpers.js:22:18)
```
