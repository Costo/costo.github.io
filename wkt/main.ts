import wkt from 'terraformer-wkt-parser';
import stringify from "json-stringify-pretty-compact";
import { parse } from 'query-string';

const example: string = 'MULTIPOLYGON (((-93.515625 50.5134265263396,-90.703125 25.1651733686639,-80.5078125 27.6835280837878,-80.5078125 37.9961626797281,-70.6640625 37.4399740522706,-70.6640625 28.9216312824213,-60.8203125 28.9216312824213,-61.171875 56.9449741808516,-72.421875 55.5783446721821,-72.421875 45.5832897560063,-81.2109375 45.5832897560063,-81.5625 57.3265212252171,-95.2734375 56.3652501368561,-93.515625 50.5134265263396)),((-50.2734375 55.7765730186677,-52.03125 30.1451271833761,-40.4296875 29.8406438998344,-40.4296875 55.3791104480105,-50.2734375 55.7765730186677)),((-29.53125 56.7527228720574,-24.609375 38.272688535981,-19.3359375 38.272688535981,-14.4140625 55.9737982050766,-29.53125 56.7527228720574)),((-26.3671875 34.5970415161442,-25.6640625 28.6134594240044,-17.2265625 28.6134594240044,-16.875 34.307143856288,-26.3671875 34.5970415161442)))';
const form = document.getElementById("wkt-form") as HTMLFormElement;
const input = form.elements.namedItem('wkt') as HTMLInputElement;
const result = document.getElementById("geojson-result") as HTMLTextAreaElement;
const link = document.getElementById("geojsonio-link") as HTMLAnchorElement;

form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    parseWKT(input);
});

link.addEventListener('click', function(ev) {
    if(this.host === window.location.host){
        ev.preventDefault();
    }
});

const params = parse(location.hash);
const data = params['data'];
if(params['sayhi'] !== undefined) {
    input.value = example;
    parseWKT(input);
} else if(typeof data === 'string') {
    input.value = data;
    parseWKT(input);
}
location.hash = '';

function parseWKT(el: HTMLInputElement) {
    try {
        const geometry = wkt.parse(el.value);
        const geojson = stringify(geometry);
        result.value = geojson;
        link.href = `http://geojson.io/#data=data:application/json,${encodeURIComponent(geojson)}`;
    } catch(error) {
        result.value = error;
        link.href = "#";
    }
}
