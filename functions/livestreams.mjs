async function getStreams(channel){
    return fetch(`https://www.youtube.com/@${channel}/streams`)
    .then(resp => resp.text())
    .then(t =>{
        const regexp = /"contents":{"twoColumnBrowseResultsRenderer":(.*)},"header":{"pageHeaderRenderer"/gm;
        const r = JSON.parse(regexp.exec(t)[1]).tabs.find((x) => x.tabRenderer.title == 'Live')
            .tabRenderer.content.richGridRenderer.contents
            .filter(x => "richItemRenderer" in x && !("upcomingEventData" in x.richItemRenderer.content.videoRenderer 
                            || "lengthText" in x.richItemRenderer.content.videoRenderer));
        return r.map(x => [x.richItemRenderer.content.videoRenderer.videoId,
            x.richItemRenderer.content.videoRenderer.descriptionSnippet.runs[0].text,
            x.richItemRenderer.content.videoRenderer.thumbnail.thumbnails.at(-1)]);
    });
}

exports.handler = async event => {
    const channel = event.queryStringParameters.channel || 'NDTV';
    const data = await getStreams(channel);
    return {
        statusCode: 200,
        headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data),
    }
}



