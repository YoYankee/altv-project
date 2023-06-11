import * as alt from "alt-client";
import * as native from "natives";

const controlKey = 79;
const document = new alt.RmlDocument("/Client/nametag/index.rml");
const container = document.getElementByID("nametag-container");
const nameTags = new Map();
let tickHandle: number;

alt.on("gameEntityCreate", (entity) => {
    if (container == null) return;

    const rmlElement = document.createElement("button");
    rmlElement.rmlId = entity.id.toString();
    rmlElement.addClass("nametag");
    rmlElement.addClass("hide");

    if (entity instanceof alt.Player) {
        rmlElement.innerRML = `玩家: ${entity.id}号`;
    } else if (entity instanceof alt.Vehicle)
        rmlElement.innerRML = `车辆ID: ${entity.id}`;
    else {
        rmlElement.destroy();
        return;
    }

    nameTags.set(entity, rmlElement);
    container.appendChild(rmlElement);
    rmlElement.on("click", printCoordinates);

    if (tickHandle !== undefined) return;
    tickHandle = alt.everyTick(drawMarkers);
});

alt.on("gameEntityDestroy", (entity) => {
    if (container == null) return;
    const rmlElement = nameTags.get(entity);
    if (rmlElement === undefined) return;
    container.removeChild(rmlElement);
    rmlElement.destroy();
    nameTags.delete(entity);

    if (tickHandle === undefined || nameTags.size > 0) return;
    alt.clearEveryTick(tickHandle);
});

alt.on("keyup", (key) => {
    if (key !== controlKey) return;

    const currentState = alt.rmlControlsEnabled();
    if (currentState) {
        alt.toggleGameControls(true);
        alt.showCursor(false);
        alt.toggleRmlControls(false);
    } else {
        alt.toggleGameControls(false);
        alt.showCursor(true);
        alt.toggleRmlControls(true);
    }
});

function printCoordinates(rmlElement: alt.RmlElement) {
    const entity = alt.Entity.getByID(parseInt(rmlElement.rmlId));
    if (entity == null) return;
    alt.log("实体坐标", "X", entity.pos.x, "Y", entity.pos.y, "Z", entity.pos.z);
}

function drawMarkers() {
    nameTags.forEach((rmlElement, entity) => {
        const {x, y, z} = entity.pos;

        console.log('drawMarkers start');
        if (distance2d(new alt.Vector3(entity.pos), alt.Player.local.pos) > 20)
            return;

        if (!native.isSphereVisible(x, y, z, 0.0099999998)) {
            if (!rmlElement.shown) return;

            rmlElement.addClass("hide");
            rmlElement.shown = false;

            console.log('drawMarkers hide');
        } else {
            if (!rmlElement.shown) {
                rmlElement.removeClass("hide");
                rmlElement.shown = true;
                console.log('drawMarkers show');
            }

            const {x: screenX, y: screenY} = alt.worldToScreen(x, y, z + 2);
            rmlElement.style["left"] = `${screenX}px`;
            rmlElement.style["top"] = `${screenY}px`;

            const fontSizeModificator = Math.min(entity.pos.distanceTo(alt.Player.local.pos) / 100, 1);
            const fontSize = (1 - fontSizeModificator) * 50;
            rmlElement.style["font-size"] = `${fontSize}dp`;

            console.log('drawMarkers works');
        }
    });
}

function distance2d(vector1: alt.Vector3, vector2: alt.Vector3) {
    return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2));
}