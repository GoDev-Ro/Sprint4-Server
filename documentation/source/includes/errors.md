# Errors

The API uses the following error codes:


Error Code | Meaning
---------- | -------
400 | Bad Request -- Your request sucks for an unknown reason
409 | Conflict -- Probably a validation error
403 | Forbidden -- The entry you requested is hidden for administrators only
404 | Not Found -- The specified entry could not be found
405 | Method Not Allowed -- You tried to access a resource with an invalid method
500 | Internal Server Error -- We had a problem with our server. Try again later.
503 | Service Unavailable -- We're temporarially offline for maintanance. Please try again later.