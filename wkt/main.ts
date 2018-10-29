import wkt from 'terraformer-wkt-parser';
import stringify from "json-stringify-pretty-compact"

const form = document.getElementById("wkt-form") as HTMLFormElement;
const result = document.getElementById("geojson-result") as HTMLTextAreaElement;

form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    const el = this.elements.namedItem('wkt') as HTMLInputElement;
    try {
        const geometry = wkt.parse(el.value);
        result.value = stringify(geometry);
    } catch(error) {
        result.value = error;
    }
});