import {Buffer} from 'buffer';
import {encode} from 'base-64';
import vimeoConfig from '../../vimeo.config';
import url from 'url';
import querystring from 'querystring';
import * as tus from 'tus-js-client';

class Vimeo {
  constructor(accessToken = '') {
    this._clientId = vimeoConfig.clientId;
    this._clientSecret = vimeoConfig.clientSecret;
    this._accessToken =
      accessToken === '' ? vimeoConfig.accessToken : accessToken;

    this.request_defaults = {
      protocol: 'https:',
      hostname: 'api.vimeo.com',
      port: 443,
      method: 'GET',
      query: {},
      headers: {
        Accept: 'application/vnd.vimeo.*+json;version=3.4',
        'User-Agent': 'Vimeo.js/2.1.1',
      },
    };

    this.authEndpoints = {
      authorization: '/oauth/authorize',
      accessToken: '/oauth/access_token',
      clientCredentials: '/oauth/authorize/client',
    };
  }

  generateClientCredentials = function (scope, fn) {
    var query = {
      grant_type: 'client_credentials',
    };

    if (scope) {
      if (Array.isArray(scope)) {
        query.scope = scope.join(' ');
      } else {
        query.scope = scope;
      }
    } else {
      query.scope = 'public';
    }

    var _self = this;

    this.request(
      {
        method: 'POST',
        hostname: _self.request_defaults.hostname,
        path: _self.authEndpoints.clientCredentials,
        query: query,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
      function (err, body, status, headers) {
        if (err) {
          return fn(err, null, status, headers);
        } else {
          fn(null, body, status, headers);
        }
      },
    );
  };

  _performTusUpload = function (
    file,
    fileSize,
    attempt,
    completeCallback,
    progressCallback,
    errorCallback,
  ) {
    var fileUpload = file;

    // if (typeof file === 'string') {
    //   fileUpload = fs.createReadStream(file);
    // // }

    var upload = new tus.Upload(fileUpload, {
      endpoint: 'none',
      uploadSize: fileSize,
      retryDelays: [0, 1000, 3000, 5000],
      onError: function (e) {
        return errorCallback(e);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        return progressCallback(bytesUploaded, bytesTotal);
      },
      onSuccess: function () {
        return completeCallback(attempt.uri);
      },
    });

    upload.url = attempt.upload.upload_link;
    upload.start();
  };

  upload = function (
    file,
    fileSize,
    params,
    completeCallback,
    progressCallback,
    errorCallback,
  ) {
    var _self = this;
    var fileSize;

    if (typeof params === 'function') {
      errorCallback = progressCallback;
      progressCallback = completeCallback;
      completeCallback = params;
      params = {};
    }

    // Ignore any specified upload approach and size.
    if (typeof params.upload === 'undefined') {
      params.upload = {
        approach: 'tus',
        size: fileSize,
      };
    } else {
      params.upload.approach = 'tus';
      params.upload.size = fileSize;
    }

    var options = {
      path: '/me/videos?fields=uri,name,upload',
      method: 'POST',
      query: params,
    };

    // Use JSON filtering so we only receive the data that we need to make an upload happen.
    this.request(options, function (res) {
      if (res.uri === undefined) {
        return errorCallback(
          'Unable to initiate an upload asdf. [' + JSON.stringify(res) + ']',
        );
      }
      var attempt = res;
      _self._performTusUpload(
        file,
        fileSize,
        attempt,
        completeCallback,
        progressCallback,
        errorCallback,
      );
    });
  };

  _applyQuerystringParams = function (requestOptions, options) {
    var querystring = '';

    if (!options.query) {
      return requestOptions.path;
    }

    // If we have parameters, apply them to the URL.
    if (Object.keys(options.query).length) {
      if (requestOptions.path.indexOf('?') < 0) {
        // If the existing path does not contain any parameters, apply them as the only options.
        querystring = '?' + querystring.stringify(options.query);
      } else {
        // If the user already added parameters to the URL, we want to add them as additional
        // parameters.
        querystring = '&' + querystring.stringify(options.query);
      }
    }

    return requestOptions.path + querystring;
  };

  _applyDefaultRequestOptions = function (options) {
    var requestOptions = {
      protocol: options.protocol || this.request_defaults.protocol,
      host: options.hostname || this.request_defaults.hostname,
      port: options.port || this.request_defaults.port,
      method: options.method || this.request_defaults.method,
      headers: options.headers || {},
      credentials: 'include',
      body: '',
      path: options.path,
    };

    var key = null;

    // Apply the default headers
    if (this.request_defaults.headers) {
      for (key in this.request_defaults.headers) {
        if (!requestOptions.headers[key]) {
          requestOptions.headers[key] = this.request_defaults.headers[key];
        }
      }
    }

    return requestOptions;
  };

  _buildRequestOptions = function (options) {
    // Set up the request object. we always use the options paramter first, and if no value is
    // provided we fall back to request defaults.
    var requestOptions = this._applyDefaultRequestOptions(options);

    if (this._accessToken) {
      requestOptions.headers.Authorization = 'Bearer ' + this._accessToken;
    } else if (this._clientId && this._clientSecret) {
      requestOptions.headers.Authorization = `Basic ${encode(
        this._clientId + ':' + this._clientSecret,
      )}`;
    }

    if (
      ['POST', 'PATCH', 'PUT', 'DELETE'].indexOf(requestOptions.method) !==
        -1 &&
      !requestOptions.headers['Content-Type']
    ) {
      // Set proper headers for POST, PATCH and PUT bodies.
      requestOptions.headers['Content-Type'] = 'application/json';
    } else if (requestOptions.method === 'GET') {
      // Apply parameters to the URL for GET requests.
      requestOptions.path = this._applyQuerystringParams(
        requestOptions,
        options,
      );
    }

    return requestOptions;
  };

  request = function (options, callback) {
    // If a URL was provided, build an options object.
    if (typeof options === 'string') {
      options = url.parse(options, true);
      options.method = 'GET';
    }

    // If we don't have a path at this point, error. a path is the only required field. We have
    // defaults for everything else important.
    if (typeof options.path !== 'string') {
      return callback(new Error('You must provide an API path.'));
    }

    // Add leading slash to path if missing
    if (options.path.charAt(0) !== '/') {
      options.path = '/' + options.path;
    }

    // Turn the provided options into options that are valid for `client.request`.
    var requestOptions = this._buildRequestOptions(options);

    if (
      ['POST', 'PATCH', 'PUT', 'DELETE'].indexOf(requestOptions.method) !== -1
    ) {
      if (requestOptions.headers['Content-Type'] === 'application/json') {
        requestOptions.body = JSON.stringify(options.query);
      } else {
        requestOptions.body = querystring.stringify(options.query);
      }

      if (requestOptions.body) {
        requestOptions.headers['Content-Length'] = Buffer.byteLength(
          requestOptions.body,
          'utf8',
        );
      } else {
        requestOptions.headers['Content-Length'] = 0;
      }
    }
    var _self = this;
    fetch(
      `https://${this.request_defaults.hostname}${options.path}`,
      requestOptions,
    )
      .then(res => res.json())
      .then(res => callback(res))
      .catch(err => callback(err));
  };
}

export default Vimeo;
