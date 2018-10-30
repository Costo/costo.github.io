import wkt from 'terraformer-wkt-parser';
import stringify from "json-stringify-pretty-compact"

const form = document.getElementById("wkt-form") as HTMLFormElement;
const result = document.getElementById("geojson-result") as HTMLTextAreaElement;
const link = document.getElementById("geojsonio-link") as HTMLAnchorElement;

form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    const el = this.elements.namedItem('wkt') as HTMLInputElement;
    try {
        const geometry = wkt.parse(el.value);
        const geojson = stringify(geometry);
        result.value = geojson;
        link.href = `http://geojson.io/#data=data:application/json,${encodeURIComponent(geojson)}`;
    } catch(error) {
        result.value = error;
        link.href = "#";
    }
});

link.addEventListener('click', function(ev) {
    if(this.host === window.location.host){
        ev.preventDefault();
    }
});