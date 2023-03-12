const socket = io();

let currentLocation = null;
let deviceID = null;

socket.on("connect", () => {
  deviceID = localStorage.getItem("deviceID");

  if (!deviceID) {
    deviceID = prompt("Gib einen Namen ein:");
    localStorage.setItem("deviceID", deviceID);
  }

  const deviceIDElement = document.getElementById("device-id");
  deviceIDElement.innerHTML = `Deine Name: ${deviceID}`;

  socket.emit("device_id", deviceID);

  navigator.geolocation.watchPosition(
    (position) => {
      const location = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      currentLocation = location;

      socket.emit("location", location);
    },
    (error) => {
      console.log(error);
    },
    { enableHighAccuracy: true }
  );
});

socket.on("update", (data) => {
  const locationElement = document.getElementById(`location-${data.id}`);

  if (!locationElement) {
    const newLocationElement = document.createElement("div");
    newLocationElement.id = `location-${data.id}`;
    newLocationElement.className = "location";
    newLocationElement.innerHTML = `${data.id}: ${data.location.lat}, ${data.location.lon}`;
    document.body.appendChild(newLocationElement);
  } else {
    locationElement.innerHTML = `${data.id}: ${data.location.lat}, ${data.location.lon}`;
  }

  if (currentLocation) {
    const distance = getDistanceFromLatLonInKm(
      currentLocation.lat,
      currentLocation.lon,
      data.location.lat,
      data.location.lon
    );

    const distanceElement = document.getElementById(`distance-${data.id}`);

    if (!distanceElement) {
      const newDistanceElement = document.createElement("div");
      newDistanceElement.id = `distance-${data.id}`;
      newDistanceElement.className = "distance";
      newDistanceElement.innerHTML = `Du bist ${distance.toFixed(
        2
      )} km weit weg von ${data.id}`;
      document.body.appendChild(newDistanceElement);
    } else {
      distanceElement.innerHTML = `Du bist ${distance.toFixed(
        2
      )} km weit weg von ${data.id}`;
    }
  }
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
