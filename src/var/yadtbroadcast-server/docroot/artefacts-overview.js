// Generated by CoffeeScript 1.3.1
/*

Javascript generated from Coffeescript!

Please do NOT alter the javascript file directly, but modify the .coffee file instead.
*/

var col_width, ignore_prefix, onEvent, onSessionOpen, target;

target = $.getUrlVar('target');

onSessionOpen = function(sess) {
  return sess.subscribe(target, onEvent);
};

col_width = $.getUrlVar('col_width') || '30em';

ignore_prefix = $.getUrlVar('ignore_prefix');

onEvent = function(topicUri, event) {
  var artefact_groups, artefacts, background_colors, groups, hosts, key, max_background_color, versions;
  if (event.id === "force-reload") {
    window.location.replace(window.location.href);
    window.location.reload(true);
  }
  if (event.id === "full-update") {
    console.log(event.id + " received");
    console.log(event);
    artefact_groups = [];
    event.payload.map(function(hg) {
      var artefact, artefact_name, artefacts, bins, sort_by_values, _i, _len, _ref;
      artefacts = Object();
      artefacts.hosts = [];
      artefacts.names = [];
      artefacts.data = [];
      hg.map(function(host) {
        artefacts.hosts.push(host.name);
        return host.artefacts.map(function(a_on_h) {
          if (!ignore_prefix || !a_on_h.name.match(ignore_prefix)) {
            if (artefacts.names.indexOf(a_on_h.name) < 0) {
              return artefacts.names.push(a_on_h.name);
            }
          }
        });
      });
      _ref = artefacts.names;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        artefact_name = _ref[_i];
        artefact = [];
        hg.map(function(host) {
          var current;
          current = "";
          host.artefacts.map(function(a_on_h) {
            if (a_on_h.name === artefact_name) {
              return current = a_on_h.current;
            }
          });
          return artefact.push({
            'current': current,
            'bin': 0
          });
        });
        bins = Object();
        artefact.map(function(pair) {
          if (!pair.current) {
            return;
          }
          if (!bins[pair.current]) {
            bins[pair.current] = 0;
          }
          return bins[pair.current]++;
        });
        sort_by_values = function(obj) {
          var index, key, pair, value, values, _j, _len1, _results;
          values = Array();
          for (key in obj) {
            value = obj[key];
            values.push({
              'key': key,
              'value': value
            });
          }
          values.sort(function(a, b) {
            return b.value - a.value;
          });
          _results = [];
          for (index = _j = 0, _len1 = values.length; _j < _len1; index = ++_j) {
            pair = values[index];
            _results.push(obj[pair.key] = index);
          }
          return _results;
        };
        sort_by_values(bins);
        artefact.map(function(pair) {
          if (bins[pair.current]) {
            return pair.bin = bins[pair.current];
          }
        });
        artefacts.data.push(artefact);
      }
      return artefact_groups.push(artefacts);
    });
    groups = d3.select("section").selectAll("div").data(artefact_groups);
    groups.exit().remove();
    groups.enter().append("div").attr("class", "hostGroupCluster").append("table").append("tr");
    hosts = groups.select("tr").selectAll("th").data(function(d) {
      return [""].concat(d.hosts);
    });
    hosts.enter().append("th").append("h2");
    hosts.selectAll("h2").text(I);
    artefacts = groups.select("table").selectAll("tr.artefact").data(function(d) {
      return d.names;
    }, key = function(d) {
      return d.names;
    });
    artefacts.exit().remove();
    artefacts.enter().append("tr").attr("class", "artefact").append("th").attr("class", "artefactname");
    artefacts.selectAll("th.artefactname").text(I);
    versions = groups.selectAll("tr.artefact").data(function(d) {
      return d.data;
    }).selectAll("td").data(I);
    versions.exit().remove();
    versions.enter().append("td").attr("class", "version");
    groups.selectAll("td.version").text(function(d) {
      return d.current;
    });
    background_colors = ['#fff', '#ff7500', '#003468', '#99adc2', '#f7df56'];
    max_background_color = background_colors.length;
    return groups.selectAll("td.version").style("background-color", function(d) {
      return background_colors[d.bin < max_background_color ? d.bin : max_background_color - 1];
    });
  }
};