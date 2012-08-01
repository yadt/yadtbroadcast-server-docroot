###

Javascript generated from Coffeescript!

Please do NOT alter the javascript file directly, but modify the .coffee file instead.

###


target = $.getUrlVar('target')
onSessionOpen = (sess) ->
    sess.subscribe(target, onEvent)

col_width = $.getUrlVar('col_width') || '30em'
ignore_prefix = $.getUrlVar('ignore_prefix')

onEvent = (topicUri, event) ->
    if (event.id == "force-reload")
        window.location.replace(window.location.href)
        window.location.reload(true)

    if (event.id == "full-update")
        console.log(event.id + " received")
        console.log(event)


        artefact_groups = []
        event.payload.map (hg) ->
            artefacts = Object()
            artefacts.hosts = []
            artefacts.names = []
            artefacts.data = []
            hg.map (host) ->
                artefacts.hosts.push host.name
                host.artefacts.map (a_on_h) ->
                    if (! ignore_prefix || ! a_on_h.name.match(ignore_prefix))
                        if artefacts.names.indexOf(a_on_h.name) < 0
                            artefacts.names.push a_on_h.name
            for artefact_name in artefacts.names
                artefact = []
                hg.map (host) ->
                    current = ""
                    host.artefacts.map (a_on_h) ->
                        if a_on_h.name == artefact_name
                            current = a_on_h.current
                    artefact.push {'current': current, 'bin': 0}

                bins = Object()
                artefact.map (pair) ->
                    return unless pair.current
                    bins[pair.current] = 0 unless bins[pair.current]
                    bins[pair.current]++
                sort_by_values = (obj) ->
                    values = Array()
                    for key, value of obj
                        values.push {'key': key, 'value': value}
                    values.sort (a, b) ->
                        return b.value - a.value
                    for pair, index in values
                        obj[pair.key] = index
                sort_by_values bins
                artefact.map (pair) ->
                    if bins[pair.current]
                        pair.bin = bins[pair.current]
                artefacts.data.push artefact
            artefact_groups.push artefacts

        groups = d3.select("section").selectAll("div")
            .data(artefact_groups)
        groups.exit().remove()
        groups.enter()
            .append("div")
            .attr("class", "hostGroupCluster")
            .append("table")
            .append("tr")
        hosts = groups.select("tr").selectAll("th")
            .data((d) -> return [""].concat(d.hosts))
        hosts.enter().append("th").append("h2")
        hosts.selectAll("h2").text(I)

        artefacts = groups.select("table").selectAll("tr.artefact")
            .data(
                (d) -> return d.names,
                key=(d) -> return d.names
            )
        artefacts.exit().remove()
        artefacts.enter()
            .append("tr")
            .attr("class", "artefact")
            .append("th")
            .attr("class", "artefactname")
        artefacts.selectAll("th.artefactname").text(I)

        versions = groups.selectAll("tr.artefact")
            .data((d) -> return d.data)
            .selectAll("td")
            .data(I)
        versions.exit().remove()
        versions.enter()
            .append("td")
            .attr("class", "version")
        groups.selectAll("td.version").text((d) -> d.current)

        background_colors = ['#fff', '#ff7500', '#003468', '#99adc2', '#f7df56']
        max_background_color = background_colors.length
        groups.selectAll("td.version")
            .style "background-color", (d) ->
                background_colors[if d.bin < max_background_color then d.bin else max_background_color - 1]

