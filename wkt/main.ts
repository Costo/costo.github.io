import wkt from 'terraformer-wkt-parser';
import stringify from "json-stringify-pretty-compact";

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

if(location.hash) {
    input.value = decodeURIComponent(location.hash.substring(1));
    location.hash = '';
    parseWKT(input);
}

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



