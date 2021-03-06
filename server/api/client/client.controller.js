/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /clients              ->  index
 * POST    /clients              ->  create
 * GET     /clients/:id          ->  show
 * PUT     /clients/:id          ->  update
 * DELETE  /clients/:id          ->  destroy
 */

'use strict';
var util = require('util');
var _ = require('lodash');
var client = require('./client.model');



// Get list of clients
exports.index = function(req, res) {
  client.find(function (err, clients) {
    if(err) { return handleError(res, err); }
    return res.json(200, clients);
  });
};

// Get a single client
exports.show = function(req, res) {
  client.findById(req.params.id, function (err, client) {
    if(err) { return handleError(res, err); }
    if(!client) { return res.send(404); }
    return res.json(client);
  });
};

// Creates a new client in the DB.
exports.create = function(req, res) {
  
  console.log('Body with:' + util.inspect(req.body, false, null));
  client.create(req.body, function(err, client) {
    if(err) { return handleError(res, err); }
    return res.json(201, client);
  });
};

// Updates an existing client in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  client.findById(req.params.id, function (err, client) {
    if (err) { return handleError(res, err); }
    if(!client) { return res.send(404); }
    var updated = _.merge(client, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, client);
    });
  });
};

// Deletes a client from the DB.
exports.destroy = function(req, res) {
  client.findById(req.params.id, function (err, client) {
    if(err) { return handleError(res, err); }
    if(!client) { return res.send(404); }
    client.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}