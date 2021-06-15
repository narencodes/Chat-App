const express = require('express');

const API_BASE_URL = '/api';

const baseBeforeEnter = () => Promise.resolve();
const baseError = {
    code: "400",
    message: "something went wrong"
}

const getMiddleWare = (beforeEnter = baseBeforeEnter) => {
    return (req, res, next) => {
        let returnedFunction = beforeEnter(req);
        // Check if the function returned by beforeEnter is Promise and call next based on that
        let isPromise = returnedFunction instanceof Promise;
        if (isPromise) {
            returnedFunction
                .then(next)
                .catch(({ status = 500, error = baseError }) => {
                    res.status(status).send({
                        error
                    })
                })
        } else {
            next();
        }
    }
}

const setResponseHeaders = (res, headers) => {
    Object.keys(headers).forEach(header => {
        res.setHeader(header, headers[header]);
    })
}

const setResponseCookies = (res, cookies) => {
    Object.keys(cookies).forEach(cookie => {
        res.cookie(cookie, cookies[cookie]);
    })
}

/**
 * 
 * @param {Function} handler - Handler function to handle api request
 * @description - Format the given Handler function to send success/error responses uniformly throughout product
 */
const getApiHandler = handler => {
    return (req, res) => {
        handler(req)
            .then(({ status = 200, data, headers, isBuffer, cookies }) => {
                headers && setResponseHeaders(res, headers);
                cookies && setResponseCookies(res, cookies);
                res.status(status).send(isBuffer ? data : {
                    data,
                    url: req.baseUrl || req.originalUrl
                })
            })
            .catch((err) => {
                console.log(err);
                let { status = 500, error = baseError } = err;
                res.status(status).send({
                    error
                })
            })
    }
}

/**
 * 
 * @param {Array} children - children routes for a particular parent
 * @param {String} currentRoute 
 * @description To Construct a Router object with child routes which will be used by express app ( app.use )
 */
const getChildRouter = children => {
    const Router = express.Router();
    children.forEach(child => {
        let { path = "", method = "use", beforeEnter, handler, children = [] } = child;
        path = "/" + path; // prepend slash to match parent path
        Router[method](path, getMiddleWare(beforeEnter), children.length ? getChildRouter(children) : getApiHandler(handler));
    });
    return Router;
}

/**
 * 
 * @param {Express App} app
 * @param {Array} routes - list of route objects
 * @description push function to declare the given set of route objects
 * [{
 *      path : 'root',
 *      beforeEnter : () => {}
 *      children : [
 *          ...routeObj
 *      ]      
 *  }]
 */

const push = (app, routes) => {
    routes.forEach(routeObj => {
        let { path, method = "use", beforeEnter, handler, children = [] } = routeObj;
        const currentRoute = API_BASE_URL + "/" + path;
        // If children key is present generate Router Object and use it with express app;
        app[method](currentRoute, getMiddleWare(beforeEnter), children.length ? getChildRouter(children) : getApiHandler(handler));
    })
};

module.exports = {
    push
}